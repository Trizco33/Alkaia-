# ALKAIA — Site Oficial

> **Transforme momentos em rituais.**
> Velas artesanais, experiências sensoriais e rituais de autocuidado.
> Artur Nogueira — SP.

Site institucional e vitrine inteligente da marca ALKAIA, com múltiplos canais de compra
(Loja Oficial, Shopee, Mercado Livre e WhatsApp) e painel administrativo integrado.

---

## Tecnologias

| Ferramenta | Uso |
|---|---|
| **React 19** | Interface |
| **Vite 7** | Build e desenvolvimento |
| **TypeScript** | Tipagem |
| **Tailwind CSS 4** | Estilos |
| **React Router** | Navegação (HashRouter) |

---

## Rodando o projeto localmente

Pré-requisito: **Node.js 18 ou superior** ([baixar aqui](https://nodejs.org)).

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar em modo desenvolvimento
npm run dev

# 3. Gerar a versão de produção
npm run build

# 4. Visualizar a versão de produção
npm run preview
```

O site de desenvolvimento abre em `http://localhost:5173`.
O build final é gerado em `dist/index.html` (arquivo único, pronto para hospedar).

---

## Banco de dados (Supabase)

O site funciona em dois modos automaticamente:

| Modo | Quando | Comportamento |
|---|---|---|
| **Conectado** | Variáveis de ambiente configuradas | Dados salvos no Supabase, visíveis para todos |
| **Demonstração** | Sem variáveis | Dados salvos apenas no navegador |

Para conectar ao banco, siga o guia completo em **[SUPABASE.md](./SUPABASE.md)**.

Resumo rápido:

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Rode o arquivo `supabase/schema.sql` no **SQL Editor**
3. Crie seu usuário em **Authentication → Users** (marque *Auto Confirm*)
4. Copie a URL e a chave `anon` em **Settings → API Keys**
5. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seuprojeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

---

## Painel administrativo

Acesse pela rota `/#/admin` ou pelo link "Área administrativa" no rodapé.

- **Com Supabase:** entre com o usuário criado em Authentication → Users
- **Sem Supabase (demo):** `admin@alkaia.com.br` / `alkaia2026`

No painel é possível gerenciar:
- Produtos (cadastro, edição, exclusão, preços, promoções, estoque, destaques)
- Coleções e categorias
- Links de Shopee, Mercado Livre e WhatsApp por produto
- Solicitações de encomendas especiais e mensagens de contato
- Redes sociais e regiões de entrega
- Dashboard de analytics (visualizações, cliques por canal, origem dos visitantes)

---

## Estrutura de pastas

```
src/
├── App.tsx              # Rotas da aplicação
├── main.tsx             # Ponto de entrada
├── index.css            # Design system (cores, fontes, componentes)
├── components/
│   ├── Layout.tsx       # Header, menu hamburger, footer, SEO
│   └── ui.tsx           # Ícones, cards, botões de canal
├── data/
│   └── seed.ts          # Modelos de dados e conteúdo inicial
├── pages/
│   ├── Home.tsx
│   ├── Collections.tsx  # Coleções (índice + detalhe)
│   ├── Catalog.tsx      # Velas aromáticas, massagem, kits
│   ├── Product.tsx      # Template de produto
│   ├── Company.tsx      # Sobre, Onde Comprar, Entrega
│   ├── Help.tsx         # Encomendas, FAQ, Contato
│   ├── Ritual.tsx       # Descubra seu Ritual
│   └── admin/Admin.tsx  # Painel administrativo
└── store/
    └── store.tsx        # Camada de dados e analytics

public/
├── robots.txt
└── sitemap.xml
```

---

## Substituindo as imagens pelas fotos reais

As imagens atuais são **placeholders** de bancos gratuitos (Pexels), usadas apenas para
definir o estilo e a atmosfera da marca.

Para trocar pelas fotos reais dos produtos:

1. Abra `src/data/seed.ts`
2. Localize o objeto `IMG` no topo do arquivo
3. Substitua as URLs pelas dos arquivos reais (imgbb, Cloudinary ou pasta `public/`)

Ou, mais simples: troque diretamente pelo **painel administrativo**, no campo
"Imagens" de cada produto.

> Mantenha a mesma paleta: luz quente, fundo claro e composição still life.

---

## Deploy

O projeto usa **HashRouter**, portanto funciona em qualquer hospedagem estática
sem necessidade de configuração de rewrites.

Opções recomendadas:
- **Vercel** — conecte o repositório e faça deploy automático
- **Netlify** — arraste a pasta `dist/` ou conecte o repositório
- **Hospedagem tradicional** — suba o conteúdo de `dist/` para `public_html/`

---

© 2026 ALKAIA — Todos os direitos reservados.
