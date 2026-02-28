import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM = process.env.RESEND_FROM_EMAIL || 'no-reply@ariholdings.com';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'ARI Integrated Holdings Inc.';
const IR_EMAIL = process.env.RESEND_IR_EMAIL || 'investor-relations@ariholdings.com';

async function send(to: string | string[], subject: string, html: string): Promise<boolean> {
    if (!resend) {
        console.log(`[Email] To: ${to} | Subject: ${subject}\n(Set RESEND_API_KEY to enable real delivery)`);
        return true;
    }
    const { error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
    });
    if (error) {
        console.error('[Email] Resend error:', error);
        return false;
    }
    return true;
}

export const emailService = {
    /** Legacy single-method interface — preserved for existing call sites */
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        return send(to, subject, `<pre style="font-family:sans-serif">${body}</pre>`);
    },

    async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
        const subject = 'Welcome to ARI Integrated Holdings — Investor Portal Access';
        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A1324;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:#E8C87A;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0">ARI Integrated Holdings Inc.</p>
      <h1 style="color:#fff;font-size:28px;font-weight:700;margin:8px 0 0">Welcome, ${name}</h1>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
      <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 20px">
        Your investor portal access is now active. You can view treasury snapshots, review disclosures, and access investor documents at any time.
      </p>
      <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 28px">
        If you have questions about our treasury strategy or would like to schedule a briefing with the team, reply to this email or visit our contact page.
      </p>
      <div style="text-align:center">
        <a href="${process.env.NEXTAUTH_URL || 'https://ariholdings.com'}/investor/dashboard"
           style="display:inline-block;background:linear-gradient(135deg,#E8C87A,#9E7B36);color:#0A1324;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none">
          Access Your Portal
        </a>
      </div>
    </div>
    <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px;line-height:1.6">
      ARI Integrated Holdings Inc. &mdash; Building the Strategic Reserve of the Digital Age<br>
      This email was sent to ${to}. If you did not create an account, please disregard this message.
    </p>
  </div>
</body>
</html>`;
        return send(to, subject, html);
    },

    async sendAlertConfirmation(to: string): Promise<boolean> {
        const subject = 'You\'re subscribed to ARI Investor Alerts';
        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A1324;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:#E8C87A;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0">ARI Integrated Holdings Inc.</p>
      <h1 style="color:#fff;font-size:24px;font-weight:700;margin:8px 0 0">Alert Subscription Confirmed</h1>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
      <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 20px">
        <strong style="color:#E8C87A">${to}</strong> has been added to our investor alert list.
      </p>
      <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0">
        You will receive treasury updates, disclosure releases, and investor event announcements as they are published. You can unsubscribe at any time by replying to any alert email.
      </p>
    </div>
    <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px;line-height:1.6">
      ARI Integrated Holdings Inc. &mdash; Digital assets involve significant risk.<br>
      This is not investment advice. Alerts are for informational purposes only.
    </p>
  </div>
</body>
</html>`;
        return send(to, subject, html);
    },

    async sendTreasuryUpdateAlert(to: string[], subject: string, summary: string): Promise<boolean> {
        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A1324;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:#E8C87A;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0">ARI Integrated Holdings — Investor Update</p>
      <h1 style="color:#fff;font-size:24px;font-weight:700;margin:8px 0 0">${subject}</h1>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
      <div style="color:#94a3b8;font-size:16px;line-height:1.7;white-space:pre-wrap">${summary}</div>
    </div>
    <div style="text-align:center;margin-top:24px">
      <a href="${process.env.NEXTAUTH_URL || 'https://ariholdings.com'}/disclosures"
         style="display:inline-block;background:linear-gradient(135deg,#E8C87A,#9E7B36);color:#0A1324;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none">
        View Full Disclosures
      </a>
    </div>
    <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px;line-height:1.6">
      You are receiving this because you subscribed to ARI Investor Alerts.<br>
      Reply to this email to unsubscribe. This is not investment advice.
    </p>
  </div>
</body>
</html>`;
        return send(to, subject, html);
    },

    async sendMeetingSummary(to: string, topic: string, summary: string): Promise<boolean> {
        const subject = `Meeting Summary: ${topic}`;
        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A1324;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:#E8C87A;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0">ARI Integrated Holdings Inc.</p>
      <h1 style="color:#fff;font-size:24px;font-weight:700;margin:8px 0 0">Meeting Summary</h1>
      <p style="color:#94a3b8;font-size:15px;margin:8px 0 0">${topic}</p>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
      <div style="color:#94a3b8;font-size:16px;line-height:1.7;white-space:pre-wrap">${summary}</div>
    </div>
    <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px">
      ARI Integrated Holdings Inc. &mdash; Confidential. For addressee only.
    </p>
  </div>
</body>
</html>`;
        return send(to, subject, html);
    },

    async sendContactInquiry(opts: {
        name: string;
        email: string;
        company?: string;
        investorType?: string;
        message: string;
    }): Promise<boolean> {
        const subject = `Investor Inquiry — ${opts.name}${opts.company ? ` (${opts.company})` : ''}`;
        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px">
    <h2 style="color:#0A1324;margin:0 0 24px">New Investor Inquiry</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#64748b;width:130px;vertical-align:top">Name</td><td style="padding:8px 0;color:#0f172a;font-weight:600">${opts.name}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Email</td><td style="padding:8px 0;color:#0f172a"><a href="mailto:${opts.email}">${opts.email}</a></td></tr>
      ${opts.company ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Company</td><td style="padding:8px 0;color:#0f172a">${opts.company}</td></tr>` : ''}
      ${opts.investorType ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Investor Type</td><td style="padding:8px 0;color:#0f172a">${opts.investorType}</td></tr>` : ''}
    </table>
    <div style="margin-top:16px;padding:16px;background:#f1f5f9;border-radius:8px">
      <p style="color:#64748b;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em">Message</p>
      <p style="color:#0f172a;white-space:pre-wrap;margin:0">${opts.message}</p>
    </div>
  </div>
</body>
</html>`;
        return send(IR_EMAIL, subject, html);
    },
};
