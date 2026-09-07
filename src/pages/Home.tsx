import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import {
  Reveal,
  SectionHeader,
  ProductCard,
  IconArrow,
  IconArrowLeft,
  IconFlame,
  IconPackage,
  IconLeaf,
  IconSparkle,
  IconShield,
} from "../components/ui";

/* ---------- helpers ---------- */
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- Hero media: vídeo opcional com fallback em foto ---------- */
function HeroMedia({ image, video }: { image: string; video: string }) {
  const [playVideo, setPlayVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!video) return;
    if (prefersReducedMotion()) return;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    // monta o vídeo só depois do mount (não bloqueia o primeiro paint)
    setPlayVideo(true);
  }, [video]);

  const videoActive = playVideo && !videoFailed;
  return (
    <>
      <img
        src={image}
        alt="Vela acesa em atmosfera aconchegante"
        loading="eager"
        className={`absolute inset-0 h-full w-full object-cover ${videoActive ? "" : "animate-ken-burns"}`}
      />
      {videoActive && (
        <video
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover animate-fade-in"
        />
      )}
    </>
  );
}

/* ---------- Slider editorial (scroll-snap nativo) ---------- */
type Slide = { title: string; text: string; btn: string; image: string; to: string };

function StorySlider({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - el.scrollLeft - el.clientWidth * 0.06);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - el.clientWidth * 0.06, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section className="overflow-hidden bg-ink py-16 sm:py-24" aria-label="Universo Alkaia">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[6vw] scroll-px-[6vw] sm:gap-6"
      >
        {slides.map((s, i) => (
          <Link
            key={i}
            to={s.to}
            className="group relative block w-[86%] shrink-0 snap-start overflow-hidden rounded-[2px] sm:w-[72%] lg:w-[62%]"
          >
            <div className="aspect-[4/5] sm:aspect-[16/10]">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.4s] [@media(hover:hover)]:group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="eyebrow text-clay">0{i + 1}</p>
              <h3 className="mt-2 font-serif text-3xl text-cream sm:text-5xl">{s.title}</h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-cream/85 sm:text-[15px] text-pretty">{s.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-cream">
                {s.btn} <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="shell mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2" aria-hidden="true">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-cream" : "w-1.5 bg-cream/35"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => goTo(Math.max(0, active - 1))}
            disabled={active === 0}
            className="border border-cream/30 p-3 text-cream transition-colors duration-300 hover:bg-cream hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-cream"
          >
            <IconArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={() => goTo(Math.min(slides.length - 1, active + 1))}
            disabled={active === slides.length - 1}
            className="border border-cream/30 p-3 text-cream transition-colors duration-300 hover:bg-cream hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-cream"
          >
            <IconArrow className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Página inicial ---------- */
export default function Home() {
  const { products, settings, content, track } = useStore();
  useSeo(undefined, settings.subtitle);

  useEffect(() => {
    track("view_home", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = products.filter((p) => p.status === "active" && p.featured).slice(0, 4);

  const collectionCards = [
    { title: content["home.col1.title"], text: content["home.col1.text"], image: content["home.col1.image"], to: "/colecoes/floralis" },
    { title: content["home.col2.title"], text: content["home.col2.text"], image: content["home.col2.image"], to: "/velas-de-massagem" },
    { title: content["home.col3.title"], text: content["home.col3.text"], image: content["home.col3.image"], to: "/velas" },
  ];

  const slides: Slide[] = [
    { title: content["home.slide1.title"], text: content["home.slide1.text"], btn: content["home.slide1.btn"], image: content["home.slide1.image"], to: "/velas" },
    { title: content["home.slide2.title"], text: content["home.slide2.text"], btn: content["home.slide2.btn"], image: content["home.slide2.image"], to: "/ritual" },
    { title: content["home.slide3.title"], text: content["home.slide3.text"], btn: content["home.slide3.btn"], image: content["home.slide3.image"], to: "/sobre" },
  ];

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden">
        <HeroMedia image={content["home.hero.image"]} video={content["home.hero.video"]} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" />
        <div className="shell relative z-10 pb-16 pt-32 sm:pb-24">
          <div className="max-w-xl">
            <p className="eyebrow mb-5 flex items-center gap-2 text-clay animate-fade-up">
              <IconFlame className="h-4 w-4 animate-flicker" />
              {content["home.hero.eyebrow"]}
            </p>
            <h1
              className="font-serif text-[42px] leading-[1.05] text-cream sm:text-6xl md:text-7xl text-balance animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              {content["home.hero.title"]}
            </h1>
            <p
              className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/85 sm:text-base text-pretty animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              {content["home.hero.subtitle"]}
            </p>
            <div className="mt-9 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "360ms" }}>
              <Link to="/colecoes" className="btn-light">{content["home.hero.btnPrimary"]}</Link>
              <Link to="/sobre" className="btn-outline !border-cream/40 !text-cream hover:!bg-cream hover:!text-ink">
                {content["home.hero.btnSecondary"]}
              </Link>
            </div>
          </div>
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
          <div className="mt-14 grid gap-5 sm:gap-6 md:grid-cols-3">
            {collectionCards.map((col, idx) => (
              <Reveal key={col.to} delay={idx * 120}>
                <Link to={col.to} className="group relative block overflow-hidden rounded-[2px]">
                  <div className="aspect-[4/5] md:aspect-[3/4]">
                    <img
                      src={col.image}
                      alt={col.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.4s] [@media(hover:hover)]:group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <h3 className="font-serif text-3xl text-cream">{col.title}</h3>
                    <p className="mt-2 max-w-md text-[13px] leading-relaxed text-cream/80 line-clamp-2">{col.text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-cream">
                      Conhecer <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SLIDER EDITORIAL ---------- */}
      <StorySlider slides={slides} />

      {/* ---------- OS FAVORITOS DA ALKAIA ---------- */}
      {featured.length > 0 && (
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
      )}

      {/* ---------- STORYTELLING ---------- */}
      <section className="bg-linen py-20 sm:py-28">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="aspect-[4/5] overflow-hidden rounded-[2px]">
              <img
                src={content["home.story.image"]}
                alt="Still life Alkaia"
                loading="lazy"
                className="reveal-img h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <p className="eyebrow mb-4 text-terra">{content["home.story.eyebrow"]}</p>
            <h2 className="text-4xl leading-tight text-ink sm:text-5xl text-balance">{content["home.story.title"]}</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft sm:text-base text-pretty">
              {content["home.story.text"]}
            </p>
            <Link to="/sobre" className="btn-primary mt-9">{content["home.story.btn"]}</Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- BANDEIRAS ---------- */}
      <section className="border-t border-ink/10 bg-cream">
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
