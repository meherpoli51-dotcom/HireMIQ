import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/contact — Public booking form submission
 * Sends a notification email to sales@hiremiq.com
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, date, message } = body as {
      name: string;
      email: string;
      company?: string;
      date?: string;
      message?: string;
    };

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "HireMIQ Bookings <onboarding@resend.dev>",
        to: "sales@hiremiq.com",
        replyTo: email,
        subject: `New Consultation Request — ${name}${company ? ` (${company})` : ""}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1e293b; margin-bottom: 4px;">New Consultation Request</h2>
            <p style="color: #64748b; margin-top: 0;">Someone wants to book a free consultation on HireMIQ.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 120px; font-size: 14px;">Name</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #5B4FBF;">${email}</a></td>
              </tr>
              ${company ? `<tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${company}</td>
              </tr>` : ""}
              ${date ? `<tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Preferred Date</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${date}</td>
              </tr>` : ""}
              ${message ? `<tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${message}</td>
              </tr>` : ""}
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">Reply directly to this email to respond to ${name}.</p>
          </div>
        `,
      });
    }

    // Always return success (even if Resend key missing — log it)
    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — booking request received but not emailed:", { name, email, company, date });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
