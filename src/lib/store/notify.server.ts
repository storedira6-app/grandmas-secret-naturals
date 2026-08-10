import { sendLovableEmail, EmailAPIError } from "@lovable.dev/email-js";

export const ADMIN_EMAIL = "khalil_212@outlook.fr";

export type LeadPayload = {
  full_name: string;
  phone: string;
  city: string;
  address: string;
  country: string | null;
  product_name: string | null;
  product_price: string | null;
  quantity: number;
  coupon_code: string | null;
  notes: string | null;
};

function row(label: string, value: string | null) {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;color:#6b6156;font-size:13px">${label}</td><td style="padding:6px 12px;font-size:14px;font-weight:600;color:#2f3a2c">${value}</td></tr>`;
}

/**
 * Emails the admin the new lead. Returns false (without throwing) when email
 * sending is not available yet so the order is never lost.
 */
export async function notifyAdminOfLead(lead: LeadPayload, leadId: string): Promise<boolean> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  const senderDomain = process.env["EMAIL_SENDER_DOMAIN"];
  if (!apiKey || !senderDomain) {
    console.warn("[lead-notify] email domain not configured yet; lead stored only:", leadId);
    return false;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;background:#ffffff;padding:24px">
      <h2 style="color:#2f5d3a;margin:0 0 4px">🌿 طلب جديد — سر الجدة</h2>
      <p style="color:#6b6156;font-size:13px;margin:0 0 16px">New customer lead #${leadId.slice(0, 8)}</p>
      <table style="border-collapse:collapse;background:#f7f4ee;border-radius:12px;width:100%">
        ${row("Name", lead.full_name)}
        ${row("Phone", lead.phone)}
        ${row("City", lead.city)}
        ${row("Address", lead.address)}
        ${row("Country", lead.country)}
        ${row("Product", lead.product_name)}
        ${row("Price", lead.product_price)}
        ${row("Quantity", String(lead.quantity))}
        ${row("Coupon", lead.coupon_code)}
        ${row("Notes", lead.notes)}
      </table>
    </div>`;

  try {
    const result = await sendLovableEmail(
      {
        sender_domain: senderDomain,
        from: `Grandma's Secret <orders@${senderDomain}>`,
        to: ADMIN_EMAIL,
        subject: `🌿 طلب جديد من ${lead.full_name} — ${lead.city}`,
        html,
        text: `New lead: ${lead.full_name} / ${lead.phone} / ${lead.city} / ${lead.address}`,
      },
      { apiKey, idempotencyKey: `lead-${leadId}` },
    );
    return result.success;

  } catch (error) {
    if (error instanceof EmailAPIError) {
      console.error(`[lead-notify] ${error.code} (${error.status})`);
    } else {
      console.error("[lead-notify]", error);
    }
    return false;
  }
}
