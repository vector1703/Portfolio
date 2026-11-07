This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contact form email

The contact form sends submissions to the email address in `lib/data.ts` (or the email set in the dashboard) through EmailJS. You can connect a personal Gmail account, so you do not need to own a domain. To enable delivery:

1. In EmailJS, connect your Gmail account and create a template with `to_email`, `from_name`, `from_email`, `subject`, and `message` variables. Set the template recipient to `{{to_email}}` and reply-to to `{{from_email}}`.
2. Copy `.env.example` to `.env.local` and set `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, and `EMAILJS_PUBLIC_KEY` from your EmailJS dashboard.
3. Restart the development server. In production, add the same variables to your hosting provider's environment settings.

The form endpoint validates submissions and keeps the configured recipient on the server. See [EMAILJS_CONTACT_SETUP.md](./EMAILJS_CONTACT_SETUP.md) for detailed steps.

## Portfolio content dashboard

Use the private `/dashboard` editor to update your profile, skills, learning topics, experience, and projects. Setup steps, SQL security policies, and image guidance are in [SUPABASE_DASHBOARD_SETUP.md](./SUPABASE_DASHBOARD_SETUP.md). The dashboard uses Supabase Auth and Row Level Security; only a manually allowlisted account can publish changes.

## Add a resume later

The resume download stays disabled until you upload a PDF from the allowlisted account in `/dashboard`. Follow [RESUME_SETUP.md](./RESUME_SETUP.md); there is no public upload form.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
