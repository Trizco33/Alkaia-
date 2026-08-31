-- ============================================================
-- ALKAIA — Estrutura do banco de dados (Supabase / PostgreSQL)
-- ============================================================
-- Como usar:
-- 1. Acesse o painel do Supabase → SQL Editor → New query
-- 2. Cole TODO o conteúdo deste arquivo
-- 3. Clique em "Run"
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABELAS
-- ------------------------------------------------------------

-- Coleções (Floralis, Rituais, Edições Especiais)
create table if not exists public.collections (
  id              text primary key default gen_random_uuid()::text,
  name            text not null,
  slug            text not null unique,
  tagline         text default '',
  description     text default '',
  image           text default '',
  editorial       text default '',
  ritual          text,
  sub_collection  jsonb default '[]'::jsonb,
  sort_order      int  default 0,
  created_at      timestamptz default now()
);

-- Categorias (Velas Aromáticas, Velas de Massagem, Kits)
create table if not exists public.categories (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  slug        text not null unique,
  description text default '',
  created_at  timestamptz default now()
);

-- Produtos
create table if not exists public.products (
  id                     text primary key default gen_random_uuid()::text,
  name                   text not null,
  slug                   text not null unique,
  collection_id          text references public.collections(id) on delete set null,
  category_id            text references public.categories(id)  on delete set null,
  short_description      text default '',
  description            text default '',
  images                 jsonb default '[]'::jsonb,
  olfactory_profile      text default '',
  aromatic_notes         jsonb default '[]'::jsonb,
  weight                 text default '',
  burn_time              text default '',
  ingredients            text default '',
  instructions           text default '',
  care                   text default '',
  price                  numeric(10,2) default 0,
  sale_price             numeric(10,2),
  stock                  int default 0,
  status                 text default 'active',
  featured               boolean default false,
  available_for_delivery boolean default true,
  available_for_pickup   boolean default true,
  channels               jsonb default '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
  links                  jsonb default '{}'::jsonb,
  seo_title              text,
  seo_description        text,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

create index if not exists products_collection_idx on public.products(collection_id);
create index if not exists products_category_idx   on public.products(category_id);
create index if not exists products_status_idx     on public.products(status);

-- Variações de produto (ex: Essencial 40g / Premium 100g)
create table if not exists public.product_variants (
  id         text primary key default gen_random_uuid()::text,
  product_id text references public.products(id) on delete cascade,
  label      text not null,
  weight     text default '',
  price      numeric(10,2) default 0,
  sale_price numeric(10,2),
  stock      int default 0,
  burn_time  text default '',
  image      text default '',
  status     text default 'active',
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists variants_product_idx on public.product_variants(product_id);

-- Regiões de entrega / retirada
create table if not exists public.delivery_regions (
  id         text primary key default gen_random_uuid()::text,
  name       text not null,
  type       text not null default 'entrega',   -- retirada | entrega | envio
  note       text default '',
  fee        numeric(10,2),
  created_at timestamptz default now()
);

-- Solicitações de encomendas especiais
create table if not exists public.special_orders (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  whatsapp   text default '',
  email      text default '',
  type       text default '',
  quantity   text default '',
  interest   text default '',
  date       text default '',
  message    text default '',
  status     text default 'nova',               -- nova | em_andamento | concluida
  created_at timestamptz default now()
);

-- Mensagens do formulário de contato
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text default '',
  subject    text default '',
  message    text default '',
  created_at timestamptz default now()
);

-- Eventos de analytics
create table if not exists public.analytics_events (
  id         bigserial primary key,
  event      text not null,
  slug       text,
  channel    text,
  source     text,
  created_at timestamptz default now()
);

create index if not exists analytics_event_idx   on public.analytics_events(event);
create index if not exists analytics_created_idx on public.analytics_events(created_at desc);

-- Configurações da marca (linha única)
create table if not exists public.settings (
  id                integer primary key default 1 check (id = 1),
  brand_name        text default 'ALKAIA',
  message           text default 'Transforme momentos em rituais.',
  subtitle          text default '',
  email             text default '',
  whatsapp          text default '',
  whatsapp_display  text default '',
  instagram         text default '',
  tiktok            text default '',
  shopee            text default '',
  mercadolivre      text default '',
  city              text default 'Artur Nogueira — SP',
  updated_at        timestamptz default now()
);


-- ------------------------------------------------------------
-- 2. SEGURANÇA (Row Level Security)
-- ------------------------------------------------------------
-- Regra geral:
--   • Visitantes  → só LEEM o catálogo e podem ENVIAR formulários
--   • Autenticado → acesso total (painel administrativo)

alter table public.collections      enable row level security;
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.delivery_regions enable row level security;
alter table public.special_orders   enable row level security;
alter table public.contact_messages enable row level security;
alter table public.analytics_events enable row level security;
alter table public.settings         enable row level security;

-- ---- Catálogo: leitura pública, escrita só autenticada ----
do $$
declare t text;
begin
  foreach t in array array[
    'collections','categories','products',
    'product_variants','delivery_regions','settings'
  ]
  loop
    execute format('drop policy if exists "leitura publica" on public.%I', t);
    execute format(
      'create policy "leitura publica" on public.%I for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "escrita admin" on public.%I', t);
    execute format(
      'create policy "escrita admin" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ---- Formulários: qualquer visitante envia, só admin lê ----
drop policy if exists "visitante envia encomenda" on public.special_orders;
create policy "visitante envia encomenda" on public.special_orders
  for insert to anon, authenticated with check (true);

drop policy if exists "admin gerencia encomendas" on public.special_orders;
create policy "admin gerencia encomendas" on public.special_orders
  for all to authenticated using (true) with check (true);

drop policy if exists "visitante envia mensagem" on public.contact_messages;
create policy "visitante envia mensagem" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "admin gerencia mensagens" on public.contact_messages;
create policy "admin gerencia mensagens" on public.contact_messages
  for all to authenticated using (true) with check (true);

-- ---- Analytics: qualquer visitante registra, só admin lê ----
drop policy if exists "visitante registra evento" on public.analytics_events;
create policy "visitante registra evento" on public.analytics_events
  for insert to anon, authenticated with check (true);

drop policy if exists "admin le analytics" on public.analytics_events;
create policy "admin le analytics" on public.analytics_events
  for select to authenticated using (true);


-- ------------------------------------------------------------
-- 3. CONTEÚDO INICIAL
-- ------------------------------------------------------------

insert into public.settings (id, brand_name, message, subtitle, email, whatsapp,
  whatsapp_display, instagram, tiktok, shopee, mercadolivre, city)
values (1, 'ALKAIA', 'Transforme momentos em rituais.',
  'Velas e experiências sensoriais criadas para perfumar ambientes, despertar sentidos e transformar pequenos momentos em pausas especiais.',
  'contato@alkaia.com.br', '5511999999999', '(11) 99999-9999',
  'https://instagram.com/alkaia', 'https://tiktok.com/@alkaia',
  'https://shopee.com.br/alkaia', 'https://mercadolivre.com.br/alkaia',
  'Artur Nogueira — SP')
on conflict (id) do nothing;

insert into public.categories (id, name, slug, description) values
  ('cat-aromaticas', 'Velas Aromáticas', 'velas-aromaticas', 'Velas que perfumam ambientes e criam atmosferas.'),
  ('cat-massagem',   'Velas de Massagem', 'velas-de-massagem', 'Velas que derretem em óleo de massagem.'),
  ('cat-kits',       'Kits e Presentes',  'kits-e-presentes', 'Composições prontas para presentear.')
on conflict (id) do nothing;

insert into public.collections (id, name, slug, tagline, description, image, editorial, ritual, sub_collection, sort_order) values
  ('col-floralis', 'Floralis', 'floralis', 'A atmosfera das flores',
   'Uma coleção sensorial inspirada nas flores, suas atmosferas e nas emoções que despertam.',
   'https://images.pexels.com/photos/7260252/pexels-photo-7260252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720',
   'Cada flor carrega uma memória — o cheiro de um quintal, de um jardim na chuva, de uma tarde que quisemos guardar. Floralis nasce dessa memória íntima, traduzindo em cera e aroma aquilo que as flores despertam em nós.',
   null,
   '[{"name":"Florais","profile":"Floral · Envolvente"},{"name":"Herbais","profile":"Herbal · Fresco"},{"name":"Amadeirados","profile":"Amadeirado · Sofisticado"}]'::jsonb, 1),

  ('col-rituais', 'Rituais', 'rituais', 'Cuidado, presença e relaxamento',
   'Experiências criadas para momentos de cuidado, relaxamento e presença.',
   'https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720',
   'Rituais é uma linha pensada para o corpo e para a pausa. Velas de massagem e composições que transformam gestos simples — um banho, uma massagem, um instante de silêncio — em cuidado de verdade.',
   'ritual',
   '[{"name":"Ritual dos Pés","profile":"Fresco / Herbal / Relaxante"},{"name":"Ritual do Descanso","profile":"Floral / Suave / Aconchegante"},{"name":"Ritual da Energia","profile":"Cítrico / Vibrante / Revigorante"},{"name":"Ritual Branco","profile":"Limpo / Elegante / Sofisticado"}]'::jsonb, 2),

  ('col-especiais', 'Edições Especiais', 'edicoes-especiais', 'Lançamentos limitados e sazonais',
   'Estrutura para lançamentos limitados, sazonais e colaborações.',
   'https://images.pexels.com/photos/15683359/pexels-photo-15683359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720',
   'Alguns aromas pertencem a um momento. As Edições Especiais celebram estações, datas e encontros — tiragens pequenas, criadas com cuidado e com um tempo próprio para existir.',
   'fluxo',
   '[{"name":"Inverno","profile":"Amadeirado · Especiado"},{"name":"Primavera","profile":"Floral · Fresco"},{"name":"Presentes","profile":"Colecionáveis"}]'::jsonb, 3)
on conflict (id) do nothing;

insert into public.delivery_regions (id, name, type, note) values
  ('r-1', 'Artur Nogueira — SP', 'retirada', 'Retirada mediante combinação ou agendamento prévio.'),
  ('r-2', 'Artur Nogueira — SP', 'entrega',  'Entrega local combinada com a cliente. Valores definidos no momento do pedido.'),
  ('r-3', 'Holambra — SP', 'entrega', 'Entrega local combinada com a cliente. Valores definidos no momento do pedido.'),
  ('r-4', 'Região — Artur Nogueira / Holambra', 'entrega', 'Regiões próximas atendidas mediante combinação.'),
  ('r-5', 'Todo o Brasil', 'envio', 'Opções de envio dependem do canal de compra (Shopee, Mercado Livre ou WhatsApp).')
on conflict (id) do nothing;

insert into public.products (
  id, name, slug, collection_id, category_id, short_description, description, images,
  olfactory_profile, aromatic_notes, weight, burn_time, ingredients, instructions, care,
  price, sale_price, stock, status, featured, channels, links
) values
  ('p-flor-laranjeira', 'Flor de Laranjeira', 'flor-de-laranjeira', 'col-floralis', 'cat-aromaticas',
   'Um mergulho na flor de laranjeira: luminosa, quente e levemente cítrica.',
   'Flor de Laranjeira é uma vela aromática para trazer luz e memória ao ambiente. Criada com cera vegetal e óleos essenciais, evoca o perfume delicado das laranjeiras em flor e transforma o espaço em um convite à pausa.',
   '["https://images.pexels.com/photos/7260252/pexels-photo-7260252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/11137699/pexels-photo-11137699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/7004680/pexels-photo-7004680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Floral / Cítrico / Envolvente',
   '["Bergamota","Néroli","Flor de laranjeira","Madeira clara"]'::jsonb,
   '120g', 'Aproximadamente 25 horas',
   'Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.',
   'Acenda o pavio e deixe a camada superior derreter por completo na primeira queima. Nunca deixe a vela acesa por mais de 4h seguidas.',
   'Mantenha fora do alcance de crianças e animais. Nunca deixe a vela acesa sem supervisão.',
   89, 69, 18, 'active', true,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb),

  ('p-lavanda-camomila', 'Lavanda & Camomila', 'lavanda-e-camomila', 'col-floralis', 'cat-aromaticas',
   'Um abraço calmante para o fim do dia, entre lavanda e camomila.',
   'A combinação serena de lavanda e camomila cria uma atmosfera de calma profunda. Ideal para a leitura à noite, para o banho ou para os minutos antes de dormir.',
   '["https://images.pexels.com/photos/7004680/pexels-photo-7004680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/12486420/pexels-photo-12486420.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Herbal / Floral / Calmante',
   '["Lavanda","Camomila","Cedro","Alfazema do campo"]'::jsonb,
   '120g', 'Aproximadamente 25 horas',
   'Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.',
   'Na primeira queima, deixe toda a superfície derreter. Não queime por mais de 4h.',
   'Mantenha fora do alcance de crianças e pets. Nunca deixe sem supervisão.',
   89, null, 12, 'active', true,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb),

  ('p-rosa-ambar', 'Rosa & Âmbar', 'rosa-e-ambar', 'col-floralis', 'cat-aromaticas',
   'Rosa madura sobre uma base amadeirada de âmbar e sândalo.',
   'Rosa & Âmbar é uma vela de atmosfera sofisticada. A rosa se encontra com o âmbar e o sândalo para criar um aroma profundo, envolvente e elegante.',
   '["https://images.pexels.com/photos/7671141/pexels-photo-7671141.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/15683359/pexels-photo-15683359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Floral / Amadeirado / Sofisticado',
   '["Rosa","Âmbar","Sândalo","Baunilha"]'::jsonb,
   '140g', 'Aproximadamente 30 horas',
   'Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.',
   'Primeira queima completa da superfície. Máximo 4h por uso.',
   'Mantenha fora do alcance de crianças e animais. Nunca deixe sem supervisão.',
   99, null, 9, 'active', true,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb),

  ('p-jasmin-noite', 'Jasmim da Noite', 'jasmim-da-noite', 'col-floralis', 'cat-aromaticas',
   'Jasmim noturno, viciante e luminoso, para noites de presença.',
   'O jasmim que floresce quando a noite chega. Jasmim da Noite é uma vela sensorial e marcante, que envolve o ambiente com um aroma branco, floral e levemente adocicado.',
   '["https://images.pexels.com/photos/20390718/pexels-photo-20390718.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Floral / Noturno / Envolvente',
   '["Jasmim","Ylang-ylang","Flor branca","Musk"]'::jsonb,
   '120g', 'Aproximadamente 25 horas',
   'Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.',
   'Derreta a superfície na primeira queima. Máximo 4h.',
   'Mantenha fora do alcance de crianças e animais.',
   95, null, 6, 'active', false,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb),

  ('p-ritual-pes', 'Ritual dos Pés', 'ritual-dos-pes', 'col-rituais', 'cat-massagem',
   'Uma experiência criada para transformar momentos de cuidado em um pequeno ritual sensorial.',
   'O Ritual dos Pés foi criado para transformar o cuidado com os pés em um verdadeiro momento de bem-estar. A vela derrete em um óleo morno e perfumado, de notas frescas e herbais, ideal para massagens e para aliviar o cansaço do dia.',
   '["https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/1926811/pexels-photo-1926811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Fresco / Herbal / Relaxante',
   '["Menta","Eucalipto","Alecrim","Aromas do campo"]'::jsonb,
   '40g', 'Versão de massagem',
   'Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.',
   'Acenda por alguns minutos até derreter uma camada de óleo. Apague, aguarde esfriar levemente e aplique sobre a pele com movimentos suaves.',
   'Produto para uso externo. Evite contato com os olhos. Suspenda o uso em caso de irritação.',
   79, null, 24, 'active', true,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb),

  ('p-ritual-descanso', 'Ritual do Descanso', 'ritual-do-descanso', 'col-rituais', 'cat-massagem',
   'Velas de massagem para as noites que pedem calma e aconchego.',
   'Ritual do Descanso é feito para preparar o corpo para o repouso. Com notas florais e suaves, a vela derrete em um óleo de massagem morno.',
   '["https://images.pexels.com/photos/1926811/pexels-photo-1926811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/27273230/pexels-photo-27273230.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Floral / Suave / Aconchegante',
   '["Lavanda","Camomila","Baunilha","Flor de campo"]'::jsonb,
   '100g', 'Versão de massagem',
   'Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.',
   'Derreta uma camada, apague, aguarde esfriar levemente e massageie na pele.',
   'Uso externo. Evite os olhos. Suspenda em caso de irritação.',
   109, null, 14, 'active', true,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb),

  ('p-ritual-energia', 'Ritual da Energia', 'ritual-da-energia', 'col-rituais', 'cat-massagem',
   'Notas cítricas e vibrantes para despertar o corpo e a mente.',
   'Ritual da Energia é a escolha para os dias que pedem disposição. O óleo morno, de notas cítricas e revigorantes, é perfeito para massagens revitalizantes.',
   '["https://images.pexels.com/photos/7260252/pexels-photo-7260252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Cítrico / Vibrante / Revigorante',
   '["Laranja","Gengibre","Limão siciliano","Vetiver"]'::jsonb,
   '100g', 'Versão de massagem',
   'Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.',
   'Derreta, apague, espere amornar e massageie a pele com movimentos circulares.',
   'Uso externo. Evite os olhos.',
   109, null, 11, 'active', false,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":false}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia"}'::jsonb),

  ('p-ritual-branco', 'Ritual Branco', 'ritual-branco', 'col-rituais', 'cat-massagem',
   'Limpeza, elegância e sofisticação em um único ritual.',
   'Ritual Branco é a expressão da limpeza e do minimalismo. De perfil limpo e sofisticado, o óleo de massagem é delicado e ideal para rituais de spa.',
   '["https://images.pexels.com/photos/12486420/pexels-photo-12486420.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/6805524/pexels-photo-6805524.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Limpo / Elegante / Sofisticado',
   '["Algodão","Flor de sal","Sândalo","Musk branco"]'::jsonb,
   '100g', 'Versão de massagem',
   'Cera vegetal de baixo ponto de fusão, óleos vegetais e essências.',
   'Derreta uma camada de óleo, apague e massageie na pele.',
   'Uso externo. Evite os olhos.',
   115, null, 8, 'active', false,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb),

  ('p-noite-inverno', 'Noite de Inverno', 'noite-de-inverno', 'col-especiais', 'cat-aromaticas',
   'Edição de inverno: madeira, especiarias e aconchego em cera.',
   'Uma edição limitada para os dias frios. Noite de Inverno une canela, cravo e resinas a uma base amadeirada, criando um aroma aveludado e acolhedor.',
   '["https://images.pexels.com/photos/15683359/pexels-photo-15683359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720","https://images.pexels.com/photos/11137699/pexels-photo-11137699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"]'::jsonb,
   'Amadeirado / Especiado / Aconchegante',
   '["Canela","Cravo","Resina","Pinho","Baunilha"]'::jsonb,
   '140g', 'Aproximadamente 30 horas',
   'Cera vegetal, óleos essenciais, pavio de algodão, recipiente de vidro.',
   'Primeira queima completa. Máximo 4h por uso.',
   'Mantenha fora do alcance de crianças e animais.',
   119, 99, 5, 'active', true,
   '{"site":true,"shopee":true,"mercadolivre":true,"whatsapp":true}'::jsonb,
   '{"shopee":"https://shopee.com.br/alkaia","mercadolivre":"https://mercadolivre.com.br/alkaia","whatsapp":"https://wa.me/5511999999999"}'::jsonb)
on conflict (id) do nothing;

-- Variações do Ritual dos Pés
insert into public.product_variants (id, product_id, label, weight, price, stock, sort_order) values
  ('v-pes-essencial', 'p-ritual-pes', 'Essencial', '40g',  79, 24, 1),
  ('v-pes-premium',   'p-ritual-pes', 'Premium',   '100g', 109, 12, 2)
on conflict (id) do nothing;

-- ============================================================
-- FIM — Banco pronto para uso.
-- Próximo passo: criar o usuário administrador em
-- Authentication → Users → Add user
-- ============================================================
