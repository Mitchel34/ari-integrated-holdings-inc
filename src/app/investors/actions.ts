'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import { CONTACT } from '@/lib/site';
import { ALERT_SIGNUP_SOURCES, type AlertSignupState } from '@/components/investor/alert-state';

// This action is public and sends email, so it is throttled in two ways.
//
// Per client: counted in memory, so each server instance keeps its own count.
// Enough to stop one client hammering the form, but not a guarantee.
const CLIENT_LIMIT = 5;
const CLIENT_WINDOW_MS = 15 * 60 * 1000;

// Site-wide: new subscriptions per hour, counted in the database so the limit
// holds across instances. This is the hard ceiling on confirmation emails.
const SITE_LIMIT = 30;
const SITE_WINDOW_MS = 60 * 60 * 1000;

const SUBSCRIBED: AlertSignupState = {
    status: 'success',
    message: "Confirmed. You'll receive company updates and investor event announcements.",
};

const SUBSCRIBED_UNCONFIRMED: AlertSignupState = {
    status: 'success',
    message:
        "You're on the list. We could not send a confirmation email right now, but you'll receive company updates and investor event announcements.",
};

const RATE_LIMITED: AlertSignupState = {
    status: 'error',
    message: 'Too many signup requests right now. Please try again later.',
};

function isValidEmailAddress(email: string) {
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function clientKey(): Promise<string> {
    const h = await headers();
    // Vercel sets both headers itself and overwrites anything the client sends.
    const ip = h.get('x-real-ip')
        || h.get('x-forwarded-for')?.split(',')[0]?.trim()
        || 'unknown';
    return `alerts:${ip}`;
}

export async function subscribeInvestorAlertsAction(
    _prevState: AlertSignupState,
    formData: FormData,
): Promise<AlertSignupState> {
    // Honeypot: real users never see or fill this field. Pretend success for bots.
    const honeypot = String(formData.get('website') ?? '').trim();
    if (honeypot) {
        return SUBSCRIBED;
    }

    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const requestedSource = String(formData.get('source') ?? '').trim();
    const source = (ALERT_SIGNUP_SOURCES as readonly string[]).includes(requestedSource) ? requestedSource : 'website';

    if (!isValidEmailAddress(email)) {
        return {
            status: 'error',
            message: 'Enter a valid email address to receive investor alerts.',
        };
    }

    // Counted after validation so mistyped addresses do not use up the allowance.
    if (!checkRateLimit(await clientKey(), CLIENT_LIMIT, CLIENT_WINDOW_MS).allowed) {
        return RATE_LIMITED;
    }

    try {
        // Checked before looking the address up, so the answer is the same
        // whether or not it is already subscribed.
        const recentSignups = await prisma.investorAlert.count({
            where: { subscribedAt: { gte: new Date(Date.now() - SITE_WINDOW_MS) } },
        });
        if (recentSignups >= SITE_LIMIT) {
            return RATE_LIMITED;
        }

        // Only the request that actually creates the row gets a count of 1, so
        // an address that is already subscribed, or submitted twice at once,
        // is recorded once and emailed once.
        const created = await prisma.investorAlert.createMany({
            data: [{ email, source, isActive: true }],
            skipDuplicates: true,
        });

        if (created.count === 0) {
            const existing = await prisma.investorAlert.findUnique({ where: { email } });
            if (existing && !existing.isActive) {
                // Deactivated by an executive (or unsubscribed): never re-enable silently.
                return {
                    status: 'error',
                    message: `This address was previously unsubscribed. Email ${CONTACT.email} to re-enable alerts.`,
                };
            }
            // Already subscribed: same answer, no repeat confirmation.
            return SUBSCRIBED;
        }
    } catch {
        return {
            status: 'error',
            message: 'Unable to submit signup right now. Please try again shortly.',
        };
    }

    // New subscriber: confirmation to them and a routing notice to the CTO.
    // The subscription is already recorded, so neither email blocks a successful
    // signup, but the response must not claim a confirmation that was never sent.
    const [confirmation] = await Promise.all([
        emailService.sendAlertConfirmation(email),
        emailService.sendSubscriberNotification(email, source),
    ]);

    return confirmation.status === 'accepted' ? SUBSCRIBED : SUBSCRIBED_UNCONFIRMED;
}
