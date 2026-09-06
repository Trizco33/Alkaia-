/* ============================================================
   ALKAIA — Cotação de frete (SuperFrete → Correios PAC/SEDEX)
   POST { cep: string, items: [{ grams: number, qty: number }] }
   → { options: [{ service, label, price, days }] }

   Secrets necessários (Supabase → Edge Functions → Secrets):
   - SUPERFRETE_TOKEN  token da API SuperFrete
   - FROM_CEP          CEP de origem (Artur Nogueira — SP)
   ============================================================ */

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const token = Deno.env.get("SUPERFRETE_TOKEN");
  const fromCep = (Deno.env.get("FROM_CEP") || "13160000").replace(/\D/g, "");
  if (!token) return json({ error: "Frete indisponível no momento." }, 503);

  let body: { cep?: string; items?: { grams?: number; qty?: number }[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Requisição inválida." }, 400);
  }

  const cep = String(body.cep || "").replace(/\D/g, "");
  if (cep.length !== 8) return json({ error: "CEP inválido." }, 400);

  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return json({ error: "Carrinho vazio." }, 400);

  // Peso total em kg (mínimo 300 g) — caixa padrão 20x15x15 cm
  const grams = items.reduce(
    (s, i) => s + Math.max(1, Number(i.grams) || 350) * Math.max(1, Number(i.qty) || 1),
    0
  );
  const weightKg = Math.max(0.3, grams / 1000);

  try {
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
        services: "1,2", // 1 = PAC, 2 = SEDEX
        options: {
          own_hand: false,
          receipt: false,
          insurance_value: 0,
          use_insurance_value: false,
        },
        package: { height: 15, width: 15, length: 20, weight: weightKg },
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(data)) {
      console.error("superfrete error", res.status, JSON.stringify(data));
      return json({ error: "Não foi possível calcular o frete. Confira o CEP." }, 502);
    }

    const options = data
      .filter((o: Record<string, unknown>) => !o.error && Number(o.price) > 0)
      .map((o: Record<string, unknown>) => {
        const name = String(o.name || "").toLowerCase();
        const service: "pac" | "sedex" = name.includes("sedex") ? "sedex" : "pac";
        return {
          service,
          label: service === "sedex" ? "SEDEX" : "PAC",
          price: Math.round(Number(o.price) * 100) / 100,
          days: Number((o.delivery_time as Record<string, unknown> | undefined)?.days ?? o.delivery_time ?? 0) || 0,
        };
      })
      // remove duplicatas por serviço (fica o mais barato)
      .sort((a, b) => a.price - b.price)
      .filter((o, idx, arr) => arr.findIndex((x) => x.service === o.service) === idx)
      .sort((a, b) => a.price - b.price);

    if (!options.length) {
      return json({ error: "Nenhuma opção de envio disponível para este CEP." }, 422);
    }
    return json({ options });
  } catch (e) {
    console.error("shipping-quote", e);
    return json({ error: "Não foi possível calcular o frete agora. Tente novamente." }, 502);
  }
});
