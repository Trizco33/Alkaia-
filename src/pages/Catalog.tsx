import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import { Reveal, SectionHeader, ProductCard, IconArrow, IconFlame, IconDrop, IconCheck } from "../components/ui";
import { IMAGES } from "../data/seed";

/* ============ VELAS AROMÁTICAS ============ */
export function VelasAromaticas() {
  const { products, collections, track } = useStore();
  useSeo("Velas Aromáticas", "Velas aromáticas artesanais Alkaia para perfumar ambientes e despertar sentidos.");
  const items = products.filter((p) => p.status === "active" && p.categoryId === "cat-aromaticas");
  const colIds = [...new Set(items.map((p) => p.collectionId))];

  useEffect(() => {
    track("view_collection", { slug: "velas-aromaticas" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Velas Aromáticas"
          title="Aroma que transforma o ambiente"
          text="Velas feitas à mão, com cera vegetal e óleos essenciais, para perfumar espaços e criar atmosferas memoráveis."
        />
      </Reveal>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {colIds.map((cid) => {
          const col = collections.find((c) => c.id === cid);
          return col ? (
            <Link key={cid} to={`/colecoes/${col.slug}`} className="rounded-full border border-ink/12 px-4 py-1.5 text-[12px] text-ink-soft transition-colors hover:border-ink hover:text-ink">
              {col.name}
            </Link>
          ) : null;
        })}
      </div>

      <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-20 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Link to="/velas-de-massagem" className="group relative overflow-hidden rounded-[2px]">
          <img src={IMAGES.spa1} alt="Velas de massagem" loading="lazy" className="aspect-[16/10] w-full object-cover" />
          <div className="absolute inset-0 bg-ink/45 transition-colors group-hover:bg-ink/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h3 className="font-serif text-3xl text-cream">Velas de Massagem</h3>
            <p className="mt-2 text-[13px] text-cream/80">Rituais de cuidado para o corpo.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-cream">Ver linha <IconArrow className="h-4 w-4" /></span>
          </div>
        </Link>
        <Link to="/kits" className="group relative overflow-hidden rounded-[2px]">
          <img src={IMAGES.linen3} alt="Kits e presentes" loading="lazy" className="aspect-[16/10] w-full object-cover" />
          <div className="absolute inset-0 bg-ink/45 transition-colors group-hover:bg-ink/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h3 className="font-serif text-3xl text-cream">Kits e Presentes</h3>
            <p className="mt-2 text-[13px] text-cream/80">Para embalar um gesto de carinho.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-cream">Conhecer <IconArrow className="h-4 w-4" /></span>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ============ VELAS DE MASSAGEM ============ */
export function Massagem() {
  const { products, track, formatPrice } = useStore();
  useSeo("Velas de Massagem", "Velas de massagem artesanais Alkaia — derretem em óleo morno para rituais de autocuidado e spa.");
  const items = products.filter((p) => p.status === "active" && p.categoryId === "cat-massagem");
  const ritPes = products.find((p) => p.slug === "ritual-dos-pes") || items[0];

  useEffect(() => {
    track("view_collection", { slug: "velas-de-massagem" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={IMAGES.spa2} alt="Ritual spa Alkaia" loading="eager" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20" />
        <div className="shell relative z-10 py-28 sm:py-40">
          <p className="eyebrow text-clay animate-fade-up">Spa · Autocuidado · Ritual</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-tight text-cream sm:text-6xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            O cuidado em forma de ritual.
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-cream/85 animate-fade-up" style={{ animationDelay: "240ms" }}>
            Velas de massagem que derretem em um óleo morno e perfumado, transformando o simples gesto do cuidado em uma experiência sensorial para o corpo e para a mente.
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="shell py-16 sm:py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Como funciona"
            title="Do fogo ao toque"
            text="Uma pequena pausa basta para transformar a vela em um óleo de massagem morno e perfumado."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Acenda", d: "Acenda a vela por alguns minutos até derreter uma camada de óleo na superfície.", ic: <IconFlame className="h-6 w-6" /> },
            { t: "Apague e amorne", d: "Apague a chama e aguarde a temperatura ficar confortável para a pele.", ic: <IconDrop className="h-6 w-6" /> },
            { t: "Massageie", d: "Aplique o óleo morno com movimentos suaves e deixe o aroma cuidar de você.", ic: <IconCheck className="h-6 w-6" /> },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 100}>
              <div className="rounded-[2px] border border-ink/10 bg-ghost p-7 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linen text-terra">{s.ic}</span>
                <p className="mt-5 eyebrow text-[10px] text-terra">Passo {i + 1}</p>
                <h3 className="mt-1 font-serif text-2xl text-ink">{s.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Flagship: Ritual dos Pés */}
      {ritPes && (
        <section className="bg-cream-2 py-16 sm:py-24">
          <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-[2px]">
                <img src={IMAGES.spa1} alt="Ritual dos Pés" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow text-terra">Ritual dos Pés</p>
              <h2 className="mt-3 text-4xl leading-tight text-ink sm:text-5xl text-balance">
                Uma experiência criada para transformar momentos de cuidado em um pequeno ritual sensorial.
              </h2>
              <p className="mt-5 text-[12px] uppercase tracking-[0.24em] text-ink-soft/70">{ritPes.olfactoryProfile}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft text-pretty">{ritPes.description}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2px] border border-ink/10 bg-ghost p-6">
                  <p className="eyebrow text-[10px] text-terra">Essencial</p>
                  <p className="mt-2 font-serif text-3xl text-ink">40g</p>
                  <p className="mt-2 text-[13px] text-ink-soft">Ideal para experimentar e conhecer o ritual.</p>
                  <p className="mt-4 text-lg font-medium text-ink">{formatPrice(79)}</p>
                  <Link to={`/produto/${ritPes.slug}`} className="btn-outline mt-4 w-full !py-3">Conhecer</Link>
                </div>
                <div className="rounded-[2px] border border-terra/40 bg-ghost p-6 shadow-[0_20px_40px_-30px_rgba(168,99,74,0.8)]">
                  <p className="eyebrow text-[10px] text-terra">Premium</p>
                  <p className="mt-2 font-serif text-3xl text-ink">100g</p>
                  <p className="mt-2 text-[13px] text-ink-soft">Uma experiência mais completa, em embalagem sofisticada.</p>
                  <p className="mt-4 text-lg font-medium text-ink">{formatPrice(109)}</p>
                  <Link to={`/produto/${ritPes.slug}`} className="btn-primary mt-4 w-full">Conhecer</Link>
                </div>
              </div>
              <p className="mt-4 text-[12px] text-ink-soft/70">* A estrutura permite criar novos tamanhos quando desejar.</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Linha de rituais */}
      <section className="shell py-16 sm:py-24">
        <Reveal>
          <SectionHeader eyebrow="A linha Rituais" title="Encontre o seu ritual" text="Quatro rituais, quatro intenções de cuidado." />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============ KITS E PRESENTES ============ */
export function Kits() {
  const { products, track } = useStore();
  useSeo("Kits e Presentes", "Kits e presentes Alkaia — composições autorais para presentear com aroma, luz e cuidado.");
  const gift = products.filter((p) => p.status === "active" && !p.categoryId?.includes("massagem")).slice(0, 4);

  useEffect(() => {
    track("view_collection", { slug: "kits" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Kits e Presentes"
          title="Um gelo de carinho, embalado com cuidado"
          text="Montamos composições autorais para presentear — ou para se presentear — com aroma, luz e pausa."
        />
      </Reveal>

      <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2px]">
            <img src={IMAGES.cand5} alt="Kit Alkaia" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="text-3xl leading-tight text-ink sm:text-4xl text-balance">Presenteie um ritual.</h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft text-pretty">
            Kits para datas especiais, lembranças de eventos, brindes corporativos e para quem você quer bem.
            Conte para a gente o momento e criamos a composição perfeita.
          </p>
          <ul className="mt-7 space-y-3 text-[14px] text-ink">
            {["Kits para datas comemorativas", "Lembranças e brindes de eventos", "Presentes corporativos", "Composições para spas e profissionais"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-linen text-terra"><IconCheck className="h-3.5 w-3.5" /></span>
                {t}
              </li>
            ))}
          </ul>
          <Link to="/encomendas" className="btn-primary mt-9">Solicitar um kit</Link>
        </Reveal>
      </div>

      <div className="mt-20">
        <Reveal>
          <SectionHeader eyebrow="Sugestões" title="Aromas que abraçam" />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {gift.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
