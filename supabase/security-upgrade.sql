-- ============================================================
-- ALKAIA — Upgrade de segurança (rodar no Supabase SQL Editor)
-- ============================================================
-- Problema: as políticas antigas davam escrita total a QUALQUER
-- usuário "authenticated". Como o cadastro público (sign up) está
-- habilitado, qualquer pessoa poderia criar uma conta e virar admin.
--
-- Este script restringe a escrita a administradores explícitos,
-- listados na tabela privada `admin_users`.
--
-- Como usar:
-- 1. Supabase → SQL Editor → New query → cole tudo → Run
-- 2. Depois vá em Authentication → Sign In / Providers → Email
--    e DESATIVE "Allow new users to sign up" (defesa em dobro).
-- ============================================================

-- 1. Tabela privada de administradores (sem policies => inacessível via API)
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.admin_users enable row level security;

-- Admin atual (Gabrielle)
insert into public.admin_users (user_id)
values ('5992cf60-6d16-47d5-b57c-283f83e5db6b')
on conflict do nothing;

-- 2. Função helper: o usuário logado é admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $fn$
  select exists (select 1 from public.admin_users where user_id = auth.uid())
$fn$;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Catálogo: escrita apenas para admins reais
do $$
declare t text;
begin
  foreach t in array array[
    'collections','categories','products',
    'product_variants','delivery_regions','settings'
  ]
  loop
    execute format('drop policy if exists "escrita admin" on public.%I', t);
    execute format(
      'create policy "escrita admin" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- 4. Formulários e analytics: gestão/leitura apenas para admins reais
drop policy if exists "admin gerencia encomendas" on public.special_orders;
create policy "admin gerencia encomendas" on public.special_orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin gerencia mensagens" on public.contact_messages;
create policy "admin gerencia mensagens" on public.contact_messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin le analytics" on public.analytics_events;
create policy "admin le analytics" on public.analytics_events
  for select to authenticated using (public.is_admin());

-- 5. Verificação — deve listar 9 políticas usando is_admin()
select tablename, policyname
from pg_policies
where schemaname = 'public'
  and (qual like '%is_admin%' or with_check like '%is_admin%')
order by tablename;
