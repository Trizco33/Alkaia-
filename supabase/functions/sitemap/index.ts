/* ============================================================
   ALKAIA — Sitemap dinâmico (sitemap.xml)
   GET → XML com as páginas fixas do site + posts publicados do blog.
   Servido em alkaia.com.br/sitemap.xml via rewrite no vercel.json.
   Deploy com --no-verify-jwt (o Google acessa sem autenticação).
   ============================================================ */

import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = Deno.env.get("SITE_URL") || "https://alkaia.com.br";

const STATIC_PATHS = [
  "/",
  "/colecoes",
  "/colecoes/floralis",
  "/colecoes/rituais",
  "/colecoes/edicoes-especiais",
  "/velas",
  "/velas-de-massagem",
  "/kits",
  "/entrega",
  "/encomendas",
  "/sobre",
  "/faq",
  "/contato",
  "/ritual",
  "/blog",
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

Deno.serve(async (req) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Método não permitido.", { status: 405 });
  }

  let postUrls = "";
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    postUrls = (data || [])
      .map((p) => {
        const lastmod = p.updated_at ? `<lastmod>${String(p.updated_at).slice(0, 10)}</lastmod>` : "";
        return `  <url><loc>${SITE}/blog/${esc(p.slug)}</loc>${lastmod}</url>`;
      })
      .join("\n");
  } catch (e) {
    console.error("sitemap: erro ao buscar posts:", e);
  }

  const staticUrls = STATIC_PATHS.map((p) => {
    const freq = p === "/" || p === "/blog" || p === "/velas" || p === "/colecoes" ? "<changefreq>weekly</changefreq>" : "";
    return `  <url><loc>${SITE}${p}</loc>${freq}</url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
