import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import { ProductCard, ChannelButtons, Reveal, IconArrow, IconLeaf, IconFlame, IconDrop, IconShield, IconMapPin, IconCheck } from "../components/ui";

export default function Product() {
  const { slug } = useParams();
  const { productBySlug, collectionById, categoryById, products, track, formatPrice } = useStore();
  const product = productBySlug(slug || "");
  const [active, setActive] = useState(0);

  useSeo(
    product ? (product.seoTitle || product.name) : "Produto",
    product ? (product.seoDescription || product.shortDescription) : undefined
  );

  useEffect(() => {
    if (product) track("view_product", { slug: product.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product || product.status === "inactive") {
    return (
      <div className="shell py-32 text-center">
        <p className="font-serif text-3xl text-ink">Produto não encontrado.</p>
        <Link to="/velas" className="btn-outline mt-6">Ver velas</Link>
      </div>
    );
  }

  const col = collectionById(product.collectionId);
  const cat = categoryById(product.categoryId);
  const related = products
    .filter((p) => p.status === "active" && p.id !== product.id && p.collectionId === product.collectionId)
    .slice(0, 4);
  const onSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const isMassage = product.categoryId === "cat-massagem";

  const gallery = product.images.length ? product.images : [product.images[0]];

  return (
    <div className="shell py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[12px] text-ink-soft">
        <Link to="/" className="hover:text-ink">Início</Link>
        <span>/</span>
        {col && (
          <>
            <Link to={`/colecoes/${col.slug}`} className="hover:text-ink">{col.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-[2px] bg-linen">
            <img src={gallery[active]} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-20 w-16 shrink-0 overflow-hidden rounded-[2px] border-2 ${active === i ? "border-terra" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-terra">
            {col && <span>{col.name}</span>}
            {cat && <span className="text-ink-soft/50">·</span>}
            {cat && <span>{cat.name}</span>}
          </div>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl text-balance">{product.name}</h1>

          {isMassage ? (
            <Link to="/velas-de-massagem" className="mt-2 inline-flex items-center gap-2 text-[12px] font-medium text-terra">
              Linha de velas de massagem <IconArrow className="h-3.5 w-3.5" />
            </Link>
          ) : null}

          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft text-pretty">{product.shortDescription}</p>

          <div className="mt-6 flex items-end gap-3">
            {onSale ? (
              <>
                <span className="text-3xl font-medium text-ink">{formatPrice(product.salePrice!)}</span>
                <span className="mb-1 text-lg text-ink-soft/60 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-medium text-ink">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[12px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-3 py-1.5 text-ink-soft">
              <IconLeaf className="h-3.5 w-3.5 text-olive" /> {product.weight}
            </span>
            {product.burnTime && !isMassage && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-3 py-1.5 text-ink-soft">
                <IconFlame className="h-3.5 w-3.5 text-terra" /> {product.burnTime}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium ${product.stock > 0 ? "bg-linen text-olive" : "bg-ink/8 text-ink-soft"}`}>
              {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
            </span>
          </div>

          <p className="mt-5 text-[12px] uppercase tracking-[0.2em] text-ink-soft/70">Perfil olfativo</p>
          <p className="mt-1 text-[15px] text-ink">{product.olfactoryProfile}</p>

          {product.aromaticNotes.length > 0 && (
            <>
              <p className="mt-5 text-[12px] uppercase tracking-[0.2em] text-ink-soft/70">Notas aromáticas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.aromaticNotes.map((n) => (
                  <span key={n} className="rounded-full bg-linen px-3.5 py-1.5 text-[12px] text-ink">{n}</span>
                ))}
              </div>
            </>
          )}

          {/* Onde você prefere comprar */}
          <div className="mt-8 rounded-[2px] border border-ink/10 bg-ghost p-5">
            <p className="font-serif text-lg text-ink">Onde você prefere comprar?</p>
            <p className="mt-1 text-[12px] text-ink-soft">Escolha o canal que preferir — o produto é o mesmo.</p>
            <ChannelButtons product={product} className="mt-4" />
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-[12px] text-ink-soft">
            {product.availableForPickup && (
              <span className="inline-flex items-center gap-1.5"><IconMapPin className="h-4 w-4 text-terra" /> Retirada em {product.stock > 0 ? "Artur Nogueira — SP" : "—"}</span>
            )}
            {product.availableForDelivery && (
              <span className="inline-flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-olive" /> Envio para todo o Brasil</span>
            )}
          </div>
        </div>
      </div>

      {/* Descrição completa / specs */}
      <div className="mt-16 grid gap-10 border-t border-ink/10 pt-14 lg:grid-cols-3 lg:gap-16">
        <Reveal className="lg:col-span-2">
          <h2 className="text-3xl text-ink">Sobre {product.name}</h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft text-pretty">{product.description}</p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 font-serif text-xl text-ink"><IconDrop className="h-5 w-5 text-terra" /> Ingredientes</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{product.ingredients}</p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-serif text-xl text-ink"><IconFlame className="h-5 w-5 text-terra" /> Modo de uso</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{product.instructions}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[2px] border border-ink/10 bg-linen p-6">
            <h3 className="flex items-center gap-2 font-serif text-xl text-ink"><IconShield className="h-5 w-5 text-terra" /> Cuidados</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{product.care}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-ghost px-3 py-1 text-[12px] text-ink-soft">Artesanal</span>
              <span className="rounded-full bg-ghost px-3 py-1 text-[12px] text-ink-soft">Feito à mão</span>
              <span className="rounded-full bg-ghost px-3 py-1 text-[12px] text-ink-soft">Pequenos lotes</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <div className="mt-20">
          <Reveal>
            <h2 className="text-center font-serif text-3xl text-ink sm:text-4xl">Você também pode gostar</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
