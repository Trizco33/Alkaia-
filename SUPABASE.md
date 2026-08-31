# Conectando a ALKAIA ao Supabase

Guia passo a passo para transformar o painel administrativo em um sistema real,
com banco de dados na nuvem. Depois disso, tudo que você cadastrar no painel
aparece para **todos os visitantes** do site.

---

## Passo 1 — Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e entre na sua conta
2. Clique em **New project**
3. Preencha:

| Campo | Valor sugerido |
|---|---|
| Name | `alkaia` |
| Database Password | Gere uma senha forte e **guarde em local seguro** |
| Region | `South America (São Paulo)` |
| Plan | Free |

4. Clique em **Create new project** e aguarde ~2 minutos

---

## Passo 2 — Criar as tabelas

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. **Copie todo o conteúdo** e cole no editor
5. Clique em **Run** (ou `Ctrl + Enter`)

Deve aparecer **"Success. No rows returned"**.

Para conferir: vá em **Table Editor** — você verá as tabelas `products`,
`collections`, `categories`, `special_orders`, `contact_messages`,
`analytics_events`, `delivery_regions`, `product_variants` e `settings`,
já preenchidas com os 9 produtos e 3 coleções iniciais.

---

## Passo 3 — Criar o seu usuário administrador

1. No menu lateral: **Authentication → Users**
2. Clique em **Add user → Create new user**
3. Preencha:
   - **Email:** o e-mail que você usará para entrar no painel
   - **Password:** uma senha forte
   - ✅ Marque **Auto Confirm User** (importante!)
4. Clique em **Create user**

> Esse será o login do painel. A senha antiga (`alkaia2026`) deixa de valer
> assim que o Supabase estiver conectado.

**Importante — desative o cadastro público:**

1. Vá em **Authentication → Sign In / Providers**
2. Em **Email**, desative a opção **Allow new users to sign up**

Isso impede que estranhos criem contas e acessem o painel.

---

## Passo 4 — Pegar as chaves de acesso

1. Menu lateral: **Settings** (engrenagem) → **API Keys**
2. Copie os dois valores:

| Nome no Supabase | Vai virar |
|---|---|
| **Project URL** | `VITE_SUPABASE_URL` |
| **anon public** | `VITE_SUPABASE_ANON_KEY` |

> ⚠️ A chave `service_role` **nunca** deve ser usada no site nem enviada ao GitHub.
> Use apenas a `anon public` — ela é segura porque o banco está protegido por RLS.

---

## Passo 5 — Configurar no seu computador

Na pasta do projeto, crie um arquivo chamado **`.env`** com este conteúdo:

```env
VITE_SUPABASE_URL=https://seuprojeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

Substitua pelos valores copiados no passo anterior.

Depois rode:

```bash
npm run dev
```

Acesse `http://localhost:5173/#/admin` e entre com o e-mail e senha criados
no Passo 3. No topo do painel deve aparecer o selo verde **"Conectado ao banco"**.

> O arquivo `.env` já está no `.gitignore` — ele **não** será enviado ao GitHub. Isso é o correto.

---

## Passo 6 — Configurar na Vercel

Como o `.env` não vai para o GitHub, você precisa informar as chaves na Vercel:

1. Acesse o projeto na [vercel.com](https://vercel.com)
2. **Settings → Environment Variables**
3. Adicione as duas variáveis:

| Key | Value | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | sua URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | sua chave anon | Production, Preview, Development |

4. Vá em **Deployments** → nos três pontinhos do último deploy → **Redeploy**

> ⚠️ **Passo obrigatório:** as variáveis só entram no site após um novo deploy.

---

## Pronto! O que muda agora

| Antes | Agora |
|---|---|
| Produtos salvos só no seu navegador | Salvos no banco, visíveis para todos |
| Senha fixa no código | Login real com Supabase Auth |
| Encomendas perdidas ao limpar o navegador | Gravadas no banco permanentemente |
| Analytics só do seu acesso | Métricas reais de todos os visitantes |

Agora você pode cadastrar produtos pelo celular e eles aparecem no site
imediatamente para qualquer pessoa.

---

## Modo demonstração (sem Supabase)

Se as variáveis não estiverem configuradas, o site **continua funcionando
normalmente** com os dados de exemplo salvos no navegador. Um aviso amarelo
aparece no painel indicando esse modo.

Isso é útil para testar o site sem depender do banco.

---

## Hospedando as fotos dos produtos

Quando tiver as fotos reais, você tem duas opções:

### Opção A — Supabase Storage (recomendado)

1. No Supabase: **Storage → New bucket**
2. Nome: `produtos` · marque **Public bucket**
3. Faça upload das fotos
4. Clique em cada foto → **Copy URL**
5. Cole a URL no campo **Imagens** do produto, no painel

### Opção B — imgbb ou Cloudinary

Faça upload em [imgbb.com](https://imgbb.com), copie o link direto da imagem
e cole no painel.

> Dica: use fotos de no máximo 1200px de largura para o site carregar rápido.

---

## Problemas comuns

**"Invalid login credentials"**
O usuário não foi criado ou não foi confirmado. Volte ao Passo 3 e verifique
se marcou **Auto Confirm User**.

**O painel mostra "Modo demonstração" mesmo com as chaves configuradas**
Reinicie o servidor (`Ctrl+C` e `npm run dev` novamente). Variáveis de ambiente
só são lidas na inicialização. Na Vercel, faça o **Redeploy**.

**Salvo um produto mas ele não aparece no site**
Confirme se o campo **Status** está como "Ativo" e se o produto tem pelo menos
uma imagem.

**"new row violates row-level security policy"**
Você não está autenticado. Saia e entre novamente no painel.

---

## Próximos passos possíveis

A estrutura já está preparada para evoluir:

- **Carrinho e checkout** — tabelas `orders` e `order_items`
- **Pagamento** — Mercado Pago ou Stripe via Supabase Edge Functions
- **Cálculo de frete** — integração com Correios/Melhor Envio
- **Área do cliente** — o Supabase Auth já suporta cadastro de clientes
- **Variações de produto** — a tabela `product_variants` já existe e está populada
  com Essencial 40g e Premium 100g do Ritual dos Pés
