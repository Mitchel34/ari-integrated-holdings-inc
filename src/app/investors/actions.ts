'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import { CONTACT } from '@/lib/site';
import { ALERT_SIGNUP_SOURCES, type AlertSignupState } from '@/components/investor/alert-state';

// Five signups per hour per client mirrors the contact form.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isValidEmailAddress(email: string) {
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function clientKey(): Promise<string> {
    const h = await headers();
    const forwarded = h.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
    return `alerts:${ip}`;
}

export async function subscribeInvestorAlertsAction(
    _prevState: AlertSignupState,
    formData: FormData,
): Promise<AlertSignupState> {
    // Honeypot: real users never see or fill this field. Pretend success for bots.
    const honeypot = String(formData.get('website') ?? '').trim();
    if (honeypot) {
        return { status: 'success', message: 'Confirmed. Check your inbox for a confirmation email.' };
    }

    const rateLimit = checkRateLimit(await clientKey(), RATE_LIMIT, RATE_WINDOW_MS);
    if (!rateLimit.allowed) {
        return {
            status: 'error',
            message: 'Too many signup attempts from this connection. Please try again later.',
        };
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

    let isNew = false;
    try {
        const existing = await prisma.investorAlert.findUnique({ where: { email } });

        if (existing && !existing.isActive) {
            // Deactivated by an executive: do not silently re-enable.
            return {
                status: 'error',
                message: `This address was previously unsubscribed. Email ${CONTACT.email} to re-enable alerts.`,
            };
        }

        if (!existing) {
            await prisma.investorAlert.create({ data: { email, source, isActive: true } });
            isNew = true;
        }
    } catch {
        return {
            status: 'error',
            message: 'Unable to submit signup right now. Please try again shortly.',
        };
    }

    // Confirmation to the subscriber and a routing notice to the CTO for new signups.
    // Neither should block a successful signup.
    await Promise.allSettled([
        emailService.sendAlertConfirmation(email),
        ...(isNew ? [emailService.sendSubscriberNotification(email, source)] : []),
    ]);

    return {
        status: 'success',
        message: "Confirmed. You'll receive treasury updates, disclosures, and investor event announcements.",
    };
}
