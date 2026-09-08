import { Resend } from 'resend';
import { CONTACT, SITE, getSiteUrl } from './site';

/**
 * Destination for all inbound correspondence.
 * Defaults to the CTO. `CORRESPONDENCE_EMAIL` may override it per deployment.
 */
export const CORRESPONDENCE_EMAIL = process.env.CORRESPONDENCE_EMAIL || CONTACT.email;

// ── Outcomes ──────────────────────────────────────────────────────────────

export type SendFailureReason = 'not_configured' | 'rejected' | 'transport';

/**
 * Result of handing one message to the email provider.
 *
 * - `accepted`: the provider queued the message and returned an id. This is
 *   provider acceptance, not proof that the message reached an inbox.
 * - `dry-run`: `EMAIL_DRY_RUN` is set in a non-production build; nothing was
 *   sent. Callers must never present this as a delivery.
 * - `failed`: nothing was sent. Callers must surface this to the user.
 */
export type SendOutcome =
    | { status: 'accepted'; id: string | null }
    | { status: 'dry-run' }
    | { status: 'failed'; reason: SendFailureReason; message: string };

export interface BulkSendResult {
    /** Messages accepted by the provider. */
    sent: number;
    /** Messages the provider refused, or that were never attempted because delivery is unavailable. */
    failed: number;
    /** True when nothing was sent because `EMAIL_DRY_RUN` is set (never true in production). */
    dryRun: boolean;
    /** Why nothing could be attempted, when that is the case. */
    reason?: SendFailureReason;
}

// ── Configuration ─────────────────────────────────────────────────────────

function isProductionBuild(): boolean {
    return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

/**
 * Opt-in local mode: log what would be sent and report it as NOT delivered.
 * Ignored in production builds so a misconfigured deployment can never fake a
 * successful send.
 */
export function isEmailDryRun(): boolean {
    const flag = (process.env.EMAIL_DRY_RUN ?? '').trim().toLowerCase();
    return (flag === '1' || flag === 'true') && !isProductionBuild();
}

function fromEmail(): string {
    return process.env.RESEND_FROM_EMAIL?.trim() || `no-reply@${SITE.domain}`;
}

function fromName(): string {
    return process.env.RESEND_FROM_NAME?.trim() || SITE.name;
}

function fromHeader(): string {
    return `${fromName()} <${fromEmail()}>`;
}

let cachedClient: { key: string; client: Resend } | null = null;

/** Resend client, created on first use so the key is read at request time, never at build time. */
function getClient(): Resend | null {
    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) {
        return null;
    }
    if (!cachedClient || cachedClient.key !== key) {
        cachedClient = { key, client: new Resend(key) };
    }
    return cachedClient.client;
}

export interface EmailConfigStatus {
    provider: 'resend';
    /** `RESEND_API_KEY` is present. Its value is never reported. */
    apiKeyConfigured: boolean;
    /** `EMAIL_DRY_RUN` is set and honoured (non-production only). */
    dryRun: boolean;
    /** The From header that outbound mail will carry. */
    from: string;
    fromEmailOverridden: boolean;
    fromNameOverridden: boolean;
    /** Where contact inquiries and internal notices are routed. */
    correspondenceEmail: string;
    /** True when `CORRESPONDENCE_EMAIL` redirects mail away from the CTO default. */
    correspondenceOverridden: boolean;
}

/** Presence-only view of the delivery configuration. Contains no secret values. */
export function getEmailConfigStatus(): EmailConfigStatus {
    return {
        provider: 'resend',
        apiKeyConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
        dryRun: isEmailDryRun(),
        from: fromHeader(),
        fromEmailOverridden: Boolean(process.env.RESEND_FROM_EMAIL?.trim()),
        fromNameOverridden: Boolean(process.env.RESEND_FROM_NAME?.trim()),
        correspondenceEmail: CORRESPONDENCE_EMAIL,
        correspondenceOverridden: CORRESPONDENCE_EMAIL !== CONTACT.email,
    };
}

// ── Helpers ───────────────────────────────────────────────────────────────

/** Escape user-supplied text before interpolating it into HTML email bodies. */
export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A validated Reply-To address, or undefined when the value is not usable as one. */
function safeReplyTo(address: string | undefined): string | undefined {
    const value = address?.trim() ?? '';
    return value.length > 0 && value.length <= 254 && EMAIL_ADDRESS.test(value) ? value : undefined;
}

/** Keep mailboxes out of logs while still showing where a message went. */
function maskAddress(address: string): string {
    const at = address.indexOf('@');
    if (at <= 0) {
        return '***';
    }
    return `${address[0]}***${address.slice(at)}`;
}

/** Provider tag values allow only ASCII letters, digits, underscores, and dashes. */
const TAG_VALUE = /^[A-Za-z0-9_-]{1,256}$/;

interface SendOptions {
    /** Short label for logs and provider tags. Never user content. */
    kind: string;
    replyTo?: string;
    /** Correlation id recorded in logs and provider metadata so a message can be traced end to end. */
    reference?: string;
}

function logEmail(level: 'log' | 'warn' | 'error', event: string, options: SendOptions, detail: string): void {
    console[level](`[email] ${event} kind=${options.kind} ref=${options.reference ?? '-'} ${detail}`);
}

// ── Transport ─────────────────────────────────────────────────────────────

async function send(
    to: string | string[],
    subject: string,
    html: string,
    options: SendOptions,
): Promise<SendOutcome> {
    const recipients = (Array.isArray(to) ? to : [to]).map((r) => r.trim()).filter(Boolean);
    const target = recipients.map(maskAddress).join(',');

    if (recipients.length === 0) {
        logEmail('error', 'rejected', options, 'message="no recipients"');
        return { status: 'failed', reason: 'rejected', message: 'No recipients were given.' };
    }

    if (isEmailDryRun()) {
        logEmail('warn', 'dry-run', options, `to=${target} subject="${subject}" (EMAIL_DRY_RUN is set; nothing was sent)`);
        return { status: 'dry-run' };
    }

    const client = getClient();
    if (!client) {
        logEmail('error', 'not_configured', options, `to=${target} (RESEND_API_KEY is not set; nothing was sent)`);
        return {
            status: 'failed',
            reason: 'not_configured',
            message: 'Email delivery is not configured: RESEND_API_KEY is missing.',
        };
    }

    const replyTo = safeReplyTo(options.replyTo);
    const tags = [{ name: 'kind', value: options.kind }];
    const reference = options.reference && TAG_VALUE.test(options.reference) ? options.reference : undefined;
    if (reference) {
        tags.push({ name: 'reference', value: reference });
    }

    try {
        const { data, error } = await client.emails.send({
            from: fromHeader(),
            to: recipients,
            subject,
            html,
            tags,
            ...(replyTo ? { replyTo } : {}),
            ...(reference ? { headers: { 'X-Entity-Ref-ID': reference } } : {}),
        });

        if (error) {
            logEmail(
                'error',
                'rejected',
                options,
                `to=${target} provider_error=${error.name} status=${error.statusCode ?? '-'} message="${error.message}"`,
            );
            return { status: 'failed', reason: 'rejected', message: error.message };
        }

        logEmail('log', 'accepted', options, `to=${target} id=${data.id}`);
        return { status: 'accepted', id: data.id ?? null };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logEmail('error', 'transport', options, `to=${target} message="${message}"`);
        return { status: 'failed', reason: 'transport', message };
    }
}

const BATCH_SIZE = 100;

/**
 * Deliver the same message to many recipients as SEPARATE emails, so no
 * subscriber ever sees another subscriber's address. Uses Resend's batch API
 * in chunks and falls back to individual sends if a batch is rejected.
 */
async function sendEach(
    recipients: string[],
    subject: string,
    html: string,
    options: SendOptions,
): Promise<BulkSendResult> {
    const unique = Array.from(new Set(recipients.map((r) => r.trim().toLowerCase()).filter(Boolean)));

    if (unique.length === 0) {
        return { sent: 0, failed: 0, dryRun: false };
    }

    if (isEmailDryRun()) {
        logEmail('warn', 'dry-run', options, `recipients=${unique.length} subject="${subject}" (EMAIL_DRY_RUN is set; nothing was sent)`);
        return { sent: 0, failed: 0, dryRun: true };
    }

    const client = getClient();
    if (!client) {
        logEmail('error', 'not_configured', options, `recipients=${unique.length} (RESEND_API_KEY is not set; nothing was sent)`);
        return { sent: 0, failed: unique.length, dryRun: false, reason: 'not_configured' };
    }

    const replyTo = safeReplyTo(options.replyTo);
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < unique.length; i += BATCH_SIZE) {
        const chunk = unique.slice(i, i + BATCH_SIZE);
        const payload = chunk.map((to) => ({
            from: fromHeader(),
            to: [to],
            subject,
            html,
            tags: [{ name: 'kind', value: options.kind }],
            ...(replyTo ? { replyTo } : {}),
        }));

        let batchError: string;
        try {
            const { data, error } = await client.batch.send(payload);
            if (!error) {
                sent += chunk.length;
                logEmail('log', 'batch_accepted', options, `count=${chunk.length} first_id=${data.data[0]?.id ?? '-'}`);
                continue;
            }
            batchError = error.message;
        } catch (err) {
            batchError = err instanceof Error ? err.message : String(err);
        }

        logEmail('error', 'batch_failed', options, `count=${chunk.length} message="${batchError}" (retrying individually)`);
        for (const to of chunk) {
            const outcome = await send(to, subject, html, options);
            if (outcome.status === 'accepted') {
                sent += 1;
            } else {
                failed += 1;
            }
        }
    }

    return { sent, failed, dryRun: false };
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
    async sendWelcomeEmail(to: string, name: string): Promise<SendOutcome> {
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
        return send(to, subject, html, { kind: 'welcome', replyTo: CORRESPONDENCE_EMAIL });
    },

    async sendAlertConfirmation(to: string): Promise<SendOutcome> {
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
        return send(to, subject, html, { kind: 'alert_confirmation', replyTo: CORRESPONDENCE_EMAIL });
    },

    /** Internal notification to the CTO when a new investor subscribes to alerts. */
    async sendSubscriberNotification(subscriberEmail: string, source?: string): Promise<SendOutcome> {
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
        return send(CORRESPONDENCE_EMAIL, subject, html, { kind: 'subscriber_notice' });
    },

    /** Investor broadcast: one email per subscriber (addresses are never shared). */
    async sendTreasuryUpdateAlert(to: string[], subject: string, summary: string): Promise<BulkSendResult> {
        const html = shell(
            heading(`${SITE.shortName} — Investor Update`, escapeHtml(subject)) +
            panel(`<div style="color:${TEXT_MUTED};font-size:16px;line-height:1.7;white-space:pre-wrap">${escapeHtml(summary)}</div>`) +
            button(`${getSiteUrl()}/disclosures`, 'View Full Disclosures'),
            `You are receiving this because you subscribed to ${SITE.shortName} investor alerts.<br>Reply to this email to unsubscribe. This is not investment advice.`,
        );
        return sendEach(to, subject, html, { kind: 'investor_broadcast', replyTo: CORRESPONDENCE_EMAIL });
    },

    /** Sends a prepared HTML notification; callers are responsible for escaping. */
    async sendMeetingNotification(to: string[], subject: string, html: string): Promise<SendOutcome> {
        return send(to, subject, html, { kind: 'meeting_notification', replyTo: CORRESPONDENCE_EMAIL });
    },

    /**
     * Contact-form inquiry. Delivered to the CTO with Reply-To set to the sender.
     * The reference is shown to the visitor, put in the subject and footer, and
     * recorded with the provider so the message can be traced end to end.
     */
    async sendContactInquiry(opts: {
        name: string;
        email: string;
        company?: string;
        investorType?: string;
        message: string;
        reference: string;
    }): Promise<SendOutcome> {
        const safe = {
            name: escapeHtml(opts.name),
            email: escapeHtml(opts.email),
            company: opts.company ? escapeHtml(opts.company) : '',
            investorType: opts.investorType ? escapeHtml(opts.investorType) : '',
            message: escapeHtml(opts.message),
            reference: escapeHtml(opts.reference),
        };
        const subject = `Website inquiry — ${opts.name}${opts.company ? ` (${opts.company})` : ''} [${opts.reference}]`;
        const html = shell(
            heading('Website Correspondence', 'New Inquiry', `Routed to ${CONTACT.name}, ${CONTACT.title}`) +
            panel(`
              <table style="width:100%;border-collapse:collapse">
                ${row('Name', `<strong>${safe.name}</strong>`)}
                ${row('Email', `<a href="mailto:${safe.email}" style="color:${BRAND_GOLD};text-decoration:none">${safe.email}</a>`)}
                ${safe.company ? row('Company', safe.company) : ''}
                ${safe.investorType ? row('Investor type', safe.investorType) : ''}
                ${row('Reference', `<span style="font-family:monospace">${safe.reference}</span>`)}
                ${row('Received', escapeHtml(new Date().toUTCString()))}
              </table>
              <div style="margin-top:18px;padding:18px;background:rgba(232,200,122,0.07);border:1px solid rgba(232,200,122,0.2);border-radius:12px">
                <p style="color:${BRAND_GOLD};font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em">Message</p>
                <p style="color:#f4f7fb;font-size:15px;line-height:1.65;white-space:pre-wrap;margin:0">${safe.message}</p>
              </div>
              <p style="color:${TEXT_FAINT};font-size:13px;margin:18px 0 0">Reply directly to this email to respond to ${safe.name}.</p>
            `),
            `Submitted through the contact form at ${getSiteUrl()}/contact. Reference ${safe.reference}.`,
        );
        return send(CORRESPONDENCE_EMAIL, subject, html, {
            kind: 'contact_inquiry',
            replyTo: opts.email,
            reference: opts.reference,
        });
    },
};
