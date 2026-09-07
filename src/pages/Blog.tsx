import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import { Reveal, SectionHeader, IconArrow, IconArrowLeft } from "../components/ui";

function formatDate(ts: number | null) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

/** Renderiza o texto do post: parágrafos separados por linha em branco;
 *  linhas iniciadas com "## " viram subtítulos. */
export function PostBody({ body }: { body: string }) {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl">
      {blocks.map((block, i) =>
        block.startsWith("## ") ? (
          <h2 key={i} className="mt-10 mb-4 font-serif text-2xl text-ink sm:text-3xl">
            {block.slice(3).trim()}
          </h2>
        ) : (
          <p key={i} className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
            {block}
          </p>
        )
      )}
    </div>
  );
}

/* ============ LISTA DE POSTS ============ */
export function BlogList() {
  const { posts, track } = useStore();
  useSeo("Blog", "Histórias, rituais e bastidores das velas artesanais Alkaia.");
  const items = posts.filter((p) => p.published);

  useEffect(() => {
    track("view_blog");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Blog"
          title="Histórias e rituais"
          text="Bastidores do ateliê, dicas de uso e o universo das velas artesanais."
        />
      </Reveal>

      {items.length === 0 ? (
        <p className="mt-16 text-center text-[14px] text-ink-soft">
          Em breve, novas histórias por aqui. ✨
        </p>
      ) : (
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group">
              {p.coverUrl ? (
                <div className="overflow-hidden rounded-[2px]">
                  <img
                    src={p.coverUrl}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full rounded-[2px] bg-ink/5" />
              )}
              <p className="mt-4 text-[11px] tracking-[0.16em] uppercase text-terra">{formatDate(p.publishedAt)}</p>
              <h2 className="mt-2 font-serif text-xl text-ink transition-colors group-hover:text-terra sm:text-2xl">
                {p.title}
              </h2>
              {p.excerpt && <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{p.excerpt}</p>}
              <span className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-terra">
                Ler post <IconArrow className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ POST ============ */
export function BlogPostPage() {
  const { slug } = useParams();
  const { posts, loading, track } = useStore();
  const post = posts.find((p) => p.slug === slug && p.published);
  useSeo(post ? post.title : "Blog", post?.excerpt || "Blog da Alkaia.");

  useEffect(() => {
    if (post) track("view_blog_post", { slug: post.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id]);

  if (!post) {
    return (
      <div className="shell py-24 text-center">
        <p className="text-[14px] text-ink-soft">{loading ? "Carregando…" : "Post não encontrado."}</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-terra">
          <IconArrowLeft className="h-3.5 w-3.5" /> Voltar ao blog
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-20">
      {post.coverUrl && (
        <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden sm:h-[52vh]">
          <img src={post.coverUrl} alt={post.title} loading="eager" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/25" />
        </div>
      )}

      <div className="shell pt-12 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-terra">{formatDate(post.publishedAt)}</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{post.excerpt}</p>}
        </div>

        <PostBody body={post.body} />

        <div className="mx-auto mt-14 max-w-2xl border-t border-ink/10 pt-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[13px] font-medium text-terra">
            <IconArrowLeft className="h-3.5 w-3.5" /> Voltar ao blog
          </Link>
        </div>
      </div>
    </article>
  );
}
