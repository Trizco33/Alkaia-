import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../data/seed";
import { useStore } from "../store/store";
import { useCart } from "../store/cart";

/* ---------------- Icons (linha, discretos) ---------------- */
type IconProps = { className?: string; strokeWidth?: number };
const S = (props: IconProps) => ({
  className: props.className || "h-5 w-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: props.strokeWidth ?? 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
});

export const IconArrow = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconArrowLeft = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const IconMenu = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);
export const IconClose = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconFlame = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 3c1.5 4-4 5.5-4 10a4 4 0 0 0 8 0c0-2.4-1.6-3.4-2-5.4M14.5 12.5c.4 3-2 3.5-2 5" /></svg>
);
export const IconGlobe = ({ className }: IconProps) => (
  <svg {...S({ className })}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" /></svg>
);
export const IconBag = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const IconPackage = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" /><path d="M4 7l8 4 8-4M12 11v10" /></svg>
);
export const IconWhatsApp = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /><path d="M9 8.5c.2 2 2.5 4.5 4.5 4.7l1-.8 1.5 1.3c-.6 1-2 1.5-3 1.3C10 14.5 8.5 13 7.5 11c-.3-1 .2-2.4 1-3l.5.5z" /></svg>
);
export const IconInstagram = ({ className }: IconProps) => (
  <svg {...S({ className })}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="0.6" fill="currentColor" /></svg>
);
export const IconTikTok = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.4 2 1.8 3.5 4 3.8" /></svg>
);
export const IconMail = ({ className }: IconProps) => (
  <svg {...S({ className })}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></svg>
);
export const IconMapPin = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const IconLeaf = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M5 19c0-9 6-14 14-14 0 9-5 14-11 14" /><path d="M5 19c2-5 5-8 9-9" /></svg>
);
export const IconSparkle = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></svg>
);
export const IconCheck = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M5 12.5l4.5 4.5L19 7" /></svg>
);
export const IconMinus = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M5 12h14" /></svg>
);
export const IconPlus = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconShield = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /></svg>
);
export const IconHeart = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
);
export const IconDrop = ({ className }: IconProps) => (
  <svg {...S({ className })}><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></svg>
);

/* ---------------- Reveal (scroll) ---------------- */
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${shown ? "reveal-shown" : "reveal-hidden"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : "text-left"} max-w-2xl`}>
      {eyebrow && (
        <p className={`eyebrow mb-4 ${light ? "text-cream/60" : "text-terra"}`}>{eyebrow}</p>
      )}
      <h2 className={`text-3xl sm:text-4xl md:text-5xl leading-tight ${light ? "text-cream" : "text-ink"} text-balance`}>
        {title}
      </h2>
      {text && (
        <p className={`mt-5 text-[15px] sm:text-base leading-relaxed ${light ? "text-cream/75" : "text-ink-soft"} text-pretty`}>
          {text}
        </p>
      )}
    </div>
  );
}

/* ---------------- Price ---------------- */
export function Price({ product, big = false }: { product: Product; big?: boolean }) {
  const { formatPrice } = useStore();
  const onSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const cls = big ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      {onSale ? (
        <>
          <span className={`${cls} font-medium text-ink`}>{formatPrice(product.salePrice!)}</span>
          <span className="text-sm text-ink-soft/60 line-through">{formatPrice(product.price)}</span>
        </>
      ) : (
        <span className={`${cls} font-medium text-ink`}>{formatPrice(product.price)}</span>
      )}
    </div>
  );
}

/* ---------------- Product card ---------------- */
export function ProductCard({ product, aspect = "aspect-[4/5]" }: { product: Product; aspect?: string }) {
  const { collectionById } = useStore();
  const col = collectionById(product.collectionId);
  const onSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const out = product.stock <= 0;
  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group flex flex-col animate-fade-up"
    >
      <div className={`${aspect} relative overflow-hidden rounded-[2px] bg-linen`}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-[1.2s] ease-out [@media(hover:hover)]:group-hover:scale-105 ${out ? "opacity-75 saturate-[0.6]" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center opacity-0 translate-y-3 transition-all duration-500 ease-out [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0"
        >
          <span className="bg-cream/95 px-5 py-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-ink shadow-sm">
            Conhecer produto
          </span>
        </span>
        {out ? (
          <span className="absolute left-3 top-3 bg-ink/75 px-3 py-1 text-[10px] font-medium tracking-widest uppercase text-cream backdrop-blur">
            Esgotado
          </span>
        ) : onSale ? (
          <span className="absolute left-3 top-3 bg-cream/90 px-3 py-1 text-[10px] font-medium tracking-widest uppercase text-terra-dark">
            Oferta
          </span>
        ) : null}
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[10px] tracking-widest uppercase text-cream backdrop-blur">
            Destaque
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-col">
        {col && <p className="eyebrow text-[10px] text-terra">{col.name}</p>}
        <h3 className="mt-1 font-serif text-xl text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft text-pretty">
          {product.shortDescription}
        </p>
        <p className="mt-2 text-[11px] tracking-wide uppercase text-ink-soft/70">{product.olfactoryProfile}</p>
        <div className="mt-3 flex items-center justify-between">
          <Price product={product} />
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-terra transition-transform group-hover:translate-x-1">
            Conhecer <IconArrow className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}


/* ---------------- Comprar (carrinho) ---------------- */
export function AddToCart({ product, className = "" }: { product: Product; className?: string }) {
  const { track } = useStore();
  const { add, items } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.productId === product.id)?.qty ?? 0;
  const out = product.stock <= 0;
  const maxQty = Math.max(1, product.stock - inCart);
  const full = !out && inCart >= product.stock;

  useEffect(() => {
    setQty((q) => Math.min(Math.max(1, q), maxQty));
  }, [maxQty]);

  const doAdd = () => {
    add(product, qty);
    track("add_to_cart", { slug: product.slug, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    if (inCart < product.stock) add(product, qty);
    track("buy_now", { slug: product.slug, qty });
    navigate("/checkout");
  };

  if (out) {
    return (
      <div className={className}>
        <button
          disabled
          className="w-full cursor-not-allowed rounded-[2px] border border-ink/15 bg-linen px-6 py-4 text-sm font-medium tracking-wide text-ink-soft"
        >
          Esgotado no momento
        </button>
        <p className="mt-2 text-[12px] text-ink-soft">
          Fale com a gente pela página de <Link to="/contato" className="underline text-terra">contato</Link> para saber quando volta.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-stretch gap-3">
        {/* Stepper de quantidade */}
        <div className="inline-flex items-center rounded-[2px] border border-ink/15 bg-ghost">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1 || full}
            className="flex h-12 w-11 items-center justify-center text-ink transition-colors hover:bg-linen disabled:opacity-30"
          >
            <IconMinus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium text-ink tabular-nums" aria-live="polite">
            {full ? 0 : qty}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={qty >= maxQty || full}
            className="flex h-12 w-11 items-center justify-center text-ink transition-colors hover:bg-linen disabled:opacity-30"
          >
            <IconPlus className="h-4 w-4" />
          </button>
        </div>

        {/* Adicionar ao carrinho */}
        <button
          type="button"
          onClick={doAdd}
          disabled={full}
          className="group flex flex-1 min-w-[180px] items-center justify-center gap-2 rounded-[2px] bg-ink px-6 py-3.5 text-sm font-medium tracking-wide text-cream transition-all duration-300 hover:bg-terra-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? (
            <>
              <IconCheck className="h-4 w-4" /> Adicionado
            </>
          ) : (
            <>
              <IconBag className="h-4 w-4" /> Adicionar ao carrinho
            </>
          )}
        </button>
      </div>

      {/* Comprar agora */}
      <button
        type="button"
        onClick={buyNow}
        className="group mt-3 flex w-full items-center justify-center gap-2 rounded-[2px] border border-ink/20 bg-ghost px-6 py-3.5 text-sm font-medium tracking-wide text-ink transition-all duration-300 hover:border-ink hover:bg-linen"
      >
        Comprar agora
        <IconArrow className="h-4 w-4 text-terra transition-transform group-hover:translate-x-1" />
      </button>

      {(inCart > 0 || added) && (
        <p className="mt-3 text-[12px] text-ink-soft">
          {inCart > 0 && (
            <>
              {inCart} {inCart === 1 ? "unidade" : "unidades"} no carrinho ·{" "}
            </>
          )}
          <Link to="/carrinho" className="font-medium text-terra underline underline-offset-2">
            Ver carrinho
          </Link>
        </p>
      )}
      {full && <p className="mt-2 text-[12px] text-ink-soft">Você já tem todo o estoque disponível no carrinho.</p>}
    </div>
  );
}

/* ---------------- Lazy image ---------------- */
export function LazyImg({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
