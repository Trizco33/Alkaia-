/* ============================================================
   ALKAIA — Modelos de dados e conteúdo inicial (seed)
   Estrutura escalável preparada para evoluir para e-commerce.
   ============================================================ */

export type ProductStatus = "active" | "inactive";

export interface ProductVariant {
  id: string;
  label: string; // ex: "Essencial"
  weight: string; // ex: "40g"
  price: number;
  salePrice?: number | null;
  stock: number;
  burnTime?: string;
  image?: string;
  status: ProductStatus;
}

export interface Channels {
  site: boolean;
  shopee: boolean;
  mercadolivre: boolean;
  whatsapp: boolean;
}

export interface ProductLinks {
  site?: string;
  shopee?: string;
  mercadolivre?: string;
  whatsapp?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  images: string[];
  olfactoryProfile: string;
  aromaticNotes: string[];
  weight: string;
  burnTime?: string;
  ingredients: string;
  instructions: string;
  care: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  availableForDelivery: boolean;
  availableForPickup: boolean;
  channels: Channels;
  links: ProductLinks;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  editorial: string;
  ritual?: "ritual" | "fluxo";
  subCollection?: { name: string; profile: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface SpecialOrder {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  type: string;
  quantity: string;
  interest: string;
  date: string;
  message: string;
  status: "nova" | "em_andamento" | "concluida";
  createdAt: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
}

export interface DeliveryRegion {
  id: string;
  name: string;
  type: "retirada" | "entrega" | "envio";
  note: string;
}

export interface Settings {
  brandName: string;
  message: string;
  subtitle: string;
  email: string;
  whatsapp: string; // ex "5511999999999"
  whatsappDisplay: string;
  instagram: string;
  tiktok: string;
  shopee: string;
  mercadolivre: string;
  city: string;
  adminEmail: string;
  adminPassword: string;
}

/* ---------------- Imagens placeholder (até fotos reais) ---------------- */
const IMG = {
  hero: "https://images.pexels.com/photos/12731723/pexels-photo-12731723.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600",
  heroAlt: "https://images.pexels.com/photos/2019814/pexels-photo-2019814.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600",
  cand1: "https://images.pexels.com/photos/7260252/pexels-photo-7260252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  cand2: "https://images.pexels.com/photos/7671141/pexels-photo-7671141.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  cand3: "https://images.pexels.com/photos/7004680/pexels-photo-7004680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  cand4: "https://images.pexels.com/photos/11137699/pexels-photo-11137699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  cand5: "https://images.pexels.com/photos/15683359/pexels-photo-15683359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  cand6: "https://images.pexels.com/photos/20390718/pexels-photo-20390718.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  spa1: "https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  spa2: "https://images.pexels.com/photos/1926811/pexels-photo-1926811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  spa3: "https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  make1: "https://images.pexels.com/photos/5933694/pexels-photo-5933694.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  make2: "https://images.pexels.com/photos/6755794/pexels-photo-6755794.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  make3: "https://images.pexels.com/photos/8272376/pexels-photo-8272376.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  linen1: "https://images.pexels.com/photos/12486420/pexels-photo-12486420.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  linen2: "https://images.pexels.com/photos/12486419/pexels-photo-12486419.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  linen3: "https://images.pexels.com/photos/6805524/pexels-photo-6805524.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
  dried: "https://images.pexels.com/photos/27273230/pexels-photo-27273230.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720",
};

export const IMAGES = IMG;

export const seedCategories: Category[] = [
  { id: "cat-aromaticas", name: "Velas Aromáticas", slug: "velas-aromaticas", description: "Velas que perfumam ambientes e criam atmosferas." },
  { id: "cat-massagem", name: "Velas de Massagem", slug: "velas-de-massagem", description: "Velas que derretem em óleo de massagem." },
  { id: "cat-kits", name: "Kits e Presentes", slug: "kits-e-presentes", description: "Composições prontas para presentear." },
];

export const seedCollections: Collection[] = [
  {
    id: "col-floralis",
    name: "Floralis",
    slug: "floralis",
    tagline: "A atmosfera das flores",
    description: "Uma coleção sensorial inspirada nas flores, suas atmosferas e nas emoções que despertam.",
    image: IMG.cand1,
    editorial:
      "Cada flor carrega uma memória — o cheiro de um quintal, de um jardim na chuva, de uma tarde que quisemos guardar. Floralis nasce dessa memória íntima, traduzindo em cera e aroma aquilo que as flores despertam em nós.",
    subCollection: [
      { name: "Florais", profile: "Floral · Envolvente" },
      { name: "Herbais", profile: "Herbal · Fresco" },
      { name: "Amadeirados", profile: "Amadeirado · Sofisticado" },
    ],
  },
  {
    id: "col-rituais",
    name: "Rituais",
    slug: "rituais",
    tagline: "Cuidado, presença e relaxamento",
    description: "Experiências criadas para momentos de cuidado, relaxamento e presença.",
    image: IMG.spa1,
    editorial:
      "Rituais é uma linha pensada para o corpo e para a pausa. Velas de massagem e composições que transformam gestos simples — um banho, uma massagem, um instante de silêncio — em cuidado de verdade.",
    ritual: "ritual",
    subCollection: [
      { name: "Ritual dos Pés", profile: "Fresco / Herbal / Relaxante" },
      { name: "Ritual do Descanso", profile: "Floral / Suave / Aconchegante" },
      { name: "Ritual da Energia", profile: "Cítrico / Vibrante / Revigorante" },
      { name: "Ritual Branco", profile: "Limpo / Elegante / Sofisticado" },
    ],
  },
  {
    id: "col-especiais",
    name: "Edições Especiais",
    slug: "edicoes-especiais",
    tagline: "Lançamentos limitados e sazonais",
    description: "Estrutura para lançamentos limitados, sazonais e colaborações.",
    image: IMG.cand5,
    editorial:
      "Alguns aromas pertencem a um momento. As Edições Especiais celebram estações, datas e encontros — tiragens pequenas, criadas com cuidado e com um tempo próprio para existir.",
    ritual: "fluxo",
    subCollection: [
      { name: "Inverno", profile: "Amadeirado · Especiado" },
      { name: "Primavera", profile: "Floral · Fresco" },
      { name: "Presentes", profile: "Colecionáveis" },
    ],
  },
];

const now = Date.now();

export const seedProducts: Product[] = [
  {
    id: "p-flor-laranjeira",
    name: "Flor de Laranjeira",
    slug: "flor-de-laranjeira",
    collectionId: "col-floralis",
    categoryId: "cat-aromaticas",
    shortDescription: "Um mergulho na flor de laranjeira: luminosa, quente e levemente cítrica.",
    description:
      "Flor de Laranjeira é uma vela aromática para trazer luz e memória ao ambiente. Criada com cera vegetal e óleos essenciais, evoca o perfume delicado das laranjeiras em flor e transforma o espaço em um convite à pausa.",
    images: [IMG.cand1, IMG.cand4, IMG.cand3],
    olfactoryProfile: "Floral / Cítrico / Envolvente",
    aromaticNotes: ["Bergamota", "Néroli", "Flor de laranjeira", "Madeira clara"],
    weight: "120g",
    burnTime: "Aproximadamente 25 horas",
    ingredients: "Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.",
    instructions:
      "Acenda o pavio e deixe a camada superior derreter por completo na primeira queima. Nunca deixe a vela acesa por mais de 4h seguidas. Aproxime o pavio antes de apagar.",
    care: "Mantenha fora do alcance de crianças e animais. Nunca deixe a vela acesa sem supervisão. Evite contato direto com a cera derretida.",
    price: 89,
    salePrice: 69,
    stock: 18,
    status: "active",
    featured: true,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/flor-de-laranjeira", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    seoTitle: "Vela aromática Flor de Laranjeira — ALKAIA",
    seoDescription: "Vela aromática artesanal com nota de flor de laranjeira, bergamota e néroli. Perfuma ambientes com elegância.",
    createdAt: now - 400000,
    updatedAt: now,
  },
  {
    id: "p-lavanda-camomila",
    name: "Lavanda & Camomila",
    slug: "lavanda-e-camomila",
    collectionId: "col-floralis",
    categoryId: "cat-aromaticas",
    shortDescription: "Um abraço calmante para o fim do dia, entre lavanda e camomila.",
    description:
      "A combinação serena de lavanda e camomila cria uma atmosfera de calma profunda. Ideal para a leitura à noite, para o banho ou para os minutos antes de dormir.",
    images: [IMG.cand3, IMG.linen1, IMG.linen2],
    olfactoryProfile: "Herbal / Floral / Calmante",
    aromaticNotes: ["Lavanda", "Camomila", "Cedro", "Alfazema do campo"],
    weight: "120g",
    burnTime: "Aproximadamente 25 horas",
    ingredients: "Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.",
    instructions: "Na primeira queima, deixe toda a superfície derreter. Não queime por mais de 4h. Ajuste o pavio antes de apagar.",
    care: "Mantenha fora do alcance de crianças e pets. Nunca deixe sem supervisão.",
    price: 89,
    salePrice: null,
    stock: 12,
    status: "active",
    featured: true,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/lavanda-e-camomila", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    createdAt: now - 380000,
    updatedAt: now,
  },
  {
    id: "p-rosa-ambar",
    name: "Rosa & Âmbar",
    slug: "rosa-e-ambar",
    collectionId: "col-floralis",
    categoryId: "cat-aromaticas",
    shortDescription: "Rosa madura sobre uma base amadeirada de âmbar e sândalo.",
    description:
      "Rosa & Âmbar é uma vela de atmosfera sofisticada. A rosa se encontra com o âmbar e o sândalo para criar um aroma profundo, envolvente e elegante — perfeito para receber ou para momentos que pedem presença.",
    images: [IMG.cand2, IMG.cand5, IMG.cand6],
    olfactoryProfile: "Floral / Amadeirado / Sofisticado",
    aromaticNotes: ["Rosa", "Âmbar", "Sândalo", "Baunilha"],
    weight: "140g",
    burnTime: "Aproximadamente 30 horas",
    ingredients: "Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.",
    instructions: "Primeira queima completa da superfície. Máximo 4h por uso. Ajuste o pavio antes de apagar.",
    care: "Mantenha fora do alcance de crianças e animais. Nunca deixe sem supervisão.",
    price: 99,
    salePrice: null,
    stock: 9,
    status: "active",
    featured: true,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/rosa-e-ambar", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    createdAt: now - 360000,
    updatedAt: now,
  },
  {
    id: "p-jasmin-noite",
    name: "Jasmim da Noite",
    slug: "jasmim-da-noite",
    collectionId: "col-floralis",
    categoryId: "cat-aromaticas",
    shortDescription: "Jasmim noturno, viciante e luminoso, para noites de presença.",
    description:
      "O jasmim que floresce quando a noite chega. Jasmim da Noite é uma vela sensorial e marcante, que envolve o ambiente com um aroma branco, floral e levemente adocicado.",
    images: [IMG.cand6, IMG.cand1, IMG.cand2],
    olfactoryProfile: "Floral / Noturno / Envolvente",
    aromaticNotes: ["Jasmim", "Ylang-ylang", "Flor branca", "Musk"],
    weight: "120g",
    burnTime: "Aproximadamente 25 horas",
    ingredients: "Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.",
    instructions: "Derreta a superfície na primeira queima. Máximo 4h. Ajuste o pavio antes de apagar.",
    care: "Mantenha fora do alcance de crianças e animais. Nunca deixe sem supervisão.",
    price: 95,
    salePrice: null,
    stock: 6,
    status: "active",
    featured: false,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/jasmim-da-noite", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    createdAt: now - 340000,
    updatedAt: now,
  },
  {
    id: "p-ritual-pes",
    name: "Ritual dos Pés",
    slug: "ritual-dos-pes",
    collectionId: "col-rituais",
    categoryId: "cat-massagem",
    shortDescription: "Uma experiência criada para transformar momentos de cuidado em um pequeno ritual sensorial.",
    description:
      "O Ritual dos Pés foi criado para transformar o cuidado com os pés em um verdadeiro momento de bem-estar. A vela derrete em um óleo morno e perfumado, de notas frescas e herbais, ideal para massagens e para aliviar o cansaço do dia. Uma pausa para os pés, para o corpo e para a presença.",
    images: [IMG.spa1, IMG.spa2, IMG.cand3],
    olfactoryProfile: "Fresco / Herbal / Relaxante",
    aromaticNotes: ["Menta", "Eucalipto", "Alecrim", "Aromas do campo"],
    weight: "40g",
    burnTime: "Versão de massagem — não destina-se à queima contínua",
    ingredients: "Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.",
    instructions:
      "Acenda por alguns minutos até derreter uma camada de óleo. Apague, aguarde esfriar levemente e aplique sobre a pele com movimentos suaves. Teste a temperatura antes do uso.",
    care: "Produto para uso externo. Evite contato com os olhos. Suspenda o uso em caso de irritação. Mantenha fora do alcance de crianças.",
    price: 79,
    salePrice: 0,
    stock: 24,
    status: "active",
    featured: true,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/ritual-dos-pes", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    seoTitle: "Vela de massagem Ritual dos Pés — ALKAIA",
    seoDescription: "Vela de massagem artesanal de notas frescas e herbais. Derrete em óleo morno para um ritual de relaxamento dos pés.",
    createdAt: now - 300000,
    updatedAt: now,
  },
  {
    id: "p-ritual-descanso",
    name: "Ritual do Descanso",
    slug: "ritual-do-descanso",
    collectionId: "col-rituais",
    categoryId: "cat-massagem",
    shortDescription: "Velas de massagem para as noites que pedem calma e aconchego.",
    description:
      "Ritual do Descanso é feito para preparar o corpo para o repouso. Com notas florais e suaves, a vela derrete em um óleo de massagem morno, ideal para relaxar os ombros e adormecer com mais leveza.",
    images: [IMG.spa2, IMG.cand4, IMG.dried],
    olfactoryProfile: "Floral / Suave / Aconchegante",
    aromaticNotes: ["Lavanda", "Camomila", "Baunilha", "Flor de campo"],
    weight: "100g",
    burnTime: "Versão de massagem",
    ingredients: "Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.",
    instructions: "Derreta uma camada, apague, aguarde esfriar levemente e massageie na pele.",
    care: "Uso externo. Evite os olhos. Suspenda em caso de irritação.",
    price: 109,
    salePrice: null,
    stock: 14,
    status: "active",
    featured: true,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/ritual-do-descanso", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    createdAt: now - 280000,
    updatedAt: now,
  },
  {
    id: "p-ritual-energia",
    name: "Ritual da Energia",
    slug: "ritual-da-energia",
    collectionId: "col-rituais",
    categoryId: "cat-massagem",
    shortDescription: "Notas cítricas e vibrantes para despertar o corpo e a mente.",
    description:
      "Ritual da Energia é a escolha para os dias que pedem disposição. O óleo morno, de notas cítricas e revigorantes, é perfeito para massagens revitalizantes e para renovar o corpo no início do dia.",
    images: [IMG.cand1, IMG.spa1, IMG.cand2],
    olfactoryProfile: "Cítrico / Vibrante / Revigorante",
    aromaticNotes: ["Laranja", "Gengibre", "Limão siciliano", "Vetiver"],
    weight: "100g",
    burnTime: "Versão de massagem",
    ingredients: "Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.",
    instructions: "Derreta, apague, espere amornar e massageie a pele com movimentos circulares.",
    care: "Uso externo. Evite os olhos. Suspenda em caso de irritação.",
    price: 109,
    salePrice: null,
    stock: 11,
    status: "active",
    featured: false,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: false },
    links: { site: "/produto/ritual-da-energia", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia" },
    createdAt: now - 260000,
    updatedAt: now,
  },
  {
    id: "p-ritual-branco",
    name: "Ritual Branco",
    slug: "ritual-branco",
    collectionId: "col-rituais",
    categoryId: "cat-massagem",
    shortDescription: "Limpeza, elegância e sofisticação em um único ritual.",
    description:
      "Ritual Branco é a expressão da limpeza e do minimalismo. De perfil limpo e sofisticado, o óleo de massagem é delicado e ideal para rituais de spa, criando uma sensação de renovação e frescor.",
    images: [IMG.linen1, IMG.linen3, IMG.spa2],
    olfactoryProfile: "Limpo / Elegante / Sofisticado",
    aromaticNotes: ["Algodão", "Flor de sal", "Sândalo", "Musk branco"],
    weight: "100g",
    burnTime: "Versão de massagem",
    ingredients: "Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.",
    instructions: "Derreta uma camada de óleo, apague e massageie na pele.",
    care: "Uso externo. Evite os olhos. Suspenda em caso de irritação.",
    price: 115,
    salePrice: null,
    stock: 8,
    status: "active",
    featured: false,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/ritual-branco", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    createdAt: now - 240000,
    updatedAt: now,
  },
  {
    id: "p-noite-inverno",
    name: "Noite de Inverno",
    slug: "noite-de-inverno",
    collectionId: "col-especiais",
    categoryId: "cat-aromaticas",
    shortDescription: "Edição de inverno: madeira, especiarias e aconchego em cera.",
    description:
      "Uma edição limitada para os dias frios. Noite de Inverno une canela, cravo e resinas a uma base amadeirada, criando um aroma aveludado e acolhedor para as noites mais longas do ano.",
    images: [IMG.cand5, IMG.cand4, IMG.linen2],
    olfactoryProfile: "Amadeirado / Especiado / Aconchegante",
    aromaticNotes: ["Canela", "Cravo", "Resina", "Pinho", "Baunilha"],
    weight: "140g",
    burnTime: "Aproximadamente 30 horas",
    ingredients: "Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.",
    instructions: "Primeira queima completa. Máximo 4h por uso. Ajuste o pavio.",
    care: "Mantenha fora do alcance de crianças e animais. Nunca deixe sem supervisão.",
    price: 119,
    salePrice: 99,
    stock: 5,
    status: "active",
    featured: true,
    availableForDelivery: true,
    availableForPickup: true,
    channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: { site: "/produto/noite-de-inverno", shopee: "https://shopee.com.br/alkaia", mercadolivre: "https://mercadolivre.com.br/alkaia", whatsapp: "https://wa.me/5511999999999" },
    createdAt: now - 200000,
    updatedAt: now,
  },
];

export const seedSettings: Settings = {
  brandName: "ALKAIA",
  message: "Transforme momentos em rituais.",
  subtitle:
    "Velas e experiências sensoriais criadas para perfumar ambientes, despertar sentidos e transformar pequenos momentos em pausas especiais.",
  email: "contato@alkaia.com.br",
  whatsapp: "5511999999999",
  whatsappDisplay: "(11) 99999-9999",
  instagram: "https://instagram.com/alkaia",
  tiktok: "https://tiktok.com/@alkaia",
  shopee: "https://shopee.com.br/alkaia",
  mercadolivre: "https://mercadolivre.com.br/alkaia",
  city: "Artur Nogueira — SP",
  adminEmail: "admin@alkaia.com.br",
  adminPassword: "alkaia2026",
};

export const seedDeliveryRegions: DeliveryRegion[] = [
  { id: "r-1", name: "Artur Nogueira — SP", type: "retirada", note: "Retirada mediante combinação ou agendamento prévio." },
  { id: "r-2", name: "Artur Nogueira — SP", type: "entrega", note: "Entrega local combinada com a cliente. Valores definidos no momento do pedido." },
  { id: "r-3", name: "Holambra — SP", type: "entrega", note: "Entrega local combinada com a cliente. Valores definidos no momento do pedido." },
  { id: "r-4", name: "Região — Artur Nogueira / Holambra", type: "entrega", note: "Regiões próximas atendidas mediante combinação." },
  { id: "r-5", name: "Todo o Brasil", type: "envio", note: "Opções de envio dependem do canal de compra (Shopee, Mercado Livre ou WhatsApp)." },
];

export const seedFaqs: { q: string; a: string }[] = [
  { q: "As velas são artesanais?", a: "Sim. Todas as velas Alkaia são produzidas de forma artesanal, em pequenos lotes, com cera vegetal e óleos essenciais selecionados. Cada vela é vertida e finalizada à mão." },
  { q: "Posso escolher o aroma?", a: "Nas velas do catálogo, cada produto já tem um aroma criado pela Alkaia. Para aromas personalizados, você pode solicitar uma encomenda especial pela página Encomendas." },
  { q: "Vocês fazem encomendas especiais?", a: "Sim! Criamos encomendas personalizadas para presentes corporativos, eventos, lembranças, kits, produtos para spa e compras em quantidade. Preencha o formulário de Encomendas Especiais." },
  { q: "Vocês enviam para todo o Brasil?", a: "Sim. Os envios para todo o Brasil são realizados pelos canais de compra (Shopee, Mercado Livre e WhatsApp), e as opções de frete dependem de cada canal." },
  { q: "Posso retirar meu pedido em Artur Nogueira?", a: "Sim. A retirada é feita em Artur Nogueira — SP, mediante combinação ou agendamento prévio. Entre em contato pelo WhatsApp para combinar." },
  { q: "Quais são as formas de compra?", a: "Você pode comprar diretamente pelo site (quando disponível), pela loja na Shopee, pelo Mercado Livre ou encomendar pelo WhatsApp. Cada produto indica os canais disponíveis." },
  { q: "Como funcionam as velas de massagem?", a: "As velas de massagem são feitas com uma cera de baixo ponto de fusão. Ao acender por alguns minutos, elas derretem em um óleo morno e perfumado, indicado para massagens e para o cuidado do corpo." },
  { q: "Vocês fazem pedidos em quantidade?", a: "Sim. Atendemos pedidos em quantidade para empresas, spas, eventos e brindes. Fale conosco pela página de Encomendas Especiais." },
  { q: "Como entrar em contato com a Alkaia?", a: "Você pode falar conosco pelo WhatsApp, Instagram, TikTok ou e-mail. Nossa equipe responde com carinho e atenção." },
];

/* Mapeamento para a experiência 'Descubra seu Ritual' */
export interface RitualMatch {
  mood: string;
  title: string;
  description: string;
  productSlugs: string[];
}

export const ritualMatches: RitualMatch[] = [
  {
    mood: "Relaxar",
    title: "Ritual do Descanso",
    description: "Um convite para desacelerar. Aromas suaves e aconchegantes para acompanhar suas pausas do fim do dia.",
    productSlugs: ["ritual-do-descanso", "lavanda-e-camomila", "ritual-branco"],
  },
  {
    mood: "Ter energia",
    title: "Ritual da Energia",
    description: "Notas cítricas e revigorantes para despertar o corpo e clarear a mente ao longo do dia.",
    productSlugs: ["ritual-da-energia", "flor-de-laranjeira", "jasmim-da-noite"],
  },
  {
    mood: "Criar uma atmosfera acolhedora",
    title: "Ritual do Aconchego",
    description: "Uma atmosfera quente e envolvente para tornar qualquer momento da casa mais acolhedor.",
    productSlugs: ["noite-de-inverno", "rosa-e-ambar", "flor-de-laranjeira"],
  },
  {
    mood: "Concentrar",
    title: "Ritual da Presença",
    description: "Aromas limpos e elegantes que ajudam a criar foco, clareza e um estado de presença.",
    productSlugs: ["ritual-branco", "lavanda-e-camomila", "jasmim-da-noite"],
  },
  {
    mood: "Presentear alguém",
    title: "Ritual do Presente",
    description: "Uma seleção pensada para embalar um gesto de carinho e entregar um momento especial a alguém.",
    productSlugs: ["rosa-e-ambar", "noite-de-inverno", "ritual-dos-pes"],
  },
];
