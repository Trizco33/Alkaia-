/* =====================================================================
   Conteúdo editável do site (textos e imagens)
   - `contentDefaults`: valores padrão (o site nunca fica em branco)
   - `contentSchema`: define os campos exibidos no painel admin
   - Os valores salvos no Supabase (tabela site_content) sobrescrevem
     os padrões; chaves ausentes caem no padrão.
   ===================================================================== */

export type ContentKind = "text" | "long" | "image";

export interface ContentField {
  key: string;
  label: string;
  kind: ContentKind;
  hint?: string;
}

export interface ContentGroup {
  title: string;
  description?: string;
  fields: ContentField[];
}

export const contentDefaults: Record<string, string> = {
  /* ---------- Topo do site ---------- */
  "band.text": "Velas artesanais · Artur Nogueira — SP",

  /* ---------- Página inicial: herói ---------- */
  "home.hero.eyebrow": "Experiências sensoriais · Artur Nogueira — SP",
  "home.hero.title": "Transforme momentos em rituais.",
  "home.hero.btnPrimary": "Conhecer as coleções",
  "home.hero.btnSecondary": "Comprar velas",
  "home.hero.image": "https://images.pexels.com/photos/12731723/pexels-photo-12731723.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600",

  /* ---------- Página inicial: frase de efeito ---------- */
  "home.quote": "“Uma luz acesa. Um aroma no ambiente. Alguns minutos de pausa.”",

  /* ---------- Página inicial: Conheça a Alkaia ---------- */
  "home.about.eyebrow": "Conheça a Alkaia",
  "home.about.title": "Mais do que uma vela.",
  "home.about.text":
    "A Alkaia nasceu do desejo de transformar o simples ato de acender uma vela em uma experiência. Cada aroma, cada detalhe e cada coleção são pensados para despertar sensações, criar atmosferas e acompanhar momentos de pausa, cuidado e presença.",
  "home.about.bullet1": "Criação artesanal em pequenos lotes",
  "home.about.bullet2": "Cera vegetal e óleos essenciais",
  "home.about.bullet3": "Design e embalagens autorais",
  "home.about.btn": "Conheça a Alkaia",
  "home.about.image": "https://images.pexels.com/photos/12486420/pexels-photo-12486420.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  "home.about.imageSmall": "https://images.pexels.com/photos/7004680/pexels-photo-7004680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",

  /* ---------- Página inicial: seções ---------- */
  "home.collections.eyebrow": "Nossas coleções",
  "home.collections.title": "Universos sensoriais",
  "home.collections.text": "Cada coleção carrega uma intenção: uma atmosfera, uma emoção, um momento.",
  "home.featured.eyebrow": "Produtos em destaque",
  "home.featured.title": "Para a sua próxima pausa",
  "home.featured.text": "Uma seleção de velas e rituais criados com cuidado para acompanhar o seu momento.",
  "home.featured.btn": "Ver todos os produtos",

  /* ---------- Página inicial: experiência ---------- */
  "home.exp.title": "Acenda. Respire. Permaneça.",
  "home.exp.text": "Alguns momentos pedem apenas uma pausa.",
  "home.exp.btn": "Descubra seu ritual",
  "home.exp.image": "https://images.pexels.com/photos/2019814/pexels-photo-2019814.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600",

  /* ---------- Página inicial: bandeiras ---------- */
  "home.flag1.title": "Feito à mão",
  "home.flag1.text": "Pequenos lotes",
  "home.flag2.title": "Óleos essenciais",
  "home.flag2.text": "Aromas autorais",
  "home.flag3.title": "Cera vegetal",
  "home.flag3.text": "Cuidado natural",
  "home.flag4.title": "Envio para todo o Brasil",
  "home.flag4.text": "Ou retirada local",

  /* ---------- Sobre a Alkaia ---------- */
  "sobre.hero.eyebrow": "Sobre a Alkaia",
  "sobre.hero.title": "Pequenos momentos. Grandes significados.",
  "sobre.hero.lead": "Acreditamos que pequenos momentos podem carregar grandes significados.",
  "sobre.hero.lines": "Uma luz acesa.\nUm aroma no ambiente.\nAlguns minutos de pausa.",
  "sobre.hero.closing": "A Alkaia nasce para acompanhar esses momentos.",
  "sobre.hero.image": "https://images.pexels.com/photos/12486419/pexels-photo-12486419.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  "sobre.essence.eyebrow": "Nossa essência",
  "sobre.essence.title": "Uma marca para estar presente.",
  "sobre.essence.p1":
    "Não fazemos apenas velas. Criamos atmosferas, memórias e pequenos rituais de cuidado. A Alkaia é feita à mão, com intenção, para acompanhar os seus momentos de pausa — seja no fim do dia, num banho demorado, numa massagem ou naquela noite especial.",
  "sobre.essence.p2": "Cada coleção é um universo. Cada aroma, uma sensação. E cada chama, um convite para respirar.",
  "sobre.essence.image1": "https://images.pexels.com/photos/6755794/pexels-photo-6755794.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  "sobre.essence.image2": "https://images.pexels.com/photos/27273230/pexels-photo-27273230.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  "sobre.pillars.eyebrow": "O que nos move",
  "sobre.pillars.title": "Cuidado em cada detalhe",
  "sobre.pillars.text": "Quatro pilares sustentam tudo o que criamos.",
  "sobre.pillar1.title": "Origem",
  "sobre.pillar1.text": "A Alkaia nasceu de um desejo simples: transformar o ato de acender uma vela em uma pausa real, que devolve a gente para si.",
  "sobre.pillar2.title": "Processo artesanal",
  "sobre.pillar2.text": "Cada vela é criada em pequenos lotes, com cera vegetal e óleos essenciais escolhidos com calma — sem pressa, como um bom ritual.",
  "sobre.pillar3.title": "Criação das coleções",
  "sobre.pillar3.text": "Cada coleção nasce de uma atmosfera ou de uma emoção. Do floral ao amadeirado, os aromas são desenhados para contar uma história.",
  "sobre.pillar4.title": "Cuidado com os detalhes",
  "sobre.pillar4.text": "Da cera ao pavio, do rótulo à embalagem, tudo é pensado para tornar o seu momento mais bonito, delicado e especial.",
  "sobre.card1.title": "Feito à mão, com intenção.",
  "sobre.card1.text": "Cada lote é produzido artesanalmente.",
  "sobre.card1.image": "https://images.pexels.com/photos/5933694/pexels-photo-5933694.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  "sobre.card2.title": "Rituais de autocuidado.",
  "sobre.card2.text": "Para perfumar, cuidar e transformar momentos.",
  "sobre.card2.image": "https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",

  /* ---------- Velas Aromáticas ---------- */
  "velas.header.eyebrow": "Velas Aromáticas",
  "velas.header.title": "Aroma que transforma o ambiente",
  "velas.header.text": "Velas feitas à mão, com cera vegetal e óleos essenciais, para perfumar espaços e criar atmosferas memoráveis.",
  "velas.card1.title": "Velas de Massagem",
  "velas.card1.text": "Rituais de cuidado para o corpo.",
  "velas.card1.image": "https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  "velas.card2.title": "Kits e Presentes",
  "velas.card2.text": "Para embalar um gesto de carinho.",
  "velas.card2.image": "https://images.pexels.com/photos/6805524/pexels-photo-6805524.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",

  /* ---------- Velas de Massagem ---------- */
  "massagem.hero.eyebrow": "Spa · Autocuidado · Ritual",
  "massagem.hero.title": "O cuidado em forma de ritual.",
  "massagem.hero.text":
    "Velas de massagem que derretem em um óleo morno e perfumado, transformando o simples gesto do cuidado em uma experiência sensorial para o corpo e para a mente.",
  "massagem.hero.image": "https://images.pexels.com/photos/1926811/pexels-photo-1926811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  "massagem.how.eyebrow": "Como funciona",
  "massagem.how.title": "Do fogo ao toque",
  "massagem.how.text": "Uma pequena pausa basta para transformar a vela em um óleo de massagem morno e perfumado.",
  "massagem.step1.title": "Acenda",
  "massagem.step1.text": "Acenda a vela por alguns minutos até derreter uma camada de óleo na superfície.",
  "massagem.step2.title": "Apague e amorne",
  "massagem.step2.text": "Apague a chama e aguarde a temperatura ficar confortável para a pele.",
  "massagem.step3.title": "Massageie",
  "massagem.step3.text": "Aplique o óleo morno com movimentos suaves e deixe o aroma cuidar de você.",
  "massagem.flagship.image": "https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",

  /* ---------- Kits e Presentes ---------- */
  "kits.header.eyebrow": "Kits e Presentes",
  "kits.header.title": "Um gesto de carinho, embalado com cuidado",
  "kits.header.text": "Montamos composições autorais para presentear — ou para se presentear — com aroma, luz e pausa.",
  "kits.body.title": "Presenteie um ritual.",
  "kits.body.text":
    "Kits para datas especiais, lembranças de eventos, brindes corporativos e para quem você quer bem. Conte para a gente o momento e criamos a composição perfeita.",
  "kits.body.bullet1": "Kits para datas comemorativas",
  "kits.body.bullet2": "Lembranças e brindes de eventos",
  "kits.body.bullet3": "Presentes corporativos",
  "kits.body.bullet4": "Composições para spas e profissionais",
  "kits.body.btn": "Solicitar um kit",
  "kits.body.image": "https://images.pexels.com/photos/15683359/pexels-photo-15683359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
};

export const contentSchema: ContentGroup[] = [
  {
    title: "Topo do site",
    description: "Faixa escura exibida acima do menu, em todas as páginas.",
    fields: [{ key: "band.text", label: "Texto da faixa do topo", kind: "text" }],
  },
  {
    title: "Início — Destaque principal",
    description: "Primeira imagem e frases que aparecem ao abrir o site.",
    fields: [
      { key: "home.hero.image", label: "Foto principal (grande)", kind: "image" },
      { key: "home.hero.eyebrow", label: "Frase pequena acima do título", kind: "text" },
      { key: "home.hero.title", label: "Título principal", kind: "text" },
      { key: "home.hero.btnPrimary", label: "Texto do botão claro", kind: "text" },
      { key: "home.hero.btnSecondary", label: "Texto do botão com borda", kind: "text" },
      { key: "home.quote", label: "Frase de efeito (faixa abaixo da foto)", kind: "long" },
    ],
  },
  {
    title: "Início — Conheça a Alkaia",
    fields: [
      { key: "home.about.eyebrow", label: "Frase pequena", kind: "text" },
      { key: "home.about.title", label: "Título", kind: "text" },
      { key: "home.about.text", label: "Texto", kind: "long" },
      { key: "home.about.bullet1", label: "Item 1 da lista", kind: "text" },
      { key: "home.about.bullet2", label: "Item 2 da lista", kind: "text" },
      { key: "home.about.bullet3", label: "Item 3 da lista", kind: "text" },
      { key: "home.about.btn", label: "Texto do botão", kind: "text" },
      { key: "home.about.image", label: "Foto grande", kind: "image" },
      { key: "home.about.imageSmall", label: "Foto pequena (sobreposta)", kind: "image" },
    ],
  },
  {
    title: "Início — Seções de produtos",
    fields: [
      { key: "home.collections.eyebrow", label: "Coleções: frase pequena", kind: "text" },
      { key: "home.collections.title", label: "Coleções: título", kind: "text" },
      { key: "home.collections.text", label: "Coleções: texto", kind: "long" },
      { key: "home.featured.eyebrow", label: "Destaques: frase pequena", kind: "text" },
      { key: "home.featured.title", label: "Destaques: título", kind: "text" },
      { key: "home.featured.text", label: "Destaques: texto", kind: "long" },
      { key: "home.featured.btn", label: "Destaques: texto do botão", kind: "text" },
    ],
  },
  {
    title: "Início — Acenda. Respire. Permaneça.",
    description: "Seção com foto de fundo escura, perto do fim da página.",
    fields: [
      { key: "home.exp.image", label: "Foto de fundo", kind: "image" },
      { key: "home.exp.title", label: "Título", kind: "text" },
      { key: "home.exp.text", label: "Frase em itálico", kind: "text" },
      { key: "home.exp.btn", label: "Texto do botão", kind: "text" },
    ],
  },
  {
    title: "Início — Selos (rodapé da página)",
    fields: [
      { key: "home.flag1.title", label: "Selo 1: título", kind: "text" },
      { key: "home.flag1.text", label: "Selo 1: texto", kind: "text" },
      { key: "home.flag2.title", label: "Selo 2: título", kind: "text" },
      { key: "home.flag2.text", label: "Selo 2: texto", kind: "text" },
      { key: "home.flag3.title", label: "Selo 3: título", kind: "text" },
      { key: "home.flag3.text", label: "Selo 3: texto", kind: "text" },
      { key: "home.flag4.title", label: "Selo 4: título", kind: "text" },
      { key: "home.flag4.text", label: "Selo 4: texto", kind: "text" },
    ],
  },
  {
    title: "Sobre a Alkaia",
    fields: [
      { key: "sobre.hero.image", label: "Foto do topo", kind: "image" },
      { key: "sobre.hero.eyebrow", label: "Frase pequena", kind: "text" },
      { key: "sobre.hero.title", label: "Título", kind: "text" },
      { key: "sobre.hero.lead", label: "Frase em itálico", kind: "long" },
      { key: "sobre.hero.lines", label: "Linhas curtas (uma por linha)", kind: "long" },
      { key: "sobre.hero.closing", label: "Frase de fechamento", kind: "text" },
      { key: "sobre.essence.eyebrow", label: "Essência: frase pequena", kind: "text" },
      { key: "sobre.essence.title", label: "Essência: título", kind: "text" },
      { key: "sobre.essence.p1", label: "Essência: parágrafo 1", kind: "long" },
      { key: "sobre.essence.p2", label: "Essência: parágrafo 2", kind: "long" },
      { key: "sobre.essence.image1", label: "Essência: foto 1", kind: "image" },
      { key: "sobre.essence.image2", label: "Essência: foto 2", kind: "image" },
    ],
  },
  {
    title: "Sobre — Pilares e cartões",
    fields: [
      { key: "sobre.pillars.eyebrow", label: "Frase pequena", kind: "text" },
      { key: "sobre.pillars.title", label: "Título", kind: "text" },
      { key: "sobre.pillars.text", label: "Texto", kind: "text" },
      { key: "sobre.pillar1.title", label: "Pilar 1: título", kind: "text" },
      { key: "sobre.pillar1.text", label: "Pilar 1: texto", kind: "long" },
      { key: "sobre.pillar2.title", label: "Pilar 2: título", kind: "text" },
      { key: "sobre.pillar2.text", label: "Pilar 2: texto", kind: "long" },
      { key: "sobre.pillar3.title", label: "Pilar 3: título", kind: "text" },
      { key: "sobre.pillar3.text", label: "Pilar 3: texto", kind: "long" },
      { key: "sobre.pillar4.title", label: "Pilar 4: título", kind: "text" },
      { key: "sobre.pillar4.text", label: "Pilar 4: texto", kind: "long" },
      { key: "sobre.card1.image", label: "Cartão 1: foto", kind: "image" },
      { key: "sobre.card1.title", label: "Cartão 1: título", kind: "text" },
      { key: "sobre.card1.text", label: "Cartão 1: texto", kind: "text" },
      { key: "sobre.card2.image", label: "Cartão 2: foto", kind: "image" },
      { key: "sobre.card2.title", label: "Cartão 2: título", kind: "text" },
      { key: "sobre.card2.text", label: "Cartão 2: texto", kind: "text" },
    ],
  },
  {
    title: "Página Velas Aromáticas",
    fields: [
      { key: "velas.header.eyebrow", label: "Frase pequena", kind: "text" },
      { key: "velas.header.title", label: "Título", kind: "text" },
      { key: "velas.header.text", label: "Texto", kind: "long" },
      { key: "velas.card1.image", label: "Cartão Massagem: foto", kind: "image" },
      { key: "velas.card1.title", label: "Cartão Massagem: título", kind: "text" },
      { key: "velas.card1.text", label: "Cartão Massagem: texto", kind: "text" },
      { key: "velas.card2.image", label: "Cartão Kits: foto", kind: "image" },
      { key: "velas.card2.title", label: "Cartão Kits: título", kind: "text" },
      { key: "velas.card2.text", label: "Cartão Kits: texto", kind: "text" },
    ],
  },
  {
    title: "Página Velas de Massagem",
    fields: [
      { key: "massagem.hero.image", label: "Foto do topo", kind: "image" },
      { key: "massagem.hero.eyebrow", label: "Frase pequena", kind: "text" },
      { key: "massagem.hero.title", label: "Título", kind: "text" },
      { key: "massagem.hero.text", label: "Texto", kind: "long" },
      { key: "massagem.how.eyebrow", label: "Como funciona: frase pequena", kind: "text" },
      { key: "massagem.how.title", label: "Como funciona: título", kind: "text" },
      { key: "massagem.how.text", label: "Como funciona: texto", kind: "long" },
      { key: "massagem.step1.title", label: "Passo 1: título", kind: "text" },
      { key: "massagem.step1.text", label: "Passo 1: texto", kind: "long" },
      { key: "massagem.step2.title", label: "Passo 2: título", kind: "text" },
      { key: "massagem.step2.text", label: "Passo 2: texto", kind: "long" },
      { key: "massagem.step3.title", label: "Passo 3: título", kind: "text" },
      { key: "massagem.step3.text", label: "Passo 3: texto", kind: "long" },
      { key: "massagem.flagship.image", label: "Foto do Ritual dos Pés", kind: "image" },
    ],
  },
  {
    title: "Página Kits e Presentes",
    fields: [
      { key: "kits.header.eyebrow", label: "Frase pequena", kind: "text" },
      { key: "kits.header.title", label: "Título", kind: "text" },
      { key: "kits.header.text", label: "Texto", kind: "long" },
      { key: "kits.body.image", label: "Foto", kind: "image" },
      { key: "kits.body.title", label: "Título da seção", kind: "text" },
      { key: "kits.body.text", label: "Texto", kind: "long" },
      { key: "kits.body.bullet1", label: "Item 1 da lista", kind: "text" },
      { key: "kits.body.bullet2", label: "Item 2 da lista", kind: "text" },
      { key: "kits.body.bullet3", label: "Item 3 da lista", kind: "text" },
      { key: "kits.body.bullet4", label: "Item 4 da lista", kind: "text" },
      { key: "kits.body.btn", label: "Texto do botão", kind: "text" },
    ],
  },
];

/** Junta os padrões com o que foi salvo no banco (banco vence). */
export function mergeContent(saved: unknown): Record<string, string> {
  const out: Record<string, string> = { ...contentDefaults };
  if (saved && typeof saved === "object") {
    for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
      if (typeof v === "string" && k in contentDefaults) out[k] = v;
    }
  }
  return out;
}

/** Mantém no banco apenas o que difere do padrão. */
export function diffContent(current: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(current)) {
    if (k in contentDefaults && contentDefaults[k] !== v) out[k] = v;
  }
  return out;
}
