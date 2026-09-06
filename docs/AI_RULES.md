# ALKAIA — Regras para IA
**Instruções obrigatórias para qualquer agente de IA que edite este projeto.**

Leia `docs/DESIGN_SYSTEM.md` antes de qualquer mudança visual e `docs/SECURITY.md` antes de qualquer mudança em auth, dados ou headers.

---

## 1. Regras invioláveis

1. **Nunca invente valores visuais.** Cores, fontes, durações, sombras e espaçamentos vêm dos tokens em `src/index.css`. Se o valor não existe, proponha um token novo em `DESIGN_SYSTEM.md` — não use hex solto no JSX.
2. **Nunca introduza dependências novas** sem justificativa registrada. O site é intencionalmente enxuto (React + Vite + Tailwind + Supabase opcional).
3. **Nunca remova acessibilidade:** `:focus-visible`, `prefers-reduced-motion`, `alt`, `aria-label`. Isso é baseline, não opcional.
4. **Nunca reintroduza credenciais no código.** O fallback de senha fixa foi removido de propósito (`src/store/store.tsx`). Sem Supabase configurado, o login do admin falha — comportamento correto.
5. **Nunca enfraqueça os headers de segurança** em `vercel.json`/`netlify.toml` (CSP, HSTS, COOP, Permissions-Policy). Se a CSP quebrar algo, ajuste a diretiva mínima necessária e registre em `SECURITY.md`.
6. **Nunca commite** `.env.local`, tokens ou chaves.

## 2. Tom e conteúdo

- Idioma do site: **português (pt-BR)**, tom caloroso e sóbrio.
- Sem emojis na interface. Sem linguagem de urgência ("ÚLTIMAS UNIDADES!", contadores).
- Títulos curtos em serif; corpo direto em sans.

## 3. Padrões de código

- TypeScript estrito; componentes funcionais; Tailwind com classes dos tokens.
- Rotas via HashRouter (`src/App.tsx`) — não trocar por BrowserRouter (o build é single-file).
- Dados: Supabase quando configurado, fallback para seed local (`src/data/seed.ts`). Manter os dois caminhos funcionando.
- Build: `npm run build` deve passar sem erros antes de qualquer commit.

## 4. Checklist antes de entregar qualquer mudança

- [ ] `npm run build` passa.
- [ ] Nenhum hex/duração fora dos tokens.
- [ ] Estados hover/focus/active/disabled presentes em elementos novos.
- [ ] `rg -n "password|secret|api_key" src/` não revela credencial nova.
- [ ] Mudança visual verificada em mobile (375px) e desktop (1280px).
- [ ] `QA_CHECKLIST.md` consultado para o tipo de mudança feita.
