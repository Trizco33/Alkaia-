import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import { Reveal, SectionHeader, IconArrow, IconPlus, IconInstagram, IconTikTok, IconWhatsApp, IconMail, IconCheck } from "../components/ui";
import { seedFaqs } from "../data/seed";

/* ============ ENCOMENDAS ESPECIAIS ============ */
export function Encomendas() {
  const { addOrder, track, products } = useStore();
  useSeo("Encomendas Especiais", "Encomendas personalizadas Alkaia: presentes corporativos, eventos, lembranças, kits e compras em quantidade.");

  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    type: "Presentes corporativos",
    quantity: "",
    interest: "",
    date: "",
    message: "",
  });

  const types = ["Presentes corporativos", "Eventos", "Lembranças", "Kits", "Produtos para SPA", "Uso profissional", "Compras em quantidade", "Personalizado"];

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await addOrder(form);
      track("click_special_order", {});
      setDone(true);
    } catch (e: any) {
      setErr(e?.message || "Não foi possível enviar. Tente novamente ou fale conosco pelo WhatsApp.");
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full rounded-[2px] border border-ink/15 bg-ghost px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-terra placeholder:text-ink-soft/50";

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Encomendas especiais"
          title="Feita para o seu momento"
          text="Criamos encomendas personalizadas, presentes corporativos, lembranças, kits e produtos para spas. Conte o que você precisa."
        />
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal className="space-y-6">
          <div className="rounded-[2px] bg-linen p-8">
            <h3 className="font-serif text-2xl text-ink">O que criamos</h3>
            <ul className="mt-4 space-y-2.5 text-[14px] text-ink-soft">
              {["Presentes corporativos e brindes", "Lembranças para eventos", "Kits autorais e personalizados", "Aromas para spas e profissionais", "Compras em quantidade"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ghost text-terra"><IconCheck className="h-3 w-3" /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[14px] leading-relaxed text-ink-soft">
            Depois do envio, sua solicitação é registrada e nossa equipe entra em contato pelo WhatsApp ou e-mail para combinar todos os detalhes.
          </p>
        </Reveal>

        <Reveal delay={120}>
          {done ? (
            <div className="flex flex-col items-center justify-center rounded-[2px] border border-ink/10 bg-ghost px-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-linen text-olive"><IconCheck className="h-8 w-8" /></span>
              <h3 className="mt-6 font-serif text-3xl text-ink">Solicitação enviada!</h3>
              <p className="mt-3 max-w-sm text-[14px] text-ink-soft">Recebemos o seu pedido e vamos cuidar de cada detalhe. Em breve entraremos em contato.</p>
              <button onClick={() => setDone(false)} className="btn-outline mt-8">Fazer outra encomenda</button>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-[2px] border border-ink/10 bg-ghost p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Nome *</label>
                  <input name="name" required value={form.name} onChange={handle} className={input} placeholder="Seu nome" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">WhatsApp *</label>
                  <input name="whatsapp" required value={form.whatsapp} onChange={handle} className={input} placeholder="(00) 00000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[12px] text-ink-soft">E-mail *</label>
                  <input name="email" type="email" required value={form.email} onChange={handle} className={input} placeholder="voce@email.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Tipo de encomenda *</label>
                  <select name="type" value={form.type} onChange={handle} className={input}>
                    {types.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Quantidade aproximada</label>
                  <input name="quantity" value={form.quantity} onChange={handle} className={input} placeholder="Ex: 20 unidades" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Produto de interesse</label>
                  <select name="interest" value={form.interest} onChange={handle} className={input}>
                    <option value="">Selecione um produto</option>
                    {products.filter((p) => p.status === "active").map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Data desejada</label>
                  <input name="date" type="date" value={form.date} onChange={handle} className={input} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Mensagem</label>
                  <textarea name="message" value={form.message} onChange={handle} rows={4} className={input} placeholder="Conte a sua ideia..." />
                </div>
              </div>
              {err && <p className="mt-4 rounded-[2px] bg-terra/10 px-4 py-3 text-[13px] text-terra-dark">{err}</p>}
              <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
                {busy ? "Enviando..." : "Solicitar encomenda"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}

/* ============ FAQ ============ */
export function Faq() {
  const { track } = useStore();
  useSeo("Perguntas Frequentes", "Dúvidas frequentes sobre as velas artesanais Alkaia, encomendas e formas de compra.");
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    track("view_faq", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shell-narrow py-16 sm:py-24">
      <Reveal>
        <SectionHeader eyebrow="FAQ" title="Perguntas frequentes" text="Tudo o que você precisa saber antes de acender a primeira chama." />
      </Reveal>

      <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
        {seedFaqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="font-serif text-lg text-ink">{f.q}</span>
                <IconPlus className={`h-5 w-5 shrink-0 text-terra transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </button>
              {isOpen && (
                <p className="pb-5 pl-0 pr-6 text-[14px] leading-relaxed text-ink-soft animate-fade-in">{f.a}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 rounded-[2px] bg-linen px-6 py-10 text-center">
        <p className="font-serif text-2xl text-ink text-balance">Ainda ficou com alguma dúvida?</p>
        <Link to="/contato" className="btn-primary">Fale com a Alkaia</Link>
      </div>
    </div>
  );
}

/* ============ CONTATO ============ */
export function Contato() {
  const { settings, addMessage, track } = useStore();
  useSeo("Contato", "Fale com a Alkaia: Instagram, TikTok, WhatsApp e e-mail.");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await addMessage(form);
      track("click_contact", {});
      setDone(true);
    } catch (e: any) {
      setErr(e?.message || "Não foi possível enviar. Tente novamente ou fale conosco pelo WhatsApp.");
    } finally {
      setBusy(false);
    }
  };

  const socials = [
    { name: "Instagram", handle: "@alkaia", href: settings.instagram, icon: <IconInstagram className="h-6 w-6" /> },
    { name: "TikTok", handle: "@alkaia", href: settings.tiktok, icon: <IconTikTok className="h-6 w-6" /> },
    { name: "WhatsApp", handle: settings.whatsappDisplay, href: `https://wa.me/${settings.whatsapp}`, icon: <IconWhatsApp className="h-6 w-6" /> },
    { name: "E-mail", handle: settings.email, href: `mailto:${settings.email}`, icon: <IconMail className="h-6 w-6" /> },
  ];

  const input = "w-full rounded-[2px] border border-ink/15 bg-ghost px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-terra placeholder:text-ink-soft/50";

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader eyebrow="Contato" title="Vamos conversar" text="Quer saber mais sobre a Alkaia, um produto ou uma encomenda? Escreva para a gente." />
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal className="space-y-4">
          {socials.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-[2px] border border-ink/10 bg-ghost p-5 transition-all hover:border-ink/30">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linen text-terra transition-colors group-hover:bg-ink group-hover:text-cream">{s.icon}</span>
              <div>
                <p className="text-[12px] uppercase tracking-widest text-ink-soft/70">{s.name}</p>
                <p className="text-[14px] font-medium text-ink">{s.handle}</p>
              </div>
              <IconArrow className="ml-auto h-4 w-4 text-terra" />
            </a>
          ))}
          <p className="pt-2 text-[13px] text-ink-soft">{settings.city} · Atendimento com carinho.</p>
        </Reveal>

        <Reveal delay={100}>
          {done ? (
            <div className="flex flex-col items-center justify-center rounded-[2px] border border-ink/10 bg-ghost px-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-linen text-olive"><IconCheck className="h-8 w-8" /></span>
              <h3 className="mt-6 font-serif text-3xl text-ink">Mensagem enviada!</h3>
              <p className="mt-3 max-w-sm text-[14px] text-ink-soft">Obrigada por escrever para a Alkaia. Responderemos em breve.</p>
              <button onClick={() => setDone(false)} className="btn-outline mt-8">Enviar outra mensagem</button>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-[2px] border border-ink/10 bg-ghost p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Nome *</label>
                  <input name="name" required value={form.name} onChange={handle} className={input} placeholder="Seu nome" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-ink-soft">E-mail *</label>
                  <input name="email" type="email" required value={form.email} onChange={handle} className={input} placeholder="voce@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Assunto *</label>
                  <input name="subject" required value={form.subject} onChange={handle} className={input} placeholder="Assunto" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[12px] text-ink-soft">Mensagem *</label>
                  <textarea name="message" required value={form.message} onChange={handle} rows={5} className={input} placeholder="Escreva sua mensagem..." />
                </div>
              </div>
              {err && <p className="mt-4 rounded-[2px] bg-terra/10 px-4 py-3 text-[13px] text-terra-dark">{err}</p>}
              <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
                {busy ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
