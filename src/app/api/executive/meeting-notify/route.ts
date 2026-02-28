import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { emailService } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.role !== "EXECUTIVE" && session.user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch executive emails from database (no hardcoded list)
  const executives = await prisma.user.findMany({
    where: { role: "EXECUTIVE" },
    select: { email: true },
  });
  const executiveEmails = executives.map((e) => e.email).filter(Boolean) as string[];

  if (executiveEmails.length === 0) {
    return NextResponse.json(
      { error: "No executive emails found in database" },
      { status: 404 }
    );
  }

  const body = (await req.json()) as {
    meetingType?: string;
    message?: string;
  };

  const bookedBy = session.user.name || session.user.email || "An executive";
  const meetingType = body.meetingType || "Executive Zoom Meeting";
  const customMessage =
    body.message || "A new executive meeting has been scheduled.";

  const baseUrl = process.env.NEXTAUTH_URL || "https://ariholdings.com";

  const subject = `New Meeting Scheduled: ${meetingType}`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A1324;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:#E8C87A;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0">ARI Integrated Holdings Inc.</p>
      <h1 style="color:#fff;font-size:24px;font-weight:700;margin:8px 0 0">Executive Meeting Scheduled</h1>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr>
          <td style="padding:8px 0;color:#64748b;width:120px;vertical-align:top">Meeting Type</td>
          <td style="padding:8px 0;color:#f8fafc;font-weight:600">${meetingType}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;vertical-align:top">Scheduled By</td>
          <td style="padding:8px 0;color:#f8fafc;font-weight:600">${bookedBy}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;vertical-align:top">Date</td>
          <td style="padding:8px 0;color:#f8fafc">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
        </tr>
      </table>
      <div style="padding:16px;background:rgba(232,200,122,0.08);border:1px solid rgba(232,200,122,0.2);border-radius:10px;margin-bottom:20px">
        <p style="color:#E8C87A;font-size:13px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.04em">Details</p>
        <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0">${customMessage}</p>
      </div>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0">
        Check your Calendly and Zoom accounts for the meeting link and calendar invite.
        You can also view your upcoming meetings on the
        <a href="${baseUrl}/executive/dashboard" style="color:#E8C87A;text-decoration:none;font-weight:600">Executive Dashboard</a>.
      </p>
    </div>
    <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px;line-height:1.6">
      ARI Integrated Holdings Inc. &mdash; Confidential executive communication.<br>
      This notification was sent to all executive team members.
    </p>
  </div>
</body>
</html>`;

  const success = await emailService.sendMeetingNotification(
    executiveEmails,
    subject,
    html
  );

  if (!success) {
    return NextResponse.json(
      { error: "Failed to send email notifications" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    sent: executiveEmails.length,
    recipients: executiveEmails,
  });
}
