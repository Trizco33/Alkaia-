# ALKAIA — Segurança
**Baseline de segurança do site + registro do que foi feito e do que está pendente.**

---

## 1. O que já está protegido

### 1.1 Headers HTTP (`vercel.json` / `netlify.toml`)

| Header | Valor | Por quê |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Força HTTPS sempre |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` | Limita de onde scripts, imagens e conexões podem vir |
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
- Ao adicionar domínio externo novo (fonte, imagem, API), atualizar a CSP nos dois arquivos de config **e** registrar aqui.
- Revisar as políticas RLS sempre que criar tabela nova — RLS ligado sem política = tudo bloqueado (seguro por padrão).
- Trocar a senha da conta admin se houver qualquer suspeita de vazamento.

## 4. Histórico

- **2026-09** — Auditoria completa: headers adicionados, credenciais removidas do código, script `security-upgrade.sql` criado, falha de signup aberto identificada.
- **2026-09** — Falha crítica corrigida: signup público desligado e políticas de escrita restritas via `is_admin()` (script executado no painel). Verificado via Management API: `disable_signup: true`, tabela/função criadas, 9 políticas ativas, 1 admin cadastrada.
