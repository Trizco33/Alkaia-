# ALKAIA — QA Checklist
**Rodar antes de qualquer deploy. Marcar apenas o que foi verificado de verdade.**

---

## 1. Build e código

- [ ] `npm run build` passa sem erros nem warnings novos.
- [ ] Nenhum valor visual solto (hex, ms, px de sombra) fora dos tokens de `src/index.css`.
- [ ] `rg -n "alkaia2026|adminPassword|service_role" src/` → zero resultados.
- [ ] `.env.local` não está no commit (`git status`).

## 2. Design (conferir contra `DESIGN_SYSTEM.md`)

- [ ] Logo terracota aparece no header, no drawer mobile e no footer.
- [ ] Só existe uma cor de CTA (`terra`) por tela.
- [ ] Títulos em Cormorant Garamond, corpo em Inter — nenhuma fonte nova.
- [ ] Elementos interativos têm hover, active, focus-visible e disabled.
- [ ] Animações usam as categorias do motion system (150/300/600/900ms, easing `--ease-alkaia`).

## 3. Páginas (desktop 1280px e mobile 375px)

- [ ] **Home** — hero, seções com reveal, CTAs funcionando.
- [ ] **Catálogo** — grid de produtos, filtros, imagens carregando.
- [ ] **Produto** — galeria, descrição, botão de pedido.
- [ ] **Sobre / Contato** — formulário envia (ou falha com mensagem clara).
- [ ] **Admin** — login via Supabase funciona; sem Supabase, login recusa com erro claro (não loga silenciosamente).
- [ ] Drawer mobile abre/fecha suave, logo visível, links navegam.

## 4. Acessibilidade

- [ ] Navegação completa por teclado (Tab percorre tudo, foco sempre visível).
- [ ] Imagens com `alt`; botões de ícone com `aria-label`.
- [ ] Zoom de 200% não quebra o layout.
- [ ] Com `prefers-reduced-motion`, os reveals aparecem sem animação.

## 5. Segurança (conferir contra `SECURITY.md`)

- [ ] Headers presentes em produção: `curl -sI https://SITE | grep -i "strict-transport\|content-security"`.
- [ ] Console do navegador sem erros de CSP nas páginas principais.
- [ ] Formulários de visitante funcionam (insert-only no Supabase).
- [ ] Painel admin inacessível sem login.
- [ ] Pendência crítica da seção 2 do `SECURITY.md` resolvida? (signup público + `security-upgrade.sql`)

## 6. Pós-deploy

- [ ] Site abre na URL de produção; navegação entre rotas ok (HashRouter).
- [ ] Imagens externas (Pexels) carregam.
- [ ] Teste real em um celular físico, se possível.
