# Portfolio dashboard setup

The editor lives at `/dashboard`. It uses a Supabase Auth email/password account and saves one JSON document to the `portfolio_content` table. The site uses that row when available and falls back to the starter content in `lib/data.ts` when the CMS has not been configured.

## 1. Create the Supabase tables

Open the SQL Editor in your Supabase project and run [`supabase/portfolio-cms.sql`](./supabase/portfolio-cms.sql). The script enables Row Level Security: visitors can read the published portfolio, while changes require a user ID in `portfolio_admins`.

## 2. Create your private admin account

In Supabase Authentication, turn off public sign-ups and create your own email/password user from the dashboard. Copy that user's UUID from the Users page, then run the final `insert` statement at the bottom of the SQL file with your UUID. Only allowlisted accounts can save content.

## 3. Connect this app

Copy `.env.example` to `.env.local`, then replace `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the values from your Supabase project's Connect dialog. Do not use a service-role or secret key in these public variables. Restart the development server.

## 4. Edit and publish

Visit `/dashboard`, sign in with the allowlisted account, edit a section, and choose **Publish changes**. Changes are saved to Supabase and appear on the portfolio when visitors load or refresh the site. Update these same environment variables in your hosting provider before deployment.

Project image fields accept paths such as `/images/project.png`. Add image files yourself to `public/images` and enter their paths in the dashboard; the dashboard does not expose a public file upload.

## Enable the resume upload gate

To upload your resume from the private dashboard, run [`supabase/resume-storage.sql`](./supabase/resume-storage.sql) after the CMS SQL. It creates a public-download bucket with an 8 MB PDF limit and storage policies that allow only allowlisted admins to upload or replace the PDF. Then follow [RESUME_SETUP.md](./RESUME_SETUP.md).
