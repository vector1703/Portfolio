# Contact form email setup

The contact form uses EmailJS, which can send through a connected personal Gmail account. You do not need to own a domain.

## 1. Connect Gmail

1. Sign in to [EmailJS](https://www.emailjs.com/) and open **Email Services**.
2. Add a service and choose Gmail, then follow EmailJS's Google authorization steps.
3. Copy the service ID shown for that service.

## 2. Create the template

Create an email template with these settings:

- **To email:** `{{to_email}}`
- **Reply-to:** `{{from_email}}`
- **Subject:** `Portfolio contact: {{subject}}`
- **Message body:**

  ```text
  New message from your portfolio

  Name: {{from_name}}
  Email: {{from_email}}
  Subject: {{subject}}

  Message:
  {{message}}
  ```

Save it and copy its template ID. Keep the service's connected Gmail account as the sending account; the visitor's address is used as Reply-to so you can respond directly.

## 3. Add the EmailJS settings

In the project root, create or update `.env.local`:

```env
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

Find the public key in **Account** → **General** in EmailJS. These values are used by the server route. Restart `npm run dev` after changing them.

For deployment, add the same three environment variables in your hosting provider's project settings and redeploy. The destination address comes from the portfolio dashboard's profile email, falling back to `lib/data.ts`.

## 4. Send a test

Submit the contact form with a real address you can access. If EmailJS rejects it, check **EmailJS → Email History** and confirm that Gmail is still connected, the IDs match, and the template uses the variable names above.
