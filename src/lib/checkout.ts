/* ============================================================
   ALKAIA — Cliente das edge functions de venda (Supabase)
   shipping-quote  → cotação de frete Correios (SuperFrete)
   create-order    → valida carrinho, cria pedido e preferência
                     do Mercado Pago; retorna URL de pagamento
   ============================================================ */

const base = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isCheckoutConfigured = Boolean(base && anon);

async function callFn<T>(name: string, body: unknown): Promise<T> {
  if (!base || !anon) throw new Error("Loja em manutenção. Tente novamente em instantes.");
  const res = await fetch(`${base}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anon}`,
      apikey: anon,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Não foi possível concluir. Tente novamente.");
  return data as T;
}

export interface ShippingOption {
  service: "pac" | "sedex";
  label: string;
  price: number;
  days: number;
}

export function quoteShipping(cep: string, items: { grams: number; qty: number }[]) {
  return callFn<{ options: ShippingOption[] }>("shipping-quote", { cep, items });
}

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

export interface CreateOrderInput {
  items: { productId: string; qty: number }[];
  customer: CheckoutCustomer;
  shipping:
    | { method: "retirada" }
    | { method: "pac" | "sedex"; address: CheckoutAddress };
  note?: string;
}

export function createOrder(input: CreateOrderInput) {
  return callFn<{ orderId: string; initPoint: string }>("create-order", input);
}

/* ---------- Checkout transparente (Payment Brick) ---------- */

/** formData entregue pelo onSubmit do Payment Brick (repassado como está). */
export interface BrickPaymentData {
  payment_method_id?: string;
  token?: string;
  installments?: number;
  issuer_id?: string | number;
  payer?: Record<string, unknown>;
  [k: string]: unknown;
}

export interface ProcessPaymentResult {
  orderId: string;
  paymentId: string;
  status: string; // approved | pending | in_process | rejected | ...
  statusDetail: string;
  pix?: { qrCode: string; qrCodeBase64: string; ticketUrl: string };
  boleto?: { url: string };
}

export function processPayment(input: CreateOrderInput & { payment: BrickPaymentData }) {
  return callFn<ProcessPaymentResult>("process-payment", input);
}

export function fetchOrderStatus(orderId: string) {
  return callFn<{ status: string; mpStatus: string | null }>("order-status", { orderId });
}
