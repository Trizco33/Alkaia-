import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import {
  Reveal,
  SectionHeader,
  ProductCard,
  IconArrow,
  IconFlame,
  IconPackage,
  IconLeaf,
  IconSparkle,
  IconShield,
} from "../components/ui";
export default function Home() {
  const { products, collections, settings, content, track } = useStore();
  useSeo(undefined, settings.subtitle);

  useEffect(() => {
    track("view_home", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = products.filter((p) => p.status === "active" && p.featured).slice(0, 4);
  const colFloralis = collections.find((c) => c.slug === "floralis");
  const colRituais = collections.find((c) => c.slug === "rituais");

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden">
        <img
          src={content["home.hero.image"]}
          alt="Vela acesa em atmosfera aconchegante"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" />
        <div className="shell relative z-10 pb-16 pt-32 sm:pb-24">
          <div className="max-w-xl">
            <p className="eyebrow mb-5 flex items-center gap-2 text-clay animate-fade-up">
              <IconFlame className="h-4 w-4 animate-flicker" />
              {content["home.hero.eyebrow"]}
            </p>
            <h1 className="font-serif text-[42px] leading-[1.05] text-cream sm:text-6xl md:text-7xl text-balance animate-fade-up" style={{ animationDelay: "120ms" }}>
              {content["home.hero.title"]}
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/85 sm:text-base text-pretty animate-fade-up" style={{ animationDelay: "240ms" }}>
              {settings.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "360ms" }}>
              <Link to="/colecoes" className="btn-light">{content["home.hero.btnPrimary"]}</Link>
              <Link to="/velas" className="btn-outline !border-cream/40 !text-cream hover:!bg-cream hover:!text-ink">
                {content["home.hero.btnSecondary"]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- QUOTE BAND ---------- */}
      <section className="border-b border-ink/10 bg-linen">
        <div className="shell py-10 text-center sm:py-12">
          <p className="font-serif text-2xl italic text-ink/80 sm:text-3xl text-balance">
            {content["home.quote"]}
          </p>
        </div>
      </section>

      {/* ---------- CONHEÇA A ALKAIA ---------- */}
      <section className="shell py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] overflow-hidden rounded-[2px]">
              <img src={content["home.about.image"]} alt="Still life Alkaia" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden w-52 overflow-hidden rounded-[2px] border-4 border-cream shadow-2xl sm:block">
              <img src={content["home.about.imageSmall"]} alt="Vela Alkaia" loading="lazy" className="aspect-[4/5] object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <p className="eyebrow mb-4 text-terra">{content["home.about.eyebrow"]}</p>
            <h2 className="text-4xl leading-tight text-ink sm:text-5xl text-balance">{content["home.about.title"]}</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft sm:text-base text-pretty">
              {content["home.about.text"]}
            </p>
            <ul className="mt-7 space-y-3">
              {[content["home.about.bullet1"], content["home.about.bullet2"], content["home.about.bullet3"]].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[14px] text-ink">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-linen text-terra">
                    <IconLeaf className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/sobre" className="btn-primary mt-9">{content["home.about.btn"]}</Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- COLEÇÕES ---------- */}
      <section className="bg-cream-2 py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionHeader
              eyebrow={content["home.collections.eyebrow"]}
              title={content["home.collections.title"]}
              text={content["home.collections.text"]}
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[colFloralis, colRituais].map(
              (col, idx) =>
                col && (
                  <Reveal key={col.id} delay={idx * 120}>
                    <Link to={`/colecoes/${col.slug}`} className="group relative block overflow-hidden rounded-[2px]">
                      <div className="aspect-[4/5] md:aspect-[3/4]">
                        <img src={col.image} alt={col.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <p className="eyebrow text-clay">{col.tagline}</p>
                        <h3 className="mt-2 font-serif text-3xl text-cream sm:text-4xl">{col.name}</h3>
                        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-cream/80 line-clamp-2">{col.description}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-cream">
                          Conhecer {col.name} <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                )
            )}
          </div>
        </div>
      </section>

      {/* ---------- DESTAQUES ---------- */}
      <section className="shell py-20 sm:py-28">
        <Reveal>
          <SectionHeader
            eyebrow={content["home.featured.eyebrow"]}
            title={content["home.featured.title"]}
            text={content["home.featured.text"]}
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to="/velas" className="btn-outline">{content["home.featured.btn"]}</Link>
        </div>
      </section>

      {/* ---------- EXPERIÊNCIA ---------- */}
      <section className="relative overflow-hidden">
        <img src={content["home.exp.image"]} alt="Chama e luz suave" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="shell relative z-10 flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
          <IconFlame className="h-10 w-10 text-clay animate-flicker" />
          <h2 className="mt-6 font-serif text-5xl leading-[1.05] text-cream sm:text-7xl text-balance">
            {content["home.exp.title"].split(/(?<=\.)\s+/).map((part, i) => (
              <span key={i}>
                {i > 0 && <br className="sm:hidden" />}
                {part}{" "}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-md font-serif text-xl italic text-cream/80">
            {content["home.exp.text"]}
          </p>
          <Link to="/ritual" className="btn-light mt-10">
            {content["home.exp.btn"]}
          </Link>
        </div>
      </section>

      {/* ---------- BANDEIRAS ---------- */}
      <section className="border-t border-ink/10 bg-linen">
        <div className="shell grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {[
            { icon: <IconLeaf className="h-6 w-6" />, t: content["home.flag1.title"], s: content["home.flag1.text"] },
            { icon: <IconSparkle className="h-6 w-6" />, t: content["home.flag2.title"], s: content["home.flag2.text"] },
            { icon: <IconShield className="h-6 w-6" />, t: content["home.flag3.title"], s: content["home.flag3.text"] },
            { icon: <IconPackage className="h-6 w-6" />, t: content["home.flag4.title"], s: content["home.flag4.text"] },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-terra">{b.icon}</span>
              <p className="mt-3 text-[13px] font-medium text-ink">{b.t}</p>
              <p className="text-[12px] text-ink-soft">{b.s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
