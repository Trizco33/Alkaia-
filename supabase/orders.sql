-- ============================================================
-- ALKAIA — Pedidos (e-commerce Mercado Pago)
-- Rode este arquivo no SQL Editor do painel Supabase.
-- Seguro para rodar mais de uma vez (idempotente).
-- ============================================================

-- Tabela de pedidos
create table if not exists public.orders (
  id               text primary key default gen_random_uuid()::text,
  status           text not null default 'pendente',
  -- pendente | pago | em_preparo | enviado | entregue | cancelado | reembolsado
  items            jsonb not null default '[]'::jsonb,
  -- [{ productId, name, slug, qty, unitPrice, grams }]
  subtotal         numeric(10,2) not null default 0,
  shipping_method  text not null default 'retirada',  -- retirada | pac | sedex
  shipping_price   numeric(10,2) not null default 0,
  shipping_days    int,
  total            numeric(10,2) not null default 0,
  customer_name    text not null default '',
  customer_email   text not null default '',
  customer_phone   text not null default '',
  address          jsonb,
  -- { cep, street, number, complement, district, city, state }
  note             text default '',
  mp_preference_id text,
  mp_payment_id    text,
  mp_status        text,
  tracking_code    text,
  stock_debited    boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists orders_status_idx  on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_mp_pref_idx on public.orders(mp_preference_id);

-- Trigger de updated_at
create or replace function public.orders_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch
  before update on public.orders
  for each row execute function public.orders_touch_updated_at();

-- RLS: ninguém escreve pelo site; só o service role (edge functions).
-- Leitura e gestão apenas para admins logados.
alter table public.orders enable row level security;

drop policy if exists "orders_admin_select" on public.orders;
create policy "orders_admin_select" on public.orders
  for select to authenticated
  using (public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- (sem policy de insert para anon/authenticated:
--  inserção só via service role, que ignora RLS)

-- Admin pode excluir pedidos que não representam venda concluída
-- (pedido pago/enviado/entregue fica protegido contra exclusão acidental).
drop policy if exists "orders_admin_delete" on public.orders;
create policy "orders_admin_delete" on public.orders
  for delete to authenticated
  using (public.is_admin() and status in ('pendente', 'cancelado', 'reembolsado'));

-- ============================================================
-- Atualização de conteúdo: envio agora é pelos Correios via site
-- ============================================================
update public.delivery_regions
set note = 'O pedido é embalado com cuidado e despachado após a confirmação do pagamento.'
where id = 'r-5';
