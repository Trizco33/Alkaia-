import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store/store";
import { useCart } from "../store/cart";
import { useSeo } from "../components/Layout";
import {
  Reveal,
  IconArrow,
  IconBag,
  IconCheck,
  IconClose,
  IconFlame,
  IconMapPin,
  IconMinus,
  IconPackage,
  IconPlus,
} from "../components/ui";
import {
  quoteShipping,
  createOrder,
  isCheckoutConfigured,
  type ShippingOption,
  type CheckoutAddress,
} from "../lib/checkout";

/* ============================================================
   CARRINHO — /carrinho
   ============================================================ */
export function Cart() {
  const { formatPrice, track } = useStore();
  const { items, subtotal, setQty, remove } = useCart();
  useSeo("Carrinho", "Seu carrinho de compras Alkaia.");

  useEffect(() => {
    track("view_cart", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="shell py-28 text-center">
        <IconBag className="mx-auto h-10 w-10 text-terra" />
        <h1 className="mt-6 font-serif text-4xl text-ink">Seu carrinho está vazio.</h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] text-ink-soft">
          Escolha suas velas e monte seu momento de pausa.
        </p>
        <Link to="/velas" className="btn-primary mt-8">
          Ver velas <IconArrow className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12 sm:py-16">
      <h1 className="font-serif text-4xl text-ink sm:text-5xl">Carrinho</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Itens */}
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.productId} className="flex gap-4 rounded-[2px] border border-ink/10 bg-ghost p-4">
              <Link to={`/produto/${i.slug}`} className="h-28 w-24 shrink-0 overflow-hidden rounded-[2px] bg-linen">
                {i.image && <img src={i.image} alt={i.name} loading="lazy" className="h-full w-full object-cover" />}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/produto/${i.slug}`} className="font-serif text-xl text-ink hover:text-terra-dark">
                    {i.name}
                  </Link>
                  <button
                    onClick={() => remove(i.productId)}
                    aria-label={`Remover ${i.name} do carrinho`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-linen hover:text-ink"
                  >
                    <IconClose className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-[13px] text-ink-soft">{formatPrice(i.unitPrice)} cada</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-full border border-ink/15">
                    <button
                      onClick={() => setQty(i.productId, i.qty - 1)}
                      aria-label="Diminuir quantidade"
                      className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:text-terra"
                    >
                      <IconMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-ink">{i.qty}</span>
                    <button
                      onClick={() => setQty(i.productId, i.qty + 1)}
                      aria-label="Aumentar quantidade"
                      disabled={i.stock > 0 && i.qty >= i.stock}
                      className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:text-terra disabled:opacity-30"
                    >
                      <IconPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-[15px] font-medium text-ink">{formatPrice(i.unitPrice * i.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="h-fit rounded-[2px] border border-ink/10 bg-ghost p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl text-ink">Resumo</h2>
          <div className="mt-4 flex items-center justify-between text-[14px]">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-[12px] text-ink-soft">
            Frete calculado na próxima etapa — retirada em Artur Nogueira é grátis.
          </p>
          <div className="my-5 hairline" />
          <Link to="/checkout" className="btn-primary w-full">
            Finalizar compra <IconArrow className="h-4 w-4" />
          </Link>
          <Link to="/velas" className="mt-3 block text-center text-[13px] text-ink-soft hover:text-ink">
            Continuar comprando
          </Link>
          <p className="mt-5 text-center text-[11px] text-ink-soft/80">
            Pagamento seguro via Mercado Pago · Pix, cartão ou boleto
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CHECKOUT — /checkout
   ============================================================ */
const fieldCls =
  "w-full rounded-[2px] border border-ink/15 bg-cream px-3.5 py-3 text-[14px] text-ink placeholder:text-ink-soft/50 focus:border-terra focus:outline-none";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export function Checkout() {
  const { formatPrice, track } = useStore();
  const { items, subtotal } = useCart();
  useSeo("Checkout", "Finalize sua compra Alkaia com pagamento seguro via Mercado Pago.");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [method, setMethod] = useState<"retirada" | "pac" | "sedex">("retirada");
  const [cep, setCep] = useState("");
  const [addr, setAddr] = useState<Omit<CheckoutAddress, "cep">>({
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
  });
  const [quotes, setQuotes] = useState<ShippingOption[] | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteErr, setQuoteErr] = useState<string | null>(null);

  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    track("view_checkout", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wantsShipping = method !== "retirada";
  const cepDigits = onlyDigits(cep);

  /* ViaCEP: preencher endereço automaticamente */
  useEffect(() => {
    if (cepDigits.length !== 8) return;
    let alive = true;
    fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive || d?.erro) return;
        setAddr((a) => ({
          ...a,
          street: d.logradouro || a.street,
          district: d.bairro || a.district,
          city: d.localidade || a.city,
          state: d.uf || a.state,
        }));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [cepDigits]);

  /* Cotação de frete */
  useEffect(() => {
    if (cepDigits.length !== 8) {
      setQuotes(null);
      return;
    }
    let alive = true;
    setQuoting(true);
    setQuoteErr(null);
    quoteShipping(
      cepDigits,
      items.map((i) => ({ grams: i.grams, qty: i.qty }))
    )
      .then((d) => alive && setQuotes(d.options))
      .catch((e) => alive && setQuoteErr(e.message))
      .finally(() => alive && setQuoting(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepDigits]);

  const selectedQuote = quotes?.find((q) => q.service === method) || null;
  const shippingPrice = method === "retirada" ? 0 : selectedQuote?.price ?? null;
  const total = shippingPrice === null ? null : subtotal + shippingPrice;

  const canPay =
    items.length > 0 &&
    name.trim().length >= 3 &&
    /\S+@\S+\.\S+/.test(email) &&
    onlyDigits(phone).length >= 10 &&
    (!wantsShipping ||
      (selectedQuote !== null &&
        cepDigits.length === 8 &&
        addr.street.trim() !== "" &&
        addr.number.trim() !== "" &&
        addr.city.trim() !== "" &&
        addr.state.trim() !== ""));

  async function pay() {
    if (!canPay || busy) return;
    setBusy(true);
    setErr(null);
    try {
      const { initPoint } = await createOrder({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        customer: { name: name.trim(), email: email.trim(), phone: onlyDigits(phone) },
        shipping:
          method === "retirada"
            ? { method: "retirada" }
            : { method, address: { cep: cepDigits, ...addr } },
        note: note.trim() || undefined,
      });
      track("begin_payment", {});
      window.location.href = initPoint;
    } catch (e: any) {
      setErr(e?.message || "Não foi possível iniciar o pagamento. Tente novamente.");
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="shell py-28 text-center">
        <h1 className="font-serif text-4xl text-ink">Nada para pagar por aqui.</h1>
        <p className="mt-3 text-[14px] text-ink-soft">Seu carrinho está vazio.</p>
        <Link to="/velas" className="btn-primary mt-8">Ver velas</Link>
      </div>
    );
  }

  return (
    <div className="shell py-12 sm:py-16">
      <h1 className="font-serif text-4xl text-ink sm:text-5xl">Checkout</h1>
      {!isCheckoutConfigured && (
        <p className="mt-4 rounded-[2px] bg-terra/10 px-4 py-3 text-[13px] text-terra-dark">
          A loja está em manutenção no momento. Tente novamente mais tarde.
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          {/* 1. Dados */}
          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linen text-[13px] font-medium text-terra">1</span>
              Seus dados
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" className="sm:col-span-2">
                <input className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Seu nome" />
              </Field>
              <Field label="E-mail">
                <input className={fieldCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="voce@email.com" />
              </Field>
              <Field label="Celular / WhatsApp">
                <input className={fieldCls} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="(19) 99999-9999" />
              </Field>
            </div>
          </section>

          {/* 2. Entrega */}
          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linen text-[13px] font-medium text-terra">2</span>
              Entrega
            </h2>

            <div className="mt-5 grid gap-3">
              <button
                onClick={() => setMethod("retirada")}
                className={`flex items-center gap-4 rounded-[2px] border p-4 text-left transition-all ${method === "retirada" ? "border-terra bg-linen" : "border-ink/12 bg-ghost hover:border-ink/30"}`}
                aria-pressed={method === "retirada"}
              >
                <IconMapPin className="h-6 w-6 shrink-0 text-terra" />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">Retirada em Artur Nogueira — SP</span>
                  <span className="block text-[12px] text-ink-soft">Combinamos o horário com você após o pagamento.</span>
                </span>
                <span className="text-sm font-medium text-olive">Grátis</span>
              </button>

              <div className={`rounded-[2px] border p-4 transition-all ${wantsShipping ? "border-terra bg-linen" : "border-ink/12 bg-ghost"}`}>
                <div className="flex items-center gap-4">
                  <IconPackage className="h-6 w-6 shrink-0 text-terra" />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink">Receber pelos Correios</span>
                    <span className="block text-[12px] text-ink-soft">Informe seu CEP para calcular o frete.</span>
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Field label="CEP">
                    <input
                      className={fieldCls}
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      onFocus={() => method === "retirada" && setMethod("pac")}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </Field>
                </div>

                {quoting && <p className="mt-3 text-[13px] text-ink-soft">Calculando frete…</p>}
                {quoteErr && cepDigits.length === 8 && (
                  <p className="mt-3 rounded-[2px] bg-terra/10 px-3 py-2 text-[13px] text-terra-dark">{quoteErr}</p>
                )}

                {quotes && quotes.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {quotes.map((q) => (
                      <button
                        key={q.service}
                        onClick={() => setMethod(q.service)}
                        aria-pressed={method === q.service}
                        className={`flex items-center justify-between rounded-[2px] border px-4 py-3 text-left transition-all ${method === q.service ? "border-terra bg-cream" : "border-ink/12 bg-ghost hover:border-ink/30"}`}
                      >
                        <span>
                          <span className="block text-sm font-medium text-ink">{q.label}</span>
                          <span className="block text-[12px] text-ink-soft">até {q.days} dias úteis</span>
                        </span>
                        <span className="text-sm font-medium text-ink">{formatPrice(q.price)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {wantsShipping && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-6">
                    <Field label="Endereço" className="sm:col-span-4">
                      <input className={fieldCls} value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} autoComplete="address-line1" placeholder="Rua, avenida…" />
                    </Field>
                    <Field label="Número" className="sm:col-span-2">
                      <input className={fieldCls} value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} placeholder="123" />
                    </Field>
                    <Field label="Complemento" className="sm:col-span-3">
                      <input className={fieldCls} value={addr.complement} onChange={(e) => setAddr({ ...addr, complement: e.target.value })} placeholder="Apto, bloco (opcional)" />
                    </Field>
                    <Field label="Bairro" className="sm:col-span-3">
                      <input className={fieldCls} value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} placeholder="Bairro" />
                    </Field>
                    <Field label="Cidade" className="sm:col-span-4">
                      <input className={fieldCls} value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} placeholder="Cidade" />
                    </Field>
                    <Field label="UF" className="sm:col-span-2">
                      <input className={fieldCls} value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value.toUpperCase().slice(0, 2) })} placeholder="SP" maxLength={2} />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. Observações */}
          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linen text-[13px] font-medium text-terra">3</span>
              Observações <span className="text-sm font-sans text-ink-soft">(opcional)</span>
            </h2>
            <textarea
              className={`${fieldCls} mt-5 min-h-24`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Alguma observação sobre o pedido? Presente, dedicatória…"
            />
          </section>
        </div>

        {/* Resumo lateral */}
        <div className="h-fit rounded-[2px] border border-ink/10 bg-ghost p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl text-ink">Seu pedido</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.productId} className="flex items-center gap-3">
                <span className="h-14 w-12 shrink-0 overflow-hidden rounded-[2px] bg-linen">
                  {i.image && <img src={i.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </span>
                <span className="flex-1 text-[13px] text-ink">
                  {i.name} <span className="text-ink-soft">× {i.qty}</span>
                </span>
                <span className="text-[13px] font-medium text-ink">{formatPrice(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="my-5 hairline" />
          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Frete</span>
              <span className="text-ink">
                {method === "retirada" ? "Grátis" : selectedQuote ? formatPrice(selectedQuote.price) : "—"}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-[16px] font-medium">
              <span className="text-ink">Total</span>
              <span className="text-ink">{total !== null ? formatPrice(total) : "—"}</span>
            </div>
          </div>
          {err && <p className="mt-4 rounded-[2px] bg-terra/10 px-3 py-2 text-[13px] text-terra-dark">{err}</p>}
          <button onClick={pay} disabled={!canPay || busy || !isCheckoutConfigured} className="btn-primary mt-5 w-full">
            {busy ? "Redirecionando…" : "Pagar com Mercado Pago"}
          </button>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-soft/80">
            Você será redirecionada para o ambiente seguro do Mercado Pago.
            <br />Pix · Cartão de crédito · Boleto
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONFIRMAÇÃO — /pedido/confirmacao (back_url do Mercado Pago)
   ============================================================ */
export function OrderConfirm() {
  const { search } = useLocation();
  const { clear } = useCart();
  useSeo("Pedido", "Status do seu pedido Alkaia.");

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const status = (params.get("collection_status") || params.get("status") || "").toLowerCase();
  const orderRef = params.get("external_reference") || params.get("order") || "";

  const ok = status === "approved" || status === "success";
  const pending = status === "pending" || status === "in_process";

  useEffect(() => {
    if (ok || pending) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok, pending]);

  return (
    <div className="shell py-28 text-center">
      <Reveal>
        {ok ? (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linen text-olive">
              <IconCheck className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-serif text-4xl text-ink sm:text-5xl">Pedido confirmado!</h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Recebemos seu pagamento. Em breve entraremos em contato pelo e-mail ou WhatsApp
              informado para combinar a entrega ou retirada.
            </p>
          </>
        ) : pending ? (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linen text-terra">
              <IconFlame className="h-8 w-8 animate-flicker" />
            </span>
            <h1 className="mt-6 font-serif text-4xl text-ink sm:text-5xl">Aguardando pagamento.</h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Seu pedido foi registrado e estamos aguardando a confirmação do pagamento
              (Pix e boleto podem levar alguns instantes). Você receberá a confirmação por e-mail.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linen text-terra-dark">
              <IconClose className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-serif text-4xl text-ink sm:text-5xl">Pagamento não concluído.</h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Não se preocupe — nada foi cobrado. Seu carrinho continua salvo e você pode
              tentar novamente quando quiser.
            </p>
          </>
        )}
        {orderRef && <p className="mt-4 text-[12px] text-ink-soft/70">Pedido: {orderRef}</p>}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {!ok && !pending && (
            <Link to="/checkout" className="btn-primary">Tentar novamente</Link>
          )}
          <Link to="/velas" className={ok || pending ? "btn-primary" : "btn-outline"}>
            {ok || pending ? "Continuar navegando" : "Ver velas"}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
