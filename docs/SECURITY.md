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
- Catálogo (`products`, `collections`, `settings`): leitura pública, escrita só autenticado.
- `special_orders`, `contact_messages`, `analytics_events`: visitante só consegue **inserir** (insert-only); leitura/gestão só autenticado.

---

## 2. ⚠️ Pendência CRÍTICA — exige ação no painel do Supabase

**Problema:** o cadastro público de usuários está **ligado** e as políticas de escrita valem para *qualquer usuário autenticado*. Ou seja: hoje, qualquer pessoa pode criar uma conta e ganhar poderes de admin (editar produtos, ler mensagens de clientes).

O token de acesso disponível é somente-leitura, então a correção precisa ser feita manualmente (≈ 2 minutos):

1. **Desligar cadastro público:** painel Supabase → *Authentication* → *Sign In / Providers* → *Email* → desativar **"Allow new users to sign up"**.
2. **Restringir escrita à admin real:** painel Supabase → *SQL Editor* → colar e executar o conteúdo de **`supabase/security-upgrade.sql`** (cria a tabela `admin_users`, a função `is_admin()` e refaz as políticas de escrita para aceitar apenas a conta admin cadastrada).

Enquanto isso não for feito, a falha continua em produção.

---

## 3. Boas práticas contínuas

- Nunca commitar `.env.local`, tokens ou chaves (verificar `.gitignore`).
- Nunca usar a `service_role` key no frontend.
- Ao adicionar domínio externo novo (fonte, imagem, API), atualizar a CSP nos dois arquivos de config **e** registrar aqui.
- Revisar as políticas RLS sempre que criar tabela nova — RLS ligado sem política = tudo bloqueado (seguro por padrão).
- Trocar a senha da conta admin se houver qualquer suspeita de vazamento.

## 4. Histórico

- **2026-09** — Auditoria completa: headers adicionados, credenciais removidas do código, script `security-upgrade.sql` criado, falha de signup aberto identificada (pendente de ação manual, ver seção 2).
