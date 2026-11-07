# Upload your resume from the dashboard

The resume upload is available only inside `/dashboard` for an account allowlisted in `portfolio_admins`. There is no public upload form. The PDF itself is served publicly so visitors can download it.

## Enable the upload gate

1. Complete the main Supabase setup in [SUPABASE_DASHBOARD_SETUP.md](./SUPABASE_DASHBOARD_SETUP.md).
2. Run [`supabase/resume-storage.sql`](./supabase/resume-storage.sql) in the Supabase SQL Editor. It creates a public download bucket with an 8 MB PDF limit and admin-only upload/replace policies.
3. Sign in at `/dashboard`, open **Profile**, choose your PDF, and select **Upload PDF**.
4. Select **Publish changes** to enable the resume download button on the portfolio.

You can upload a replacement later using the same steps. Only the allowlisted admin account can upload or replace `resume.pdf`.
