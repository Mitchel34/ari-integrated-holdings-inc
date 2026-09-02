import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CORRESPONDENCE_EMAIL, emailService, escapeHtml } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { CONTACT, SITE, getSiteUrl } from "@/lib/site";

const MEETING_TYPE_MAX = 120;
const MESSAGE_MAX = 2000;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.role !== "EXECUTIVE" && session.user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Executive recipients come from the database; the CTO is always included
  // so that every meeting notification reaches the correspondence inbox.
  let executiveEmails: string[] = [];
  try {
    const executives = await prisma.user.findMany({
      where: { role: { in: ["EXECUTIVE", "ADMIN"] } },
      select: { email: true },
    });
    executiveEmails = executives.map((e) => e.email).filter((e): e is string => Boolean(e));
  } catch (error) {
    console.error("[meeting-notify] Could not load executive emails:", error);
  }

  const recipients = Array.from(
    new Set([CORRESPONDENCE_EMAIL, ...executiveEmails].map((e) => e.trim().toLowerCase())),
  );

  let body: { meetingType?: string; message?: string } = {};
  try {
    body = (await req.json()) as { meetingType?: string; message?: string };
  } catch {
    body = {};
  }

  const bookedBy = escapeHtml(session.user.name || session.user.email || "An executive");
  const meetingType = escapeHtml((body.meetingType || "Executive Zoom Meeting").slice(0, MEETING_TYPE_MAX));
  const customMessage = escapeHtml(
    (body.message || "A new executive meeting has been scheduled.").slice(0, MESSAGE_MAX),
  );

  const baseUrl = getSiteUrl();
  const subject = `New Meeting Scheduled: ${meetingType}`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#070d1a;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:#E8C87A;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;margin:0">${SITE.name}</p>
      <h1 style="color:#fff;font-size:24px;font-weight:700;margin:8px 0 0">Executive Meeting Scheduled</h1>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr>
          <td style="padding:8px 0;color:#5b6b84;width:120px;vertical-align:top">Meeting Type</td>
          <td style="padding:8px 0;color:#f8fafc;font-weight:600">${meetingType}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#5b6b84;vertical-align:top">Scheduled By</td>
          <td style="padding:8px 0;color:#f8fafc;font-weight:600">${bookedBy}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#5b6b84;vertical-align:top">Date</td>
          <td style="padding:8px 0;color:#f8fafc">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
        </tr>
      </table>
      <div style="padding:16px;background:rgba(232,200,122,0.08);border:1px solid rgba(232,200,122,0.2);border-radius:10px;margin-bottom:20px">
        <p style="color:#E8C87A;font-size:12px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em">Details</p>
        <p style="color:#9fb0c7;font-size:15px;line-height:1.6;margin:0">${customMessage}</p>
      </div>
      <p style="color:#9fb0c7;font-size:15px;line-height:1.6;margin:0">
        Check your Calendly and Zoom accounts for the meeting link and calendar invite.
        You can also view upcoming meetings on the
        <a href="${baseUrl}/executive/dashboard" style="color:#E8C87A;text-decoration:none;font-weight:600">Executive Dashboard</a>.
      </p>
    </div>
    <p style="color:#5b6b84;font-size:12px;text-align:center;margin-top:24px;line-height:1.6">
      ${SITE.name} &mdash; Confidential executive communication.<br>
      Routed to ${CONTACT.name}, ${CONTACT.title}, and the executive team.
    </p>
  </div>
</body>
</html>`;

  const success = await emailService.sendMeetingNotification(recipients, subject, html);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to send email notifications" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    sent: recipients.length,
    recipients,
  });
}
