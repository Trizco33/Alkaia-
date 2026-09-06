/* ============================================================
   ALKAIA — Webhook do Mercado Pago
   Recebe notificações de pagamento, atualiza o pedido e baixa
   o estoque quando o pagamento é aprovado (uma única vez).

   Deploy: precisa ser público (sem JWT):
     supabase functions deploy mp-webhook --no-verify-jwt
   (ou verify_jwt = false no config.toml)

   Secrets necessários:
   - MP_ACCESS_TOKEN  credencial de produção do Mercado Pago
   (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são automáticos)
   ============================================================ */

import { createClient } from "jsr:@supabase/supabase-js@2";

const ok = () => new Response("ok", { status: 200 });

type MpPayment = {
  id?: number | string;
  status?: string;
  external_reference?: string;
};

function mapStatus(mp: string): string | null {
  switch (mp) {
    case "approved":
      return "pago";
    case "rejected":
    case "cancelled":
      return "cancelado";
    case "refunded":
    case "charged_back":
      return "reembolsado";
    case "pending":
    case "in_process":
    case "authorized":
      return "pendente";
    default:
      return null;
  }
}

Deno.serve(async (req) => {
  // O MP espera 200/201 rápido; qualquer falha nossa não deve
  // gerar retry infinito com erro 500 sem necessidade.
  try {
    const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpToken) return ok();

    const url = new URL(req.url);
    let paymentId =
      url.searchParams.get("data.id") ||
      url.searchParams.get("id") ||
      "";
    let topic = url.searchParams.get("type") || url.searchParams.get("topic") || "";

    if (req.method === "POST") {
      const body = await req.json().catch(() => null);
      if (body) {
        topic = body.type || body.topic || topic;
        paymentId = body?.data?.id?.toString?.() || paymentId;
      }
    }

    if (!paymentId || (topic && !String(topic).includes("payment"))) return ok();

    // Busca o pagamento no MP (fonte da verdade)
    const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
    });
    if (!payRes.ok) return ok();
    const payment = (await payRes.json().catch(() => null)) as MpPayment | null;
    const orderId = payment?.external_reference;
    const mpStatus = String(payment?.status || "");
    if (!orderId || !mpStatus) return ok();

    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: order } = await db
      .from("orders")
      .select("id, status, items, stock_debited")
      .eq("id", orderId)
      .single();
    if (!order) return ok();

    const newStatus = mapStatus(mpStatus);
    const patch: Record<string, unknown> = {
      mp_payment_id: String(payment!.id ?? paymentId),
      mp_status: mpStatus,
    };
    // não rebaixa um pedido já pago/enviado para "pendente"
    const protectedStates = ["pago", "em_preparo", "enviado", "entregue"];
    if (newStatus && !(newStatus === "pendente" && protectedStates.includes(order.status))) {
      patch.status = newStatus;
    }

    // Baixa de estoque — apenas uma vez, quando aprovado
    if (mpStatus === "approved" && !order.stock_debited) {
      const items = Array.isArray(order.items)
        ? (order.items as { productId?: string; qty?: number }[])
        : [];
      for (const it of items) {
        if (!it.productId || !it.qty) continue;
        const { data: p } = await db
          .from("products")
          .select("stock")
          .eq("id", it.productId)
          .single();
        if (p) {
          await db
            .from("products")
            .update({ stock: Math.max(0, Number(p.stock) - Number(it.qty)) })
            .eq("id", it.productId);
        }
      }
      patch.stock_debited = true;
    }

    await db.from("orders").update(patch).eq("id", orderId);
    return ok();
  } catch (e) {
    console.error("mp-webhook", e);
    return ok();
  }
});
