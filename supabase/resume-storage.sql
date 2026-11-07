-- Run this after portfolio-cms.sql to enable the private dashboard's resume upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-resumes',
  'portfolio-resumes',
  true,
  8388608,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read the portfolio resume" on storage.objects;
create policy "Public can read the portfolio resume"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-resumes' and name = 'resume.pdf');

drop policy if exists "Portfolio admins can upload the resume" on storage.objects;
create policy "Portfolio admins can upload the resume"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-resumes'
    and name = 'resume.pdf'
    and exists (
      select 1 from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Portfolio admins can replace the resume" on storage.objects;
create policy "Portfolio admins can replace the resume"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio-resumes'
    and name = 'resume.pdf'
    and exists (
      select 1 from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'portfolio-resumes'
    and name = 'resume.pdf'
    and exists (
      select 1 from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );
