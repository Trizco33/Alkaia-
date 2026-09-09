/* ============================================================
   ALKAIA — Consulta de status de pedido (polling do Pix)
   POST { orderId } → { status, mpStatus }

   O id do pedido é um UUID (impossível de adivinhar) e a
   resposta expõe SOMENTE o status — nenhum dado do cliente.
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Requisição inválida." }, 400);
  }
  const orderId = String(body.orderId || "").trim();
  if (!UUID_RE.test(orderId)) return json({ error: "Pedido inválido." }, 400);

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
  const { data: order, error } = await db
    .from("orders")
    .select("status, mp_status")
    .eq("id", orderId)
    .single();
  if (error || !order) return json({ error: "Pedido não encontrado." }, 404);

  return json({ status: order.status, mpStatus: order.mp_status || null });
});
