import { Resend } from 'resend';
import { CONTACT, SITE, getSiteUrl } from './site';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM = process.env.RESEND_FROM_EMAIL || `no-reply@${SITE.domain}`;
const FROM_NAME = process.env.RESEND_FROM_NAME || SITE.name;

/**
 * Destination for all inbound correspondence.
 * Defaults to the CTO. `CORRESPONDENCE_EMAIL` may override it per deployment.
 */
export const CORRESPONDENCE_EMAIL = process.env.CORRESPONDENCE_EMAIL || CONTACT.email;

interface SendOptions {
    replyTo?: string;
}

/** Escape user-supplied text before interpolating it into HTML email bodies. */
export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function send(
    to: string | string[],
    subject: string,
    html: string,
    options: SendOptions = {},
): Promise<boolean> {
    const recipients = Array.isArray(to) ? to : [to];

    if (!resend) {
        console.log(`[Email] To: ${recipients.join(', ')} | Subject: ${subject}\n(Set RESEND_API_KEY to enable real delivery)`);
        return true;
    }

    const { error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM}>`,
        to: recipients,
        subject,
        html,
        ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });

    if (error) {
        console.error('[Email] Resend error:', error);
        return false;
    }
    return true;
}

// ── Shared template pieces ────────────────────────────────────────────────

const BRAND_BG = '#070d1a';
const BRAND_GOLD = '#E8C87A';
const TEXT_MUTED = '#9fb0c7';
const TEXT_FAINT = '#5b6b84';

function shell(inner: string, footer: string): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    ${inner}
    <p style="color:${TEXT_FAINT};font-size:12px;text-align:center;margin-top:24px;line-height:1.6">
      ${footer}
    </p>
  </div>
</body>
</html>`;
}

function heading(eyebrow: string, title: string, sub?: string): string {
    return `
    <div style="text-align:center;margin-bottom:32px">
      <p style="color:${BRAND_GOLD};font-size:12px;letter-spacing:0.14em;text-transform:uppercase;margin:0">${eyebrow}</p>
      <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:8px 0 0;letter-spacing:-0.01em">${title}</h1>
      ${sub ? `<p style="color:${TEXT_MUTED};font-size:15px;margin:8px 0 0">${sub}</p>` : ''}
    </div>`;
}

function panel(inner: string): string {
    return `
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:16px;padding:32px">
      ${inner}
    </div>`;
}

function button(href: string, label: string): string {
    return `
    <div style="text-align:center;margin-top:24px">
      <a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#E8C87A,#B58E3F);color:#0A1324;font-weight:700;font-size:14px;padding:13px 30px;border-radius:10px;text-decoration:none">${label}</a>
    </div>`;
}

function row(label: string, value: string): string {
    return `<tr>
      <td style="padding:8px 0;color:${TEXT_FAINT};width:140px;vertical-align:top;font-size:14px">${label}</td>
      <td style="padding:8px 0;color:#f4f7fb;font-size:15px">${value}</td>
    </tr>`;
}

// ── Public API ────────────────────────────────────────────────────────────

export const emailService = {
    /** Plain text convenience wrapper. */
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        return send(to, subject, `<pre style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(body)}</pre>`);
    },

    async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
        const subject = `Welcome to ${SITE.shortName} — Investor Portal Access`;
        const html = shell(
            heading(SITE.name, `Welcome, ${escapeHtml(name)}`) +
            panel(`
              <p style="color:${TEXT_MUTED};font-size:16px;line-height:1.6;margin:0 0 20px">
                Your investor portal access is now active. You can review treasury snapshots, disclosures, and investor documents at any time.
              </p>
              <p style="color:${TEXT_MUTED};font-size:16px;line-height:1.6;margin:0">
                Questions about the treasury strategy or a briefing request can be sent directly to ${CONTACT.name}, ${CONTACT.title}, at
                <a href="${CONTACT.mailto}" style="color:${BRAND_GOLD};text-decoration:none">${CONTACT.email}</a>.
              </p>
              ${button(`${getSiteUrl()}/investor/dashboard`, 'Access Your Portal')}
            `),
            `${SITE.name} &mdash; ${SITE.tagline}<br>This email was sent to ${escapeHtml(to)}. If you did not create an account, please disregard this message.`,
        );
        return send(to, subject, html, { replyTo: CORRESPONDENCE_EMAIL });
    },

    async sendAlertConfirmation(to: string): Promise<boolean> {
        const subject = `You're subscribed to ${SITE.shortName} investor alerts`;
        const html = shell(
            heading(SITE.name, 'Alert Subscription Confirmed') +
            panel(`
              <p style="color:${TEXT_MUTED};font-size:16px;line-height:1.6;margin:0 0 20px">
                <strong style="color:${BRAND_GOLD}">${escapeHtml(to)}</strong> has been added to the investor alert list.
              </p>
              <p style="color:${TEXT_MUTED};font-size:16px;line-height:1.6;margin:0">
                You will receive treasury updates, disclosure releases, and investor event announcements as they are published.
                To unsubscribe, reply to any alert email or write to
                <a href="${CONTACT.mailto}" style="color:${BRAND_GOLD};text-decoration:none">${CONTACT.email}</a>.
              </p>
            `),
            `${SITE.name} &mdash; Digital assets involve significant risk.<br>This is not investment advice. Alerts are for informational purposes only.`,
        );
        return send(to, subject, html, { replyTo: CORRESPONDENCE_EMAIL });
    },

    /** Internal notification to the CTO when a new investor subscribes to alerts. */
    async sendSubscriberNotification(subscriberEmail: string, source?: string): Promise<boolean> {
        const subject = `New investor alert subscriber — ${subscriberEmail}`;
        const html = shell(
            heading('Investor Alerts', 'New Subscriber') +
            panel(`
              <table style="width:100%;border-collapse:collapse">
                ${row('Email', `<a href="mailto:${escapeHtml(subscriberEmail)}" style="color:${BRAND_GOLD};text-decoration:none">${escapeHtml(subscriberEmail)}</a>`)}
                ${row('Source', escapeHtml(source || 'website'))}
                ${row('Received', escapeHtml(new Date().toUTCString()))}
              </table>
              ${button(`${getSiteUrl()}/executive/subscribers`, 'Manage Subscribers')}
            `),
            `Routed to ${CONTACT.name}, ${CONTACT.title}.`,
        );
        return send(CORRESPONDENCE_EMAIL, subject, html);
    },

    async sendTreasuryUpdateAlert(to: string[], subject: string, summary: string): Promise<boolean> {
        const html = shell(
            heading(`${SITE.shortName} — Investor Update`, escapeHtml(subject)) +
            panel(`<div style="color:${TEXT_MUTED};font-size:16px;line-height:1.7;white-space:pre-wrap">${escapeHtml(summary)}</div>`) +
            button(`${getSiteUrl()}/disclosures`, 'View Full Disclosures'),
            `You are receiving this because you subscribed to ${SITE.shortName} investor alerts.<br>Reply to this email to unsubscribe. This is not investment advice.`,
        );
        return send(to, subject, html, { replyTo: CORRESPONDENCE_EMAIL });
    },

    async sendMeetingSummary(to: string, topic: string, summary: string): Promise<boolean> {
        const subject = `Meeting Summary: ${topic}`;
        const html = shell(
            heading(SITE.name, 'Meeting Summary', escapeHtml(topic)) +
            panel(`<div style="color:${TEXT_MUTED};font-size:16px;line-height:1.7;white-space:pre-wrap">${escapeHtml(summary)}</div>`),
            `${SITE.name} &mdash; Confidential. For addressee only.`,
        );
        return send(to, subject, html, { replyTo: CORRESPONDENCE_EMAIL });
    },

    /** Sends a prepared HTML notification; callers are responsible for escaping. */
    async sendMeetingNotification(to: string[], subject: string, html: string): Promise<boolean> {
        return send(to, subject, html, { replyTo: CORRESPONDENCE_EMAIL });
    },

    /** Contact-form inquiry. Delivered to the CTO with reply-to set to the sender. */
    async sendContactInquiry(opts: {
        name: string;
        email: string;
        company?: string;
        investorType?: string;
        message: string;
    }): Promise<boolean> {
        const safe = {
            name: escapeHtml(opts.name),
            email: escapeHtml(opts.email),
            company: opts.company ? escapeHtml(opts.company) : '',
            investorType: opts.investorType ? escapeHtml(opts.investorType) : '',
            message: escapeHtml(opts.message),
        };
        const subject = `Website inquiry — ${opts.name}${opts.company ? ` (${opts.company})` : ''}`;
        const html = shell(
            heading('Website Correspondence', 'New Inquiry', `Routed to ${CONTACT.name}, ${CONTACT.title}`) +
            panel(`
              <table style="width:100%;border-collapse:collapse">
                ${row('Name', `<strong>${safe.name}</strong>`)}
                ${row('Email', `<a href="mailto:${safe.email}" style="color:${BRAND_GOLD};text-decoration:none">${safe.email}</a>`)}
                ${safe.company ? row('Company', safe.company) : ''}
                ${safe.investorType ? row('Investor type', safe.investorType) : ''}
                ${row('Received', escapeHtml(new Date().toUTCString()))}
              </table>
              <div style="margin-top:18px;padding:18px;background:rgba(232,200,122,0.07);border:1px solid rgba(232,200,122,0.2);border-radius:12px">
                <p style="color:${BRAND_GOLD};font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em">Message</p>
                <p style="color:#f4f7fb;font-size:15px;line-height:1.65;white-space:pre-wrap;margin:0">${safe.message}</p>
              </div>
              <p style="color:${TEXT_FAINT};font-size:13px;margin:18px 0 0">Reply directly to this email to respond to ${safe.name}.</p>
            `),
            `Submitted through the contact form at ${getSiteUrl()}/contact.`,
        );
        return send(CORRESPONDENCE_EMAIL, subject, html, { replyTo: opts.email });
    },
};
