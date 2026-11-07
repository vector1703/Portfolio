import { profile } from "@/lib/data";
import { createClient } from "@supabase/supabase-js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textField(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function getContactRecipient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return profile.email;

  try {
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data } = await supabase.from("portfolio_content").select("data").eq("id", "site").maybeSingle();
    const recipient = (data?.data as { profile?: { email?: unknown } } | null)?.profile?.email;
    return typeof recipient === "string" && emailPattern.test(recipient) ? recipient : profile.email;
  } catch {
    return profile.email;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please submit the form again." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const fields = body as Record<string, unknown>;
  // Quietly accept bot submissions that fill in this off-screen field.
  if (textField(fields.company, 200)) return Response.json({ ok: true });

  const name = textField(fields.name, 100).replace(/[\r\n]+/g, " ");
  const email = textField(fields.email, 254);
  const subject = textField(fields.subject, 160).replace(/[\r\n]+/g, " ");
  const message = textField(fields.message, 5000);

  if (!name || !emailPattern.test(email) || !subject || message.length < 10) {
    return Response.json({ error: "Please complete all fields with a valid email and a longer message." }, { status: 400 });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey || /your_|placeholder/i.test(`${serviceId} ${templateId} ${publicKey}`)) {
    return Response.json({ error: "The contact form is not configured yet. Please email me directly." }, { status: 503 });
  }

  try {
    const result = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: await getContactRecipient(),
          from_name: name,
          from_email: email,
          subject,
          message,
        },
      }),
      cache: "no-store",
    });

    if (!result.ok) {
      const providerMessage = await result.text().catch(() => "");
      const safeProviderMessage = providerMessage.replace(/[\r\n\t]+/g, " ").trim().slice(0, 160);
      console.error("Contact email provider rejected a message:", {
        status: result.status,
        reason: safeProviderMessage || "No provider details returned",
      });
      const error = process.env.NODE_ENV === "development" && safeProviderMessage
        ? `EmailJS rejected the request (${result.status}): ${safeProviderMessage}`
        : "Your message could not be sent right now. Please email me directly.";
      return Response.json({ error }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Email service is temporarily unavailable. Please try again later." }, { status: 502 });
  }
}
