import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store/store";
import { IconClose, IconInstagram, IconTikTok, IconWhatsApp, IconArrow, IconFlame } from "./ui";

/* ---------------- SEO helper ---------------- */
export function useSeo(title?: string, description?: string) {
  const { settings } = useStore();
  useEffect(() => {
    document.title = title ? `${title} · ${settings.brandName}` : `${settings.brandName} — Transforme momentos em rituais.`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
    if (meta && !description) meta.setAttribute("content", settings.subtitle);
  }, [title, description, settings.brandName, settings.subtitle]);
}

/* ---------------- Nav model ---------------- */
const collectionsNav = [
  { label: "Floralis", to: "/colecoes/floralis" },
  { label: "Rituais", to: "/colecoes/rituais" },
  { label: "Edições Especiais", to: "/colecoes/edicoes-especiais" },
];
const velasNav = [
  { label: "Velas Aromáticas", to: "/velas" },
  { label: "Velas de Massagem", to: "/velas-de-massagem" },
];

function NavDropdown({ label, items }: { label: string; items: { label: string; to: string }[] }) {
  return (
    <div className="group relative">
      <Link to={items[0].to} className="flex items-center gap-1 py-1 text-[13px] tracking-wide text-ink/80 hover:text-ink">
        {label}
      </Link>
      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="min-w-[200px] rounded-[2px] border border-ink/10 bg-ghost p-2 shadow-[0_24px_50px_-25px_rgba(42,34,27,0.45)]">
          {items.map((i) => (
            <Link key={i.to} to={i.to} className="block px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:bg-linen hover:text-ink">
              {i.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Acc({ label, items }: { label: string; items: { label: string; to: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[15px] font-medium text-ink">{label}</span>
        <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
          <IconArrow className="h-4 w-4 text-terra" />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 pb-3 pl-4">
            {items.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                onClick={() => setOpen(false)}
                className="py-2 text-[14px] text-ink-soft transition-colors hover:text-ink"
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Animated hamburger → X */
function Hamburger({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-6 flex-col items-start justify-center">
      <span
        className={`block h-[1.6px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
          open ? "translate-y-[0.1px] rotate-45" : ""
        }`}
      />
      <span
        className={`mt-[5px] block h-[1.6px] rounded-full bg-current transition-all duration-300 ease-in-out ${
          open ? "w-0 opacity-0" : "w-4"
        }`}
      />
      <span
        className={`mt-[5px] block h-[1.6px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
          open ? "-mt-[6.6px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function Header() {
  const { settings } = useStore();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nav = [
    { label: "Início", to: "/" },
    { label: "Coleções", dropdown: collectionsNav },
    { label: "Velas", dropdown: velasNav },
    { label: "Kits e Presentes", to: "/kits" },
    { label: "Encomendas Especiais", to: "/encomendas" },
    { label: "Onde Comprar", to: "/onde-comprar" },
    { label: "Entrega e Retirada", to: "/entrega" },
    { label: "Sobre a Alkaia", to: "/sobre" },
    { label: "FAQ", to: "/faq" },
    { label: "Contato", to: "/contato" },
  ];

  return (
    <>
      {/* Top band */}
      <div className="bg-ink text-cream">
        <div className="shell flex items-center justify-center gap-2 py-2 text-center text-[11px] tracking-[0.18em] uppercase">
          <IconFlame className="h-3.5 w-3.5 text-clay" />
          <span>Velas artesanais · {settings.city}</span>
        </div>
      </div>

      {/* Header bar */}
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-lg">
        <div className="shell flex h-16 items-center justify-between sm:h-[72px]">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl tracking-[0.22em] text-ink sm:text-[26px]">
            <span className="text-terra-dark">A</span>LKAIA
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((i) =>
              i.dropdown ? (
                <NavDropdown key={i.label} label={i.label} items={i.dropdown} />
              ) : (
                <NavLink
                  key={i.label}
                  to={i.to}
                  className={({ isActive }) =>
                    `py-1 text-[13px] tracking-wide transition-colors ${
                      isActive ? "text-terra font-medium" : "text-ink/80 hover:text-ink"
                    }`
                  }
                >
                  {i.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Right side: CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link to="/onde-comprar" className="btn-primary hidden !px-5 !py-2.5 lg:inline-flex">
              Onde comprar
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
                open ? "text-terra" : "text-ink"
              }`}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              <Hamburger open={open} />
            </button>
          </div>
        </div>
      </header>

      {/* ============ MOBILE / TABLET DRAWER ============ */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel — slides from right */}
        <div
          className={`absolute inset-y-0 right-0 flex w-[88%] max-w-[380px] flex-col bg-cream shadow-2xl transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
            <span className="font-serif text-xl tracking-[0.2em] text-ink">
              <span className="text-terra-dark">A</span>LKAIA
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-linen"
              aria-label="Fechar menu"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer nav links */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8">
            <nav className="divide-y divide-ink/8">
              {nav.map((i) =>
                i.dropdown ? (
                  <Acc key={i.label} label={i.label} items={i.dropdown} />
                ) : (
                  <NavLink
                    key={i.label}
                    to={i.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-4 text-[15px] font-medium transition-colors ${
                        isActive ? "text-terra" : "text-ink"
                      }`
                    }
                  >
                    {i.label}
                    <IconArrow className="h-3.5 w-3.5 text-ink-soft/40" />
                  </NavLink>
                )
              )}
            </nav>

            {/* CTA */}
            <Link
              to="/onde-comprar"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              Onde comprar
            </Link>

            {/* Ritual discovery */}
            <Link
              to="/ritual"
              onClick={() => setOpen(false)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[2px] border border-terra/30 bg-terra/5 px-4 py-3 text-[13px] font-medium text-terra transition-colors hover:bg-terra/10"
            >
              <IconFlame className="h-4 w-4" />
              Descubra seu ritual
            </Link>

            {/* Social icons */}
            <div className="mt-8 flex items-center justify-center gap-5">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-linen hover:text-ink"
              >
                <IconInstagram className="h-5 w-5" />
              </a>
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-linen hover:text-ink"
              >
                <IconTikTok className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-linen hover:text-ink"
              >
                <IconWhatsApp className="h-5 w-5" />
              </a>
            </div>

            {/* City */}
            <p className="mt-5 text-center text-[12px] text-ink-soft/60">{settings.city}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  const { settings } = useStore();
  const year = new Date().getFullYear();
  const cols = [
    { title: "Coleções", links: collectionsNav.map((c) => ({ label: c.label, to: c.to })) },
    {
      title: "Velas",
      links: [
        { label: "Velas Aromáticas", to: "/velas" },
        { label: "Velas de Massagem", to: "/velas-de-massagem" },
        { label: "Kits e Presentes", to: "/kits" },
      ],
    },
    {
      title: "A Alkaia",
      links: [
        { label: "Sobre a Alkaia", to: "/sobre" },
        { label: "Onde Comprar", to: "/onde-comprar" },
        { label: "Entrega e Retirada", to: "/entrega" },
        { label: "Encomendas Especiais", to: "/encomendas" },
      ],
    },
    {
      title: "Ajuda",
      links: [
        { label: "FAQ", to: "/faq" },
        { label: "Contato", to: "/contato" },
        { label: "Descubra seu Ritual", to: "/ritual" },
      ],
    },
  ];
  return (
    <footer className="mt-24 border-t border-ink/10">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="font-serif text-3xl tracking-[0.22em] text-ink">
              <span className="text-terra-dark">A</span>LKAIA
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-soft">
              Rituais para perfumar, cuidar e transformar momentos.
            </p>
            <div className="mt-6 flex items-center gap-4 text-ink-soft">
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-terra"><IconInstagram className="h-5 w-5" /></a>
              <a href={settings.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="transition-colors hover:text-terra"><IconTikTok className="h-5 w-5" /></a>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="transition-colors hover:text-terra"><IconWhatsApp className="h-5 w-5" /></a>
            </div>
            <p className="mt-6 text-[13px] text-ink-soft">{settings.city}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-4 text-[10px] text-terra">{c.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[13px] text-ink-soft transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 hairline" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[12px] text-ink-soft sm:flex-row">
          <p>© {year || 2026} ALKAIA — Todos os direitos reservados.</p>
          <Link to="/admin" className="text-ink-soft/60 transition-colors hover:text-ink">
            Área administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
