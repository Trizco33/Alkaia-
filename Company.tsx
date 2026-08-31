import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import { Reveal, SectionHeader, IconArrow, IconGlobe, IconBag, IconPackage, IconWhatsApp, IconMapPin, IconLeaf, IconFlame, IconSparkle, IconCheck } from "../components/ui";
import { IMAGES } from "../data/seed";

/* ============ SOBRE ============ */
export function Sobre() {
  const { track } = useStore();
  useSeo("Sobre a Alkaia", "A Alkaia nasce para acompanhar pequenos momentos. Velas artesanais, aromas e rituais de autocuidado.");

  useEffect(() => {
    track("view_about", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pillars = [
    { t: "Origem", d: "A Alkaia nasceu de um desejo simples: transformar o ato de acender uma vela em uma pausa real, que devolve a gente para si.", ic: <IconFlame className="h-6 w-6" /> },
    { t: "Processo artesanal", d: "Cada vela é criada em pequenos lotes, com cera vegetal e óleos essenciais escolhidos com calma — sem pressa, como um bom ritual.", ic: <IconLeaf className="h-6 w-6" /> },
    { t: "Criação das coleções", d: "Cada coleção nasce de uma atmosfera ou de uma emoção. Do floral ao amadeirado, os aromas são desenhados para contar uma história.", ic: <IconSparkle className="h-6 w-6" /> },
    { t: "Cuidado com os detalhes", d: "Da cera ao pavio, do rótulo à embalagem, tudo é pensado para tornar o seu momento mais bonito, delicado e especial.", ic: <IconCheck className="h-6 w-6" /> },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={IMAGES.linen2} alt="Atmosfera Alkaia" loading="eager" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25" />
        <div className="shell relative z-10 py-28 sm:py-40">
          <p className="eyebrow text-clay animate-fade-up">Sobre a Alkaia</p>
          <h1 className="mt-3 max-w-2xl font-serif text-5xl leading-tight text-cream sm:text-6xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            Pequenos momentos. Grandes significados.
          </h1>
          <div className="mt-7 max-w-lg space-y-1 text-[15px] leading-relaxed text-cream/85 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <p className="font-serif text-lg italic text-cream/90">Acreditamos que pequenos momentos podem carregar grandes significados.</p>
            <p>Uma luz acesa.</p>
            <p>Um aroma no ambiente.</p>
            <p>Alguns minutos de pausa.</p>
            <p className="mt-2">A Alkaia nasce para acompanhar esses momentos.</p>
          </div>
        </div>
      </section>

      <section className="shell py-20 sm:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-terra">Nossa essência</p>
            <h2 className="mt-3 text-4xl leading-tight text-ink sm:text-5xl text-balance">Uma marca para estar presente.</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft text-pretty">
              Não fazemos apenas velas. Criamos atmosferas, memórias e pequenos rituais de cuidado. A Alkaia é
              feita à mão, com intenção, para acompanhar os seus momentos de pausa — seja no fim do dia, num
              banho demorado, numa massagem ou naquela noite especial.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft text-pretty">
              Cada coleção é um universo. Cada aroma, uma sensação. E cada chama, um convite para respirar.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              <img src={IMAGES.make2} alt="Processo artesanal" loading="lazy" className="aspect-[3/4] rounded-[2px] object-cover" />
              <img src={IMAGES.dried} alt="Flores secas" loading="lazy" className="mt-8 aspect-[3/4] rounded-[2px] object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-2 py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionHeader eyebrow="O que nos move" title="Cuidado em cada detalhe" text="Quatro pilares sustentam tudo o que criamos." />
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.t} delay={i * 90}>
                <div className="flex h-full flex-col rounded-[2px] border border-ink/10 bg-ghost p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linen text-terra">{p.ic}</span>
                  <h3 className="mt-5 font-serif text-2xl text-ink">{p.t}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="relative overflow-hidden rounded-[2px]">
              <img src={IMAGES.make1} alt="Derramando a cera" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h3 className="font-serif text-2xl text-cream">Feito à mão, com intenção.</h3>
                <p className="mt-1 text-[13px] text-cream/80">Cada lote é produzido artesanalmente.</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2px]">
              <img src={IMAGES.spa3} alt="Ritual de autocuidado" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h3 className="font-serif text-2xl text-cream">Rituais de autocuidado.</h3>
                <p className="mt-1 text-[13px] text-cream/80">Para perfumar, cuidar e transformar momentos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============ ONDE COMPRAR ============ */
export function OndeComprar() {
  const { settings, track } = useStore();
  useSeo("Onde Comprar", "Escolha onde comprar Alkaia: loja oficial, Shopee, Mercado Livre ou WhatsApp.");

  const cards = [
    { name: "Loja Alkaia", desc: "Compre diretamente pela nossa loja oficial.", btn: "Comprar no site", icon: <IconGlobe className="h-7 w-7" strokeWidth={1.3} />, href: "/", ext: false },
    { name: "Shopee", desc: "Prefere comprar pela Shopee? Encontre nossos produtos em nossa loja oficial.", btn: "Ir para a Shopee", icon: <IconBag className="h-7 w-7" strokeWidth={1.3} />, href: settings.shopee, ext: true, en: "shopee" },
    { name: "Mercado Livre", desc: "Prefere comprar pelo Mercado Livre? Escolha seus produtos pela plataforma.", btn: "Ir para o Mercado Livre", icon: <IconPackage className="h-7 w-7" strokeWidth={1.3} />, href: settings.mercadolivre, ext: true, en: "mercadolivre" },
    { name: "WhatsApp", desc: "Quer tirar dúvidas ou fazer uma encomenda especial?", btn: "Falar com a Alkaia", icon: <IconWhatsApp className="h-7 w-7" strokeWidth={1.3} />, href: `https://wa.me/${settings.whatsapp}`, ext: true, en: "whatsapp" },
  ] as const;

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Onde comprar"
          title="Escolha a sua forma de comprar."
          text="Você escolhe o caminho — o cuidado é o mesmo em todos os canais."
        />
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.name} delay={i * 80}>
            {c.ext ? (
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("click_" + (c.en === "whatsapp" ? "whatsapp" : "buy_" + c.en), { channel: c.en })}
                className="group flex h-full flex-col rounded-[2px] border border-ink/10 bg-ghost p-8 transition-all hover:border-ink/30 hover:shadow-[0_24px_50px_-30px_rgba(42,34,27,0.6)]"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-linen text-terra transition-colors group-hover:bg-ink group-hover:text-cream">{c.icon}</span>
                <h3 className="mt-7 font-serif text-2xl text-ink">{c.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft flex-1">{c.desc}</p>
                <span className="btn-outline mt-6 w-full">{c.btn} <IconArrow className="h-4 w-4" /></span>
              </a>
            ) : (
              <Link to={c.href} className="group flex h-full flex-col rounded-[2px] border border-ink/10 bg-ghost p-8 transition-all hover:border-ink/30 hover:shadow-[0_24px_50px_-30px_rgba(42,34,27,0.6)]">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-linen text-terra transition-colors group-hover:bg-ink group-hover:text-cream">{c.icon}</span>
                <h3 className="mt-7 font-serif text-2xl text-ink">{c.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft flex-1">{c.desc}</p>
                <span className="btn-outline mt-6 w-full">{c.btn} <IconArrow className="h-4 w-4" /></span>
              </Link>
            )}
          </Reveal>
        ))}
      </div>

      <div className="mt-16 rounded-[2px] bg-ink px-6 py-12 text-center sm:px-12">
        <IconFlame className="mx-auto h-8 w-8 text-clay animate-flicker" />
        <h3 className="mt-4 font-serif text-3xl text-cream sm:text-4xl text-balance">Prefere algo feito para você?</h3>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-cream/70">Fale conosco pelo WhatsApp e peça sua encomenda especial.</p>
        <Link to="/encomendas" className="btn-light mt-8">Solicitar encomenda</Link>
      </div>
    </div>
  );
}

/* ============ ENTREGA E RETIRADA ============ */
export function Entrega() {
  const { deliveryRegions, settings, track } = useStore();
  useSeo("Entrega e Retirada", "Como receber sua Alkaia: retirada em Artur Nogueira, entrega local e envio para todo o Brasil.");

  useEffect(() => {
    track("view_delivery", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retirada = deliveryRegions.filter((r) => r.type === "retirada");
  const entrega = deliveryRegions.filter((r) => r.type === "entrega");
  const envio = deliveryRegions.filter((r) => r.type === "envio");

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader eyebrow="Entrega e retirada" title="Como a Alkaia chega até você" text="Escolha entre retirar, receber em casa ou receber pelos canais de compra." />
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        <Reveal>
          <div className="flex h-full flex-col rounded-[2px] border border-ink/10 bg-ghost p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linen text-terra"><IconMapPin className="h-6 w-6" /></span>
            <h3 className="mt-6 font-serif text-2xl text-ink">Retirada local</h3>
            <p className="mt-2 text-[14px] text-ink-soft">Retire seu pedido em</p>
            <p className="mt-1 font-medium text-ink">Artur Nogueira — SP</p>
            <div className="mt-4 hairline" />
            <ul className="mt-4 space-y-2 text-[13px] text-ink-soft">
              {(retirada.length ? retirada : [{ id: "x", note: "A retirada deve ser realizada mediante combinação ou agendamento prévio." }]).map((r) => (
                <li key={r.id}>• {r.note}</li>
              ))}
              <li>• Combine o horário pelo WhatsApp.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="flex h-full flex-col rounded-[2px] border border-ink/10 bg-ghost p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linen text-terra"><IconLeaf className="h-6 w-6" /></span>
            <h3 className="mt-6 font-serif text-2xl text-ink">Entrega local</h3>
            <p className="mt-2 text-[14px] text-ink-soft">Atendemos com entrega combinada:</p>
            <ul className="mt-3 space-y-2 text-[13px] font-medium text-ink">
              {entrega.map((r) => (
                <li key={r.id} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-olive" /> {r.name}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-ink-soft">Valores de entrega são combinados com a cliente no momento do pedido.</p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="flex h-full flex-col rounded-[2px] border border-ink/10 bg-ghost p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linen text-terra"><IconPackage className="h-6 w-6" /></span>
            <h3 className="mt-6 font-serif text-2xl text-ink">Envio para todo o Brasil</h3>
            <p className="mt-2 text-[14px] text-ink-soft">As opções de envio dependem do canal de compra.</p>
            <ul className="mt-3 space-y-2 text-[13px] text-ink-soft">
              {envio.map((r) => (
                <li key={r.id}>• {r.note}</li>
              ))}
              <li>• Estrutura preparada para frete automático (Correios e transportadoras).</li>
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link to="/onde-comprar" className="btn-primary">Ver canais de compra</Link>
        <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline">Falar no WhatsApp</a>
      </div>
    </div>
  );
}
