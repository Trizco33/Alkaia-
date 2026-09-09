/* ============================================================
   ALKAIA — SDK do Mercado Pago (Payment Brick)
   Carrega https://sdk.mercadopago.com/js/v2 sob demanda (o SDK
   não pode ser empacotado no bundle) e monta o Payment Brick.

   A PUBLIC KEY é pública por design (vai no HTML de qualquer
   loja com Mercado Pago) — não é um segredo.
   ============================================================ */

// Public Key de produção da conta da Alkaia (app Alkaiaml).
// Hardcoded de propósito: é pública por design e evita depender de env var no Vercel.
export const MP_PUBLIC_KEY = "APP_USR-ef1e571b-c188-4956-9bc0-cee1b17766ef";

export const isPaymentBrickConfigured = Boolean(MP_PUBLIC_KEY);

type BrickController = { unmount: () => void };

interface BricksBuilder {
  create: (
    brick: string,
    containerId: string,
    settings: Record<string, unknown>
  ) => Promise<BrickController>;
}

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, opts?: { locale?: string }) => {
      bricks: () => BricksBuilder;
    };
  }
}

let sdkPromise: Promise<void> | null = null;

/** Injeta o script do SDK uma única vez. */
function loadSdk(): Promise<void> {
  if (window.MercadoPago) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://sdk.mercadopago.com/js/v2";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      sdkPromise = null;
      reject(new Error("Não foi possível carregar o pagamento. Verifique sua conexão."));
    };
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export interface BrickSubmitData {
  selectedPaymentMethod: string;
  formData: Record<string, unknown>;
}

/**
 * Monta o Payment Brick no container indicado.
 * `onSubmit` deve resolver quando o pagamento foi processado
 * (ou rejeitar para o Brick liberar o botão de novo).
 * Retorna o controller — chame `unmount()` ao desmontar a tela.
 */
export async function mountPaymentBrick(opts: {
  containerId: string;
  amount: number;
  payerEmail?: string;
  onSubmit: (data: BrickSubmitData) => Promise<void>;
  onReady?: () => void;
  onError?: (error: unknown) => void;
}): Promise<BrickController> {
  if (!MP_PUBLIC_KEY) throw new Error("Pagamento em manutenção. Tente novamente em instantes.");
  await loadSdk();
  const mp = new window.MercadoPago!(MP_PUBLIC_KEY, { locale: "pt-BR" });
  const bricks = mp.bricks();
  return bricks.create("payment", opts.containerId, {
    initialization: {
      amount: opts.amount,
      ...(opts.payerEmail ? { payer: { email: opts.payerEmail } } : {}),
    },
    customization: {
      paymentMethods: {
        creditCard: "all",
        bankTransfer: "all", // Pix
        ticket: "all", // Boleto
        maxInstallments: 6,
      },
      visual: {
        style: { theme: "default" },
        hidePaymentButton: false,
      },
    },
    callbacks: {
      onReady: () => opts.onReady?.(),
      onSubmit: (data: BrickSubmitData) => opts.onSubmit(data),
      onError: (error: unknown) => opts.onError?.(error),
    },
  });
}

/** Mensagens amigáveis para recusas comuns de cartão. */
export function friendlyRejection(statusDetail: string): string {
  const map: Record<string, string> = {
    cc_rejected_insufficient_amount: "Cartão sem limite disponível. Tente outro cartão.",
    cc_rejected_bad_filled_card_number: "Número do cartão incorreto. Confira e tente de novo.",
    cc_rejected_bad_filled_date: "Data de validade incorreta. Confira e tente de novo.",
    cc_rejected_bad_filled_security_code: "Código de segurança (CVV) incorreto. Confira e tente de novo.",
    cc_rejected_bad_filled_other: "Algum dado do cartão está incorreto. Confira e tente de novo.",
    cc_rejected_call_for_authorize: "O banco pediu autorização. Ligue para o seu banco e tente de novo.",
    cc_rejected_card_disabled: "Cartão desativado. Ligue para o seu banco ou use outro cartão.",
    cc_rejected_duplicated_payment: "Você já fez um pagamento com esse valor. Se precisar pagar de novo, use outro cartão.",
    cc_rejected_high_risk: "O pagamento não foi autorizado. Tente outro meio de pagamento.",
    cc_rejected_max_attempts: "Muitas tentativas seguidas. Aguarde alguns minutos ou use outro cartão.",
    cc_rejected_other_reason: "O cartão não autorizou o pagamento. Tente outro cartão.",
  };
  return map[statusDetail] || "O pagamento não foi aprovado. Confira os dados ou tente outro meio de pagamento.";
}
