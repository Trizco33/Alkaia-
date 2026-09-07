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
- [ ] **Produto** — galeria, descrição, stepper de quantidade, "Adicionar ao carrinho" e "Comprar agora"; estado esgotado quando estoque = 0.
- [ ] **Sobre / Contato** — formulário envia (ou falha com mensagem clara).
- [ ] **Admin** — login via Supabase funciona; sem Supabase, login recusa com erro claro (não loga silenciosamente).
- [ ] Drawer mobile abre/fecha suave, logo visível, links navegam.

## 3b. Loja (carrinho + checkout)

- [ ] Badge do carrinho no header atualiza ao adicionar/remover itens (todas as telas).
- [ ] **Carrinho** — alterar quantidade, remover item, subtotal correto; carrinho persiste após recarregar a página (localStorage).
- [ ] **Checkout** — ViaCEP preenche endereço; cotação de frete aparece (PAC/SEDEX); retirada local = frete grátis; validação impede envio com campos vazios.
- [ ] Sem functions/secrets configuradas: checkout mostra aviso de manutenção (não quebra).
- [ ] **Confirmação** — `/#/pedido/confirmacao?order=...` renderiza com o número do pedido.
- [ ] `/#/onde-comprar` redireciona para `/#/velas`.
- [ ] Nenhuma menção a Shopee/Mercado Livre/compra por WhatsApp fora de Contato e Encomendas.
- [ ] **Admin → Vendas** — pedidos listam; status e código de rastreio salvam.
- [ ] Fluxo real (com secrets): pedido criado → redirect ao Mercado Pago → pagamento de teste → webhook atualiza status → estoque baixa uma única vez.

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

## 7. CMS (aba "Site")

- [ ] Páginas públicas idênticas aos padrões quando `site_content.data = {}`.
- [ ] Editar um texto na aba Site → salvar → aparece no site após recarregar.
- [ ] "Enviar foto" funciona (webp no bucket `site-images`, preview atualiza).
- [ ] Anon não consegue escrever em `site_content` nem no bucket (curl com anon key).
