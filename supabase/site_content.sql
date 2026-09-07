-- Conteúdo editável do site (textos e imagens) + bucket de upload
-- Executado via Management API em 2026-09-06.

create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read" on public.site_content
  for select using (true);

drop policy if exists "site_content_admin_insert" on public.site_content;
create policy "site_content_admin_insert" on public.site_content
  for insert with check (public.is_admin());

drop policy if exists "site_content_admin_update" on public.site_content;
create policy "site_content_admin_update" on public.site_content
  for update using (public.is_admin()) with check (public.is_admin());

insert into public.site_content (id, data) values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Bucket público para imagens do site (upload só por admin)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif','image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','image/gif'];

drop policy if exists "site_images_public_read" on storage.objects;
create policy "site_images_public_read" on storage.objects
  for select using (bucket_id = 'site-images');

drop policy if exists "site_images_admin_insert" on storage.objects;
create policy "site_images_admin_insert" on storage.objects
  for insert with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site_images_admin_update" on storage.objects;
create policy "site_images_admin_update" on storage.objects
  for update using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site_images_admin_delete" on storage.objects;
create policy "site_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'site-images' and public.is_admin());
