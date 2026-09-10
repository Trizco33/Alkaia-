import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import {
  IconArrow,
  IconBag,
  IconWhatsApp,
  IconInstagram,
  IconTikTok,
  IconMail,
} from "../components/ui";

/* =====================================================================
   /links — Página para a bio do Instagram (estilo "linktree")
   - Mesma identidade visual do site (cores, tipografia, componentes)
   - Textos e logo editáveis no painel (grupo "Página de Links")
   - Endereços (WhatsApp, redes, marketplaces) vêm de Configurações
   - Catálogo: produtos ativos, destaque primeiro, direto do banco
   ===================================================================== */

function LinkButton({
  href,
  to,
  label,
  icon,
}: {
  href?: string;
  to?: string;
  label: string;
  icon: React.ReactNode;
}) {
  const cls =
    "group flex w-full items-center gap-4 border border-ink/12 bg-ghost px-5 py-4 text-sm font-medium tracking-wide text-ink shadow-whisper transition-all duration-300 hover:border-terra hover:bg-terra hover:text-cream active:bg-terra-dark";
  const inner = (
    <>
      <span className="text-terra transition-colors duration-300 group-hover:text-cream">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <IconArrow className="h-4 w-4 opacity-40 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  );
}

export default function Links() {
  const { products, settings, content, formatPrice } = useStore();
  useSeo("Links", "Todos os links da Alkaia: loja, WhatsApp, redes sociais e catálogo de velas artesanais.");

  const items = [...products]
    .filter((p) => p.status === "active")
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  const iconCls = "h-5 w-5";

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-14">
        {/* Topo: logo + frase */}
        <header className="flex flex-col items-center text-center">
          {content["links.logo"] ? (
            <img
              src={content["links.logo"]}
              alt={settings.brandName}
              className="h-16 w-auto object-contain"
              loading="eager"
            />
          ) : (
            <h1 className="font-serif text-3xl text-ink">{settings.brandName}</h1>
          )}
          {content["links.subtitle"] && (
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{content["links.subtitle"]}</p>
          )}
        </header>

        {/* Botões de links */}
        <nav className="mt-8 flex flex-col gap-3" aria-label="Links da Alkaia">
          <LinkButton to="/" label={content["links.btn.site"]} icon={<IconBag className={iconCls} />} />
          {settings.whatsapp && (
            <LinkButton
              href={`https://wa.me/${settings.whatsapp}`}
              label={content["links.btn.whatsapp"]}
              icon={<IconWhatsApp className={iconCls} />}
            />
          )}
          {settings.instagram && (
            <LinkButton
              href={settings.instagram}
              label={content["links.btn.instagram"]}
              icon={<IconInstagram className={iconCls} />}
            />
          )}
          {settings.tiktok && (
            <LinkButton
              href={settings.tiktok}
              label={content["links.btn.tiktok"]}
              icon={<IconTikTok className={iconCls} />}
            />
          )}
          {settings.shopee && (
            <LinkButton
              href={settings.shopee}
              label={content["links.btn.shopee"]}
              icon={<IconBag className={iconCls} />}
            />
          )}
          {settings.mercadolivre && (
            <LinkButton
              href={settings.mercadolivre}
              label={content["links.btn.mercadolivre"]}
              icon={<IconBag className={iconCls} />}
            />
          )}
          {settings.email && (
            <LinkButton
              href={`mailto:${settings.email}`}
              label={content["links.btn.email"]}
              icon={<IconMail className={iconCls} />}
            />
          )}
        </nav>

        {/* Catálogo */}
        {items.length > 0 && (
          <section className="mt-12">
            <div className="text-center">
              <p className="eyebrow text-terra">{content["links.catalog.title"]}</p>
              {content["links.catalog.text"] && (
                <p className="mt-2 text-sm text-ink-soft">{content["links.catalog.text"]}</p>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
              {items.map((p) => (
                <Link key={p.id} to={`/produto/${p.slug}`} className="group block">
                  <div className="overflow-hidden bg-linen">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 font-serif text-[15px] leading-snug text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm text-ink">
                    {p.salePrice ? (
                      <>
                        <span className="mr-2 text-ink-soft/70 line-through">{formatPrice(p.price)}</span>
                        <span className="font-medium text-terra">{formatPrice(p.salePrice)}</span>
                      </>
                    ) : (
                      <span className="font-medium">{formatPrice(p.price)}</span>
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Rodapé */}
        <footer className="mt-12 text-center">
          <div className="hairline" />
          <a href="/" className="mt-6 inline-block text-[12px] tracking-[0.2em] text-ink-soft uppercase">
            {content["links.footer"]}
          </a>
        </footer>
      </div>
    </div>
  );
}
