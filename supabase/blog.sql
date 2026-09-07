-- Blog da ALKAIA — tabela de posts
-- Idempotente: pode rodar mais de uma vez sem quebrar.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  cover_url text not null default '',
  body text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

-- Leitura: público vê só posts publicados; admin vê tudo
drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts
  for select using (published = true or public.is_admin());

-- Escrita: só admin
drop policy if exists "blog_admin_insert" on public.blog_posts;
create policy "blog_admin_insert" on public.blog_posts
  for insert with check (public.is_admin());

drop policy if exists "blog_admin_update" on public.blog_posts;
create policy "blog_admin_update" on public.blog_posts
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_admin_delete" on public.blog_posts;
create policy "blog_admin_delete" on public.blog_posts
  for delete using (public.is_admin());
