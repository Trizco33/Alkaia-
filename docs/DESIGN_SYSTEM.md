# ALKAIA — Living Design System
**Direção artística: "Ateliê de Luz" · v1.0 · Setembro/2026**

Este é o documento-mestre visual da ALKAIA. Toda mudança de interface — humana ou feita por IA — deve consultar este arquivo antes e respeitá-lo. Nenhum valor de cor, fonte, espaçamento ou animação pode ser inventado fora daqui.

---

## 1. DNA da marca

A ALKAIA é uma marca de velas artesanais de Artur Nogueira — SP. O site deve transmitir:

- **Calma e calor** — como a luz de uma vela acesa no fim de tarde.
- **Artesanal com precisão** — feito à mão, mas nunca amador.
- **Sofisticação silenciosa** — inspiração Aesop: pouco ornamento, muito cuidado.

**O que a ALKAIA NÃO é:** colorida demais, infantil, "promocional" (sem banners piscando, contadores de urgência ou pop-ups agressivos), nem fria/corporativa.

---

## 2. Design Tokens

Fonte da verdade: `src/index.css` (bloco `@theme`). Os nomes abaixo são classes Tailwind (`bg-cream`, `text-terra`, etc).

### 2.1 Cores

| Token | Hex | Papel |
|---|---|---|
| `cream` | `#F8F2EA` | Background principal |
| `cream-2` | `#F2EAE0` | Background alternado de seções |
| `linen` | `#EFE6D9` | Surface suave (hover, chips) |
| `sand` | `#E5D7C2` | Surface média, bordas visíveis |
| `dune` | `#D3BE9F` | Detalhes, ornamentos |
| `clay` | `#C08A6D` | Accent secundário |
| `terra` | `#A8634A` | **PRIMARY** — marca, CTAs, links ativos |
| `terra-dark` | `#844936` | Primary em hover/pressed |
| `ink` | `#2A221B` | Texto principal |
| `ink-soft` | `#6D5D4F` | Texto secundário / muted |
| `olive` | `#6D7155` | Accent botânico |
| `gold` | `#B8905E` | Detalhe premium (usar com muita moderação) |
| `ghost` | `#FBF8F3` | Surface elevada (cards, dropdowns) |

**Feedback:** `success #5F7350` · `warning #B8905E` · `error #9C4430`.

Regras:
- Texto principal sempre `ink` sobre `cream`/`ghost` (contraste AA garantido).
- `terra` é a única cor de ação. Nunca usar duas cores de CTA na mesma tela.
- `gold` nunca em áreas grandes — apenas filetes, ícones pequenos, detalhes.

### 2.2 Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display / títulos | **Cormorant Garamond** (serif) | `h1–h4`, números de destaque |
| Corpo / UI | **Inter** (sans) | Parágrafos, botões, formulários, navegação |

- Títulos com `font-weight: 500` (nunca bold pesado — perde a elegância).
- Eyebrows/labels: classe `.eyebrow` (11px, uppercase, tracking 0.28em).
- Nunca introduzir uma terceira família tipográfica.

### 2.3 Espaçamento e layout

- Container padrão: `.shell` (max-w-6xl) · texto longo: `.shell-narrow` (max-w-3xl).
- Ritmo vertical de seções: generoso — respiro é parte da identidade.
- Divisores: `.hairline` (1px, `ink/10`). Nunca bordas grossas.

### 2.4 Sombras

- `shadow-veil` — elevação forte (modais, imagens hero).
- `shadow-whisper` — elevação sutil (cards).
- Nunca sombras duras/escuras; a luz da ALKAIA é difusa.

### 2.5 Logo

- Arquivos: `public/brand/logo-terracota.png` (800px) e `logo-terracota-sm.png` (320px).
- Cor oficial da logo: terracota `#A8634A` sobre fundos claros.
- Header e drawer usam a versão `-sm`; footer usa a versão grande.
- Não recolorir, distorcer, nem aplicar sobre fundo escuro sem aprovação.

---

## 3. Componentes

| Componente | Classe / arquivo | Notas |
|---|---|---|
| Botão primário | `.btn-primary` | Fundo `ink`, hover `terra-dark`. Cantos retos. |
| Botão outline | `.btn-outline` | Borda `ink/25`, hover preenche `ink`. |
| Botão claro | `.btn-light` | Para uso sobre fundos escuros/fotos. |
| Header + drawer | `src/components/Layout.tsx` | Drawer mobile desliza da direita, 380ms. |
| Reveal on scroll | `.reveal-hidden` → `.reveal-shown` | Fade-up 24px, categoria *long*. |

**Estados obrigatórios em todo elemento interativo:** default, hover, active/pressed, focus-visible (outline terra 2px, offset 3px), disabled (opacity 50 + cursor bloqueado).

---

## 4. Motion System

Tokens em `src/index.css`: easing único `--ease-alkaia` `cubic-bezier(0.22, 0.61, 0.36, 1)`.

| Categoria | Duração | Uso |
|---|---|---|
| micro | 150ms | Hovers, toggles |
| short | 300ms | Botões, dropdowns, chips |
| medium | 600ms | Transições de seção, imagens |
| long | 900ms | Reveals de entrada, hero |

Princípios:
- Movimento sempre suave e discreto — nada "quica", nada gira.
- Animações decorativas existentes: `flicker` (chama de vela), `float` (flutuação lenta).
- **`prefers-reduced-motion` é respeitado globalmente** (definido no `@layer base`). Nunca remover.

---

## 5. Acessibilidade (baseline não-negociável)

- Foco visível global via `:focus-visible` — nunca `outline: none` sem substituto.
- Toda imagem com `alt` significativo; imagens decorativas com `alt=""`.
- Alvos de toque ≥ 40px no mobile.
- Contraste mínimo AA (texto `ink`/`ink-soft` sobre superfícies claras já cumpre).
- Botões de ícone com `aria-label` (padrão já usado no Layout).

---

## 6. Fotografia e imagem

- Luz natural, tons quentes, superfícies texturizadas (linho, cerâmica, madeira clara).
- Nada de fundos brancos puros de e-commerce genérico.
- Fotos externas (Pexels) permitidas pela CSP (`img-src https:`), mas priorizar fotos próprias do produto.

---

## 7. Como evoluir este sistema

1. Proponha o novo token/componente **aqui primeiro**, depois implemente em `src/index.css`.
2. Nunca duplique valores: se um hex/duração aparece 2×, vira token.
3. Registre decisões relevantes na seção de histórico abaixo.

### Histórico de decisões
- **2026-09** · v1.0 — Direção "Ateliê de Luz" escolhida entre 3 mockups. Logo oficial recolorida para terracota. Tokens de motion, feedback e sombras formalizados. Fallback de senha local removido (ver `SECURITY.md`).
