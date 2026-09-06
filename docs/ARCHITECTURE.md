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

Tabelas (todas com RLS habilitado): `products`, `collections`, `settings`, `special_orders`, `contact_messages`, `analytics_events`.

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
3. Verificação pós-deploy: abrir o site, testar navegação, catálogo, formulário de contato e login admin.
