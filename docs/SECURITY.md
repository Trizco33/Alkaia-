# ALKAIA — Segurança
**Baseline de segurança do site + registro do que foi feito e do que está pendente.**

---

## 1. O que já está protegido

### 1.1 Headers HTTP (`vercel.json` / `netlify.toml`)

| Header | Valor | Por quê |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Força HTTPS sempre |
| `Content-Security-Policy` | `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://viacep.com.br https://*.mercadopago.com https://*.mercadolibre.com https://*.mlstatic.com` (+ restrições de script/style/img/font/media/frame — valor completo em `vercel.json`) | Limita de onde scripts, imagens, vídeos e conexões podem vir. `viacep.com.br` entrou para o preenchimento de endereço no checkout; `media-src 'self' https://videos.pexels.com` entrou para o vídeo de fundo do hero da Home (2026-09). Checkout transparente (Payment Brick, 2026-09): `script-src` + `https://sdk.mercadopago.com https://*.mlstatic.com`, `frame-src 'self' https://*.mercadopago.com https://*.mercadolibre.com` (secure fields do cartão em `secure-fields.mercadopago.com`; iframe de fingerprint antifraude em `www.mercadolibre.com` — visto em produção, bloqueá-lo pode derrubar aprovação de cartão), `connect-src` + domínios MP acima (inclui antifraude em `www.mercadolibre.com`). Domínios levantados empiricamente rodando o Brick com Playwright e capturando todas as requisições; wildcards nos 3 domínios do grupo MP para resistir a troca de subdomínio |
| `X-Content-Type-Options` | `nosniff` | Impede sniffing de MIME |
| `X-Frame-Options` | `DENY` | Impede o site de ser embutido em iframe (clickjacking) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Não vaza URLs completas |
| `Permissions-Policy` | câmera/microfone/geolocalização desativados | Nenhuma API sensível é usada |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isola a janela de outras origens |

**Nota sobre `'unsafe-inline'` em `script-src`:** necessário porque o build usa `vite-plugin-singlefile` (JS embutido no HTML). É uma troca consciente; o restante da CSP continua restritivo.

### 1.2 Código

- **Removido o fallback de login com senha fixa** (`alkaia2026`) que existia em `src/store/store.tsx`. Login agora só funciona via Supabase Auth.
- **Removidos `adminEmail`/`adminPassword`** do seed local (`src/data/seed.ts`) — nenhuma credencial no bundle.
- Chave usada no frontend é apenas a `anon key` do Supabase (pública por design).

### 1.3 Banco (Supabase)

- **RLS habilitado em todas as tabelas.**
- Catálogo (`products`, `collections`, `settings`): leitura pública, escrita **somente admin** (via `is_admin()`).
- `special_orders`, `contact_messages`, `analytics_events`: visitante só consegue **inserir** (insert-only); leitura/gestão somente admin.
- `orders` (vendas): visitante **não escreve nem lê nada** pelo site — inserção só pelas Edge Functions (service role, ignora RLS); leitura/atualização só admin via `is_admin()`.
- **Cadastro público de usuários desligado** (`disable_signup: true`) — ninguém consegue criar conta nova.
- Tabela `public.admin_users` + função `public.is_admin()` (security definer) controlam quem é admin; 9 políticas de escrita/gestão usam `is_admin()`. Única admin cadastrada: conta da proprietária.

---

## 2. Pendência crítica — ✅ RESOLVIDA (2026-09)

Havia uma falha grave: o cadastro público estava ligado e as políticas de escrita aceitavam *qualquer usuário autenticado* — qualquer pessoa podia se cadastrar e virar admin.

**Correção aplicada em 2026-09 (verificada via Management API):**

1. ✅ "Allow new users to sign up" desativado no painel (Authentication → Sign In / Providers → Email).
2. ✅ `supabase/security-upgrade.sql` executado no SQL Editor: criou `admin_users`, `is_admin()` e refez as 9 políticas de escrita restringindo à admin real.

Se um dia for preciso adicionar outro admin: inserir o `user_id` dele em `public.admin_users` via SQL Editor (a tabela não tem políticas — só o painel/SQL Editor consegue escrever nela).

---

## 3. Boas práticas contínuas

- Nunca commitar `.env.local`, tokens ou chaves (verificar `.gitignore`).
- Nunca usar a `service_role` key no frontend.
- **Pagamentos**: `MP_ACCESS_TOKEN` (Mercado Pago) e `SUPERFRETE_TOKEN` vivem apenas como secrets das Edge Functions (`supabase secrets set`) — nunca no frontend nem no repo. Preço, estoque e frete são sempre revalidados no servidor (`create-order`); o valor vindo do browser nunca é usado para cobrar.
- O webhook do MP (`mp-webhook`) não confia no corpo da notificação: sempre reconsulta o pagamento na API do Mercado Pago antes de atualizar o pedido.
- Ao adicionar domínio externo novo (fonte, imagem, API), atualizar a CSP nos dois arquivos de config **e** registrar aqui.
- Revisar as políticas RLS sempre que criar tabela nova — RLS ligado sem política = tudo bloqueado (seguro por padrão).
- Trocar a senha da conta admin se houver qualquer suspeita de vazamento.

## 4. Histórico

- **2026-09** — Auditoria completa: headers adicionados, credenciais removidas do código, script `security-upgrade.sql` criado, falha de signup aberto identificada.
- **2026-09** — Falha crítica corrigida: signup público desligado e políticas de escrita restritas via `is_admin()` (script executado no painel). Verificado via Management API: `disable_signup: true`, tabela/função criadas, 9 políticas ativas, 1 admin cadastrada.

## 5. CMS (site_content + storage)

- `site_content`: RLS — select público; insert/update só `is_admin()`. Verificado: PATCH/INSERT com anon key retornam 0 linhas/42501.
- Bucket `site-images`: público para leitura; insert/update/delete em `storage.objects` só `is_admin()`; limite 8MB e apenas mimes de imagem. Verificado: upload anon (image/png) → 403 AccessDenied.
- **2026-09-07** — CMS adicionado e testado: escrita anônima bloqueada em tabela e bucket; leitura pública ok.

## 6. Blog (blog_posts)

- `blog_posts`: RLS — select `published OR is_admin()` (anon só vê publicados; rascunhos exigem admin logado); insert/update/delete só `is_admin()`.
- **2026-09-07** — Verificado com anon key: INSERT → 401; UPDATE → 0 linhas; SELECT com rascunho no banco → `[]`. E2E: post publicado aparece em `/blog`, `/blog/:slug` e no sitemap dinâmico; post de teste removido ao final.
