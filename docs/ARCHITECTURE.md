# ALKAIA — Arquitetura Técnica

## 1. Visão geral

Site institucional + catálogo de velas artesanais, com painel admin. SPA estática com backend opcional (Supabase).

```
React 19 + TypeScript
Vite 7 (vite-plugin-singlefile → JS inline no index.html)
Tailwind CSS 4 (tokens em src/index.css via @theme)
React Router (HashRouter)
Supabase (Postgres + Auth) — opcional, com fallback local
Deploy: Vercel (push na main = deploy automático) · config Netlify espelhada
```

## 2. Estrutura de pastas

```
src/
  components/Layout.tsx     # Header, drawer mobile, footer
  pages/                    # Home, catálogo, produto, sobre, contato, admin
  store/store.tsx           # Estado global + camada de dados (Supabase ou seed)
  data/seed.ts              # Conteúdo local de fallback (produtos, settings)
  index.css                 # Design tokens + base + componentes + motion
public/brand/               # Logos oficiais (terracota)
docs/                       # Living Design System (este diretório)
supabase/                   # Scripts SQL (security-upgrade.sql)
vercel.json / netlify.toml  # Headers de segurança + roteamento
```

## 3. Camada de dados

- **Com Supabase** (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` definidos): catálogo, pedidos especiais, mensagens de contato e analytics vão ao Postgres. Auth do admin via Supabase Auth (e-mail/senha).
- **Sem Supabase**: o site funciona 100% em modo leitura com `seed.ts`. O painel admin **não** aceita login (o fallback com senha fixa foi removido — decisão de segurança).

Tabelas (todas com RLS habilitado): `products`, `collections`, `settings`, `special_orders`, `contact_messages`, `analytics_events`, `orders`.

## 4. Build single-file

`vite-plugin-singlefile` embute o JS no `index.html`. Consequências:

- A CSP precisa de `'unsafe-inline'` em `script-src` (documentado em `SECURITY.md`).
- Roteamento usa HashRouter — sem necessidade de rewrites no servidor.
- O deploy é um artefato único e fácil de servir em qualquer host estático.

## 5. Ambientes e variáveis

| Variável | Onde | Uso |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel (build) | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Vercel (build) | Chave pública (anon) — segura para expor |

Nunca colocar `service_role` key no frontend.

## 6. Fluxo de deploy

1. Commit na `main` → Vercel builda (`npm run build`) e publica.
2. Headers de segurança aplicados pelo `vercel.json`.
3. Verificação pós-deploy: abrir o site, testar navegação, catálogo, carrinho/checkout, formulário de contato e login admin.

## 7. E-commerce (Mercado Pago + SuperFrete)

Fluxo de venda direto no site — sem Shopee/ML/compra por WhatsApp:

```
Carrinho (localStorage alkaia_cart_v1, src/store/cart.tsx)
  → Checkout (src/pages/Shop.tsx): dados do cliente + ViaCEP + cotação de frete
  → Edge Function create-order: revalida preço/estoque no DB, recota frete,
    insere em `orders`, cria preference no Mercado Pago (Checkout Pro)
  → Redirect para o Mercado Pago (initPoint)
  → Webhook mp-webhook: consulta o pagamento no MP, atualiza status do pedido,
    baixa estoque UMA vez (flag stock_debited) quando approved
  → Volta ao site em /#/pedido/confirmacao?order=...
```

Edge Functions (Supabase, Deno):

| Function | Papel | JWT |
|---|---|---|
| `shipping-quote` | Cota frete nos Correios via SuperFrete (PAC/SEDEX) | sim |
| `create-order` | Valida pedido, insere em `orders`, cria preference MP | sim |
| `mp-webhook` | Recebe notificações do MP, atualiza status + estoque | não (`verify_jwt = false`) |

Secrets das functions (via `supabase secrets set`): `MP_ACCESS_TOKEN`, `SUPERFRETE_TOKEN`, `SITE_URL`, `FROM_CEP`.

Princípios:
- **Nunca confiar no browser**: preço, estoque e frete são revalidados no servidor antes de criar o pedido.
- **Idempotência**: estoque só é debitado uma vez (`stock_debited`), e pedidos pagos nunca são rebaixados de status pelo webhook.
- **Fallback**: sem as functions/secrets configuradas, o checkout mostra aviso de manutenção — o restante do site funciona normalmente.
- Rotas novas: `/carrinho`, `/checkout`, `/pedido/confirmacao`; `/onde-comprar` redireciona para `/velas`.
- Gestão de pedidos: aba **Vendas** no painel admin (status + código de rastreio).

## 8. CMS — textos e fotos editáveis (aba "Site" no admin)

- Tabela `public.site_content` (linha única `id=1`, coluna `data` jsonb): guarda **apenas o diff** em relação aos padrões — melhorias futuras nos textos padrão propagam a menos que a cliente tenha editado o campo.
- `src/data/content.ts`: `contentDefaults` (mapa plano chave→string com todos os textos/imagens), `contentSchema` (grupos/labels PT para renderização genérica no admin), `mergeContent` (defaults + banco, só chaves conhecidas), `diffContent` (o que difere do default).
- `src/store/store.tsx`: carrega `site_content` em `loadPublicData`, expõe `content` e `updateContent` no `StoreValue`; fallback localStorage no modo offline.
- `src/lib/upload.ts`: redimensiona a foto no navegador (canvas → webp, máx 1920px, q 0.85) e envia ao bucket público `site-images` (limite 8MB, só mimes de imagem).
- Admin (`src/pages/admin/Admin.tsx`): aba **Site** renderiza `contentSchema` genericamente (input/textarea/`ImageField`); `ImageField` (preview + "Enviar foto" + campo URL) também usado em Produtos (append de linha) e Coleções. `extractImageUrl` aceita HTML colado (ex.: embed do ibb.co) e extrai só a URL.
- Páginas ligadas ao content: `Layout` (faixa do topo), `Home`, `Sobre`, `VelasAromaticas`, `Massagem`, `Kits`. FAQ, footer e menu ficam fixos (segurança de rotas).
- SQL idempotente em `supabase/site_content.sql` (já executado).

## 9. Blog + BrowserRouter + sitemap dinâmico

- Tabela `public.blog_posts` (slug unique, title, excerpt, cover_url, body, published, published_at): RLS select `published OR is_admin()` — a mesma query serve público (só publicados) e admin logado (inclui rascunhos, via `refreshAdminData`). Escrita só `is_admin()`. SQL idempotente em `supabase/blog.sql`.
- Corpo do post é **texto simples** com duas regras: linha em branco separa parágrafos; linha começando com `## ` vira subtítulo (`<h2>`). Sem lib de markdown de propósito (bundle menor, simples para a cliente).
- Páginas: `src/pages/Blog.tsx` (`BlogList` em `/blog`, `BlogPostPage` em `/blog/:slug`, ambas com `useSeo` e tracking `view_blog`/`view_blog_post`). Links no nav e no footer (`Layout.tsx`). Admin: aba **Blog** (`BlogManager` em `Admin.tsx`) com slug automático a partir do título, capa via `ImageField`, publicar/rascunho/despublicar.
- **HashRouter → BrowserRouter**: URLs agora sem `#` (ex.: `/velas`). Componente `HashRedirect` no `App.tsx` redireciona links antigos `/#/rota?query` para `/rota?query` (preserva query string — o `back_url` do Mercado Pago em `create-order` continua com `/#/` e funciona via esse redirect; `create-order` não foi alterado de propósito). O catch-all do `vercel.json` (`/(.*) → /index.html`) faz o SPA fallback em produção.
- **Sitemap dinâmico**: Edge Function `sitemap` (deployada com `--no-verify-jwt`) gera XML com as rotas estáticas + posts publicados (lastmod). `vercel.json` tem rewrite `/sitemap.xml → função` (antes do catch-all); o `public/sitemap.xml` estático foi removido (filesystem ganharia do rewrite). `robots.txt` segue apontando para `https://alkaia.com.br/sitemap.xml`.

## 10. Home redesenhada + motion system

- **Estrutura da Home** (`src/pages/Home.tsx`): Hero com vídeo → Coleções (3 cartões) → slider editorial (Matéria/Ritual/Alkaia) → "Os favoritos da Alkaia" (produtos `active && featured`) → storytelling ("Feito de matéria, tempo e intenção") → selos. Todos os textos/imagens vêm do CMS (`home.*` em `content.ts`); os **links dos cartões/slides são fixos no código** (segurança de rotas).
- **Vídeo do hero** (`HeroMedia`): `home.hero.video` opcional (vazio = só foto com ken-burns sutil). `<video autoPlay muted loop playsInline>` com `poster` = `home.hero.image`, montado só após o mount; pulado se `prefers-reduced-motion` ou `navigator.connection.saveData`; `onError` cai na foto. A foto fica sempre por baixo como fallback. CSP exige `media-src 'self' https://videos.pexels.com` (vercel.json + netlify.toml) — vídeos de outros domínios precisam entrar na CSP.
- **Slider editorial** (`StorySlider`): scroll-snap nativo (sem lib), swipe no mobile, setas com `aria-label` + dots; `scrollTo` usa `behavior: "auto"` quando reduced-motion.
- **Motion system** (`src/index.css`): tokens `--ease-alkaia` e `--duration-*`; `.reveal-hidden/.reveal-shown` agora com blur→sharp; `.reveal-img` (scale 1.04→1 dentro de um Reveal); `.animate-ken-burns` (zoom 22s no hero sem vídeo). Tudo respeita `prefers-reduced-motion` (guarda em `@layer base`).
- **ProductCard** (`src/components/ui.tsx`): indicador real de disponibilidade (`stock <= 0` → selo "Esgotado", imagem dessaturada); hover só desktop (`[@media(hover:hover)]`: scale da imagem + botão "Conhecer produto" surge). Sem avaliações/vendas inventadas — únicos selos são dados reais (Oferta, Destaque, Esgotado).
