import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    // Auth check — prevent open email relay
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { candidateEmail, candidateName, jobTitle, clientName, assessLink } =
      body as {
        candidateEmail: string;
        candidateName: string;
        jobTitle: string;
        clientName: string;
        assessLink: string;
      };

    if (!candidateEmail || !assessLink) {
      return NextResponse.json(
        { error: "Email and assessment link are required" },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      // Fallback: return mailto link if no Resend key configured
      const subject = encodeURIComponent(
        `Screening Assessment - ${jobTitle} at ${clientName}`
      );
      const emailBody = encodeURIComponent(
        `Hi ${candidateName},\n\nYou have been shortlisted for the ${jobTitle} position at ${clientName}.\n\nPlease complete your screening assessment using the link below:\n${assessLink}\n\nImportant:\n- The assessment has 8 questions and a 35-minute time limit\n- Single attempt only — once started, the timer begins\n- Answer all questions thoroughly for the best evaluation\n\nBest regards,\nRecruitment Team`
      );
      return NextResponse.json({
        sent: false,
        fallback: "mailto",
        mailtoLink: `mailto:${candidateEmail}?subject=${subject}&body=${emailBody}`,
        message: "Email service not configured. Use the mailto link instead.",
      });
    }

    const resend = new Resend(resendKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "assessments@hiremiq.com";

    await resend.emails.send({
      from: `HireMIQ Assessments <${fromEmail}>`,
      to: candidateEmail,
      subject: `Screening Assessment - ${jobTitle} at ${clientName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #1e293b; font-size: 20px; margin: 0;">HireMIQ Assessment</h2>
          </div>

          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Hi ${candidateName},
          </p>

          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            You have been shortlisted for the <strong>${jobTitle}</strong> position at <strong>${clientName}</strong>.
            Please complete your screening assessment using the link below.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${assessLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Start Assessment
            </a>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #475569; font-size: 13px; margin: 0 0 8px;">
              <strong>Questions:</strong> 8
            </p>
            <p style="color: #475569; font-size: 13px; margin: 0 0 8px;">
              <strong>Time Limit:</strong> 35 minutes
            </p>
            <p style="color: #475569; font-size: 13px; margin: 0;">
              <strong>Attempt:</strong> Single attempt only
            </p>
          </div>

          <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 14px; margin: 20px 0;">
            <p style="color: #92400e; font-size: 12px; margin: 0;">
              Once started, the timer begins. Answer all questions thoroughly — your responses will be evaluated by AI for depth and accuracy.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 32px;">
            Powered by HireMIQ — AI Recruitment Intelligence
          </p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true, message: "Assessment email sent successfully" });
  } catch (error) {
    console.error("Send assessment email error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
