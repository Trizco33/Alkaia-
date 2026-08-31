import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import { Reveal, SectionHeader, ProductCard, IconArrow, IconFlame } from "../components/ui";

export function Collections() {
  const { collections, settings, track } = useStore();
  useSeo("Coleções", "Conheça as coleções Alkaia: Floralis, Rituais e Edições Especiais.");

  useEffect(() => {
    track("view_collection", { slug: "todas" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Coleções"
          title="Universos que despertam sentidos"
          text={`Cada coleção da ${settings.brandName} é um universo sensorial: uma atmosfera, um aroma, um convite à pausa.`}
        />
      </Reveal>

      <div className="mt-16 space-y-16">
        {collections.map((col, idx) => (
          <Reveal key={col.id}>
            <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20`}>
              <div className={`relative ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="aspect-[4/5] overflow-hidden rounded-[2px]">
                  <img src={col.image} alt={col.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                <p className="eyebrow text-terra">{col.tagline}</p>
                <h2 className="mt-3 text-4xl text-ink sm:text-5xl">{col.name}</h2>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-soft sm:text-base text-pretty">{col.description}</p>
                <p className="mt-5 border-l-2 border-clay pl-4 font-serif text-lg italic text-ink/70">{col.editorial}</p>
                {col.subCollection && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {col.subCollection.map((s) => (
                      <span key={s.name} className="rounded-full border border-ink/12 px-4 py-1.5 text-[12px] text-ink-soft">
                        {s.name} · {s.profile}
                      </span>
                    ))}
                  </div>
                )}
                <Link to={`/colecoes/${col.slug}`} className="btn-outline mt-8">
                  Conhecer {col.name} <IconArrow className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 rounded-[2px] bg-ink px-6 py-12 text-center sm:px-12">
        <IconFlame className="mx-auto h-8 w-8 text-clay animate-flicker" />
        <h3 className="mt-4 font-serif text-3xl text-cream sm:text-4xl text-balance">Não encontrou o que procura?</h3>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-cream/70">Criamos encomendas especiais, kits e aromas personalizados para o seu momento.</p>
        <Link to="/encomendas" className="btn-light mt-8">Solicitar encomenda especial</Link>
      </div>
    </div>
  );
}

export function CollectionDetail() {
  const { slug } = useParams();
  const { collectionBySlug, productsOfCollection, track } = useStore();
  const col = collectionBySlug(slug || "");
  useSeo(col ? col.name : "Coleção", col ? col.description : undefined);

  useEffect(() => {
    if (col) track("view_collection", { slug: col.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col?.id]);

  if (!col) {
    return (
      <div className="shell py-32 text-center">
        <p className="font-serif text-3xl text-ink">Coleção não encontrada.</p>
        <Link to="/colecoes" className="btn-outline mt-6">Voltar às coleções</Link>
      </div>
    );
  }

  const items = productsOfCollection(col.id);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={col.image} alt={col.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20" />
        <div className="shell relative z-10 py-28 sm:py-40">
          <p className="eyebrow text-clay animate-fade-up">{col.tagline}</p>
          <h1 className="mt-3 font-serif text-5xl text-cream sm:text-6xl animate-fade-up" style={{ animationDelay: "120ms" }}>{col.name}</h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/85 animate-fade-up" style={{ animationDelay: "240ms" }}>{col.description}</p>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-ink-soft sm:text-xl text-pretty">{col.editorial}</p>
        </Reveal>

        {col.subCollection && col.ritual === "ritual" && (
          <div className="mt-14">
            <Reveal>
              <SectionHeader eyebrow="Subcolegões" title="Os rituais" />
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {col.subCollection.map((s, i) => (
                <Reveal key={s.name} delay={i * 80}>
                  <div className="flex h-full flex-col rounded-[2px] border border-ink/10 bg-ghost p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linen text-terra"><IconFlame className="h-4 w-4" /></span>
                    <h3 className="mt-5 font-serif text-xl text-ink">{s.name}</h3>
                    <p className="mt-2 text-[12px] uppercase tracking-widest text-ink-soft/70">{s.profile}</p>
                    <Link to="/velas-de-massagem" className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-terra">
                      Conhecer <IconArrow className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20">
          <SectionHeader eyebrow="Produtos" title={`A coleção ${col.name}`} align="center" />
          {items.length === 0 ? (
            <p className="mt-10 text-center text-ink-soft">Em breve novos produtos desta coleção.</p>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-[2px] border border-ink/10 bg-linen px-6 py-10 text-center">
          <p className="font-serif text-2xl text-ink text-balance">Quer uma versão deste ritual feita para você?</p>
          <Link to="/encomendas" className="btn-primary">Fazer encomenda especial</Link>
        </div>
      </section>
    </div>
  );
}
