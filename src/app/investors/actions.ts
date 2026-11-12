'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { isValidEmailAddress } from '@/lib/email-address';
import { checkRateLimit } from '@/lib/rate-limit';
import { ALERT_SIGNUP_SOURCES, type AlertSignupState } from './alert-signup-state';

// This action is public and sends email, so it is throttled in two ways.
//
// Per visitor: counted in memory, so each server instance keeps its own count.
// That is enough to stop one client hammering the form, but not a guarantee.
const CLIENT_LIMIT = 5;
const CLIENT_WINDOW_MS = 15 * 60 * 1000;

// Site-wide: new subscriptions per hour, counted in the database so the limit
// holds across instances. This is the hard ceiling on confirmation emails.
const SITE_LIMIT = 30;
const SITE_WINDOW_MS = 60 * 60 * 1000;

// One answer for every successful signup, whether the address is new, already
// on the list, or the confirmation email could not be sent. A different answer
// per case would let anyone test whether a given address is subscribed; a
// confirmation that fails is recorded in the server log instead.
const SUBSCRIBED: AlertSignupState = {
    status: 'success',
    message: 'Confirmed. You\'ll receive treasury updates, disclosures, and investor event announcements.',
};

const RATE_LIMITED: AlertSignupState = {
    status: 'error',
    message: 'Too many signup requests right now. Please try again later.',
};

async function getClientKey() {
    const requestHeaders = await headers();
    // Vercel sets both headers itself and overwrites anything the client sends.
    const ip = requestHeaders.get('x-real-ip')
        || requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
        || 'unknown';

    return `alert-signup:${ip}`;
}

export async function subscribeInvestorAlertsAction(
    _prevState: AlertSignupState,
    formData: FormData,
    source?: string,
): Promise<AlertSignupState> {
    const email = String(formData.get('email') ?? '').trim().toLowerCase();

    // Errors hand the typed address back so the form can keep it for a retry.
    const typed = String(formData.get('email') ?? '').trim().slice(0, 254);

    if (!isValidEmailAddress(email)) {
        return {
            status: 'error',
            message: 'Enter a valid email address to receive investor alerts.',
            email: typed,
        };
    }

    if (!checkRateLimit(await getClientKey(), CLIENT_LIMIT, CLIENT_WINDOW_MS).allowed) {
        return { ...RATE_LIMITED, email: typed };
    }

    // `source` arrives with the request, so only known values are stored or mailed.
    const signupSource = (ALERT_SIGNUP_SOURCES as readonly string[]).includes(source ?? '')
        ? (source as string)
        : 'investors-page';
    let isNewSubscription = false;

    try {
        // Checked before looking the address up, so the answer is the same
        // whether or not it is already subscribed.
        const recentSignups = await prisma.investorAlert.count({
            where: { subscribedAt: { gte: new Date(Date.now() - SITE_WINDOW_MS) } },
        });

        if (recentSignups >= SITE_LIMIT) {
            return { ...RATE_LIMITED, email: typed };
        }

        // Only the request that actually creates or reactivates the row gets a
        // count of 1, so an address that is already subscribed, or submitted
        // twice at once, is not emailed again.
        const created = await prisma.investorAlert.createMany({
            data: [{ email, source: signupSource, isActive: true }],
            skipDuplicates: true,
        });
        // A reactivation is stamped as a new subscription so it counts toward
        // the site-wide limit above, like any other signup that sends mail.
        const reactivated = created.count === 0
            ? await prisma.investorAlert.updateMany({
                where: { email, isActive: false },
                data: { isActive: true, subscribedAt: new Date() },
            })
            : { count: 0 };

        isNewSubscription = created.count > 0 || reactivated.count > 0;
    } catch {
        return {
            status: 'error',
            message: 'Unable to submit signup right now. Please try again shortly.',
            email: typed,
        };
    }

    if (!isNewSubscription) {
        // Already subscribed: same answer, no repeat confirmation.
        return SUBSCRIBED;
    }

    // The subscription is recorded, so neither email decides the answer: a
    // confirmation to the subscriber and a notice to the correspondence inbox.
    // Each send logs its own outcome ([email] ... kind=alert_confirmation).
    await Promise.all([
        emailService.sendAlertConfirmation(email),
        emailService.sendSubscriberNotification(email, signupSource),
    ]);

    return SUBSCRIBED;
}
