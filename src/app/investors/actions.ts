'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import type { AlertSignupState } from './alert-signup-state';

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

const SUBSCRIBED: AlertSignupState = {
    status: 'success',
    message: 'Confirmed. You\'ll receive treasury updates, disclosures, and investor event announcements.',
};

const RATE_LIMITED: AlertSignupState = {
    status: 'error',
    message: 'Too many signup requests right now. Please try again later.',
};

function isValidEmailAddress(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

    if (!isValidEmailAddress(email)) {
        return {
            status: 'error',
            message: 'Enter a valid email address to receive investor alerts.',
        };
    }

    if (!checkRateLimit(await getClientKey(), CLIENT_LIMIT, CLIENT_WINDOW_MS).allowed) {
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

        // Only the request that actually creates or reactivates the row gets a
        // count of 1, so an address that is already subscribed, or submitted
        // twice at once, is not emailed again.
        const created = await prisma.investorAlert.createMany({
            data: [{ email, source: source ?? 'investors-page', isActive: true }],
            skipDuplicates: true,
        });
        const reactivated = created.count === 0
            ? await prisma.investorAlert.updateMany({
                where: { email, isActive: false },
                data: { isActive: true },
            })
            : { count: 0 };

        if (created.count > 0 || reactivated.count > 0) {
            await emailService.sendAlertConfirmation(email);
        }

        return SUBSCRIBED;
    } catch {
        return {
            status: 'error',
            message: 'Unable to submit signup right now. Please try again shortly.',
        };
    }
}
