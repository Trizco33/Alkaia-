/* ============================================================
   ALKAIA — Criação de pedido + preferência Mercado Pago
   POST {
     items: [{ productId, qty }],
     customer: { name, email, phone },
     shipping: { method: "retirada" } |
               { method: "pac"|"sedex", address: { cep, street, number,
                 complement?, district, city, state } },
     note?: string
   }
   → { orderId, initPoint }

   Preços e estoque são validados no banco (nunca confiamos no
   navegador). Frete é recotado no servidor via SuperFrete.

   Secrets necessários:
   - MP_ACCESS_TOKEN   credencial de produção do Mercado Pago
   - SITE_URL          ex.: https://alkaia.com.br
   - SUPERFRETE_TOKEN  token da API SuperFrete
   - FROM_CEP          CEP de origem
   (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são automáticos)
   ============================================================ */

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

interface OrderItemIn {
  productId?: string;
  qty?: number;
}
interface Address {
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
}
interface BodyIn {
  items?: OrderItemIn[];
  customer?: { name?: string; email?: string; phone?: string };
  shipping?: { method?: string; address?: Address };
  note?: string;
}

function parseGrams(weight: string): number {
  const m = String(weight || "").replace(",", ".").match(/([\d.]+)\s*(kg|g)?/i);
  if (!m) return 350;
  const n = parseFloat(m[1]);
  if (!isFinite(n) || n <= 0) return 350;
  return /kg/i.test(m[2] || "") ? Math.round(n * 1000) : Math.round(n);
}

async function quoteShipping(
  cep: string,
  grams: number
): Promise<{ pac?: { price: number; days: number }; sedex?: { price: number; days: number } }> {
  const token = Deno.env.get("SUPERFRETE_TOKEN");
  const fromCep = (Deno.env.get("FROM_CEP") || "13160000").replace(/\D/g, "");
  if (!token) throw new Error("Frete indisponível.");
  const res = await fetch("https://api.superfrete.com/api/v0/calculator", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Alkaia (loja@alkaia.com.br)",
    },
    body: JSON.stringify({
      from: { postal_code: fromCep },
      to: { postal_code: cep },
      services: "1,2",
      options: { own_hand: false, receipt: false, insurance_value: 0, use_insurance_value: false },
      package: { height: 15, width: 15, length: 20, weight: Math.max(0.3, grams / 1000) },
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !Array.isArray(data)) throw new Error("Falha ao cotar frete.");
  const out: { pac?: { price: number; days: number }; sedex?: { price: number; days: number } } = {};
  for (const o of data as Record<string, unknown>[]) {
    if (o.error || !(Number(o.price) > 0)) continue;
    const service = String(o.name || "").toLowerCase().includes("sedex") ? "sedex" : "pac";
    const price = Math.round(Number(o.price) * 100) / 100;
    const days =
      Number((o.delivery_time as Record<string, unknown> | undefined)?.days ?? o.delivery_time ?? 0) || 0;
    if (!out[service] || out[service]!.price > price) out[service] = { price, days };
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
  const siteUrl = (Deno.env.get("SITE_URL") || "").replace(/\/+$/, "");
  const supaUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!mpToken || !siteUrl) return json({ error: "Loja em manutenção. Tente novamente em instantes." }, 503);

  let body: BodyIn;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Requisição inválida." }, 400);
  }

  // ---------- validação de entrada ----------
  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items = rawItems
    .map((i) => ({ productId: String(i.productId || ""), qty: Math.floor(Number(i.qty) || 0) }))
    .filter((i) => i.productId && i.qty > 0 && i.qty <= 50);
  if (!items.length) return json({ error: "Carrinho vazio." }, 400);

  const name = String(body.customer?.name || "").trim().slice(0, 120);
  const email = String(body.customer?.email || "").trim().toLowerCase().slice(0, 160);
  const phone = String(body.customer?.phone || "").replace(/\D/g, "").slice(0, 13);
  if (name.length < 3) return json({ error: "Informe seu nome completo." }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "E-mail inválido." }, 400);
  if (phone.length < 10) return json({ error: "Telefone inválido." }, 400);

  const method = String(body.shipping?.method || "");
  if (!["retirada", "pac", "sedex"].includes(method)) return json({ error: "Forma de entrega inválida." }, 400);

  let address: Address | null = null;
  if (method !== "retirada") {
    const a = body.shipping?.address || {};
    address = {
      cep: String(a.cep || "").replace(/\D/g, ""),
      street: String(a.street || "").trim().slice(0, 160),
      number: String(a.number || "").trim().slice(0, 20),
      complement: String(a.complement || "").trim().slice(0, 120),
      district: String(a.district || "").trim().slice(0, 120),
      city: String(a.city || "").trim().slice(0, 120),
      state: String(a.state || "").trim().toUpperCase().slice(0, 2),
    };
    if (
      address.cep!.length !== 8 ||
      !address.street ||
      !address.number ||
      !address.city ||
      address.state!.length !== 2
    ) {
      return json({ error: "Endereço incompleto. Confira os campos." }, 400);
    }
  }

  // ---------- validação no banco (service role) ----------
  const db = createClient(supaUrl, serviceKey, { auth: { persistSession: false } });
  const ids = items.map((i) => i.productId);
  const { data: products, error: perr } = await db
    .from("products")
    .select("id, name, slug, weight, price, sale_price, stock, status, images")
    .in("id", ids);
  if (perr) {
    console.error("db products", perr);
    return json({ error: "Erro ao validar os produtos. Tente novamente." }, 500);
  }

  const lineItems: {
    productId: string;
    name: string;
    slug: string;
    qty: number;
    unitPrice: number;
    grams: number;
    image: string;
  }[] = [];
  for (const it of items) {
    const p = products?.find((x) => x.id === it.productId);
    if (!p || p.status !== "active") return json({ error: "Um dos produtos não está mais disponível." }, 409);
    if (Number(p.stock) < it.qty) {
      return json({ error: `Estoque insuficiente de "${p.name}". Restam ${p.stock} unidade(s).` }, 409);
    }
    const price = Number(p.price) || 0;
    const sale = p.sale_price == null ? null : Number(p.sale_price);
    const unitPrice = sale && sale > 0 && sale < price ? sale : price;
    if (unitPrice <= 0) return json({ error: `Produto "${p.name}" sem preço válido.` }, 409);
    const imgs = Array.isArray(p.images) ? (p.images as string[]) : [];
    lineItems.push({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      qty: it.qty,
      unitPrice,
      grams: parseGrams(p.weight),
      image: imgs[0] || "",
    });
  }

  const subtotal = Math.round(lineItems.reduce((s, i) => s + i.unitPrice * i.qty, 0) * 100) / 100;

  // ---------- frete (recotado no servidor) ----------
  let shippingPrice = 0;
  let shippingDays: number | null = null;
  if (method !== "retirada") {
    const grams = lineItems.reduce((s, i) => s + i.grams * i.qty, 0);
    let quotes;
    try {
      quotes = await quoteShipping(address!.cep!, grams);
    } catch (e) {
      console.error("quote", e);
      return json({ error: "Não foi possível confirmar o frete. Tente novamente." }, 502);
    }
    const q = quotes[method as "pac" | "sedex"];
    if (!q) return json({ error: "Esta opção de envio não está disponível para o seu CEP." }, 422);
    shippingPrice = q.price;
    shippingDays = q.days;
  }

  const total = Math.round((subtotal + shippingPrice) * 100) / 100;

  // ---------- cria o pedido ----------
  const { data: order, error: oerr } = await db
    .from("orders")
    .insert({
      status: "pendente",
      items: lineItems,
      subtotal,
      shipping_method: method,
      shipping_price: shippingPrice,
      shipping_days: shippingDays,
      total,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      address,
      note: String(body.note || "").slice(0, 500),
    })
    .select("id")
    .single();
  if (oerr || !order) {
    console.error("db insert order", oerr);
    return json({ error: "Não foi possível registrar o pedido. Tente novamente." }, 500);
  }

  // ---------- preferência Mercado Pago ----------
  const backBase = `${siteUrl}/#/pedido/confirmacao`;
  const prefBody = {
    items: [
      ...lineItems.map((i) => ({
        id: i.productId,
        title: i.name,
        quantity: i.qty,
        unit_price: i.unitPrice,
        currency_id: "BRL",
        picture_url: i.image || undefined,
      })),
      ...(shippingPrice > 0
        ? [
            {
              id: "frete",
              title: `Frete (${method.toUpperCase()})`,
              quantity: 1,
              unit_price: shippingPrice,
              currency_id: "BRL",
            },
          ]
        : []),
    ],
    payer: { name, email, phone: { number: phone } },
    external_reference: order.id,
    back_urls: {
      success: `${backBase}?order=${order.id}`,
      pending: `${backBase}?order=${order.id}`,
      failure: `${backBase}?order=${order.id}`,
    },
    auto_return: "approved",
    notification_url: `${supaUrl}/functions/v1/mp-webhook`,
    statement_descriptor: "ALKAIA",
  };

  const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { Authorization: `Bearer ${mpToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(prefBody),
  });
  const pref = await mpRes.json().catch(() => null);
  if (!mpRes.ok || !pref?.init_point) {
    console.error("mp preference", mpRes.status, JSON.stringify(pref));
    await db.from("orders").update({ status: "cancelado", mp_status: "preference_error" }).eq("id", order.id);
    return json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, 502);
  }

  await db.from("orders").update({ mp_preference_id: pref.id }).eq("id", order.id);

  return json({ orderId: order.id, initPoint: pref.init_point });
});
