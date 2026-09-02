'use server';

import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';

export interface AlertSignupState {
    status: 'idle' | 'success' | 'error';
    message: string;
}

export const INITIAL_ALERT_SIGNUP_STATE: AlertSignupState = {
    status: 'idle',
    message: '',
};

function isValidEmailAddress(email: string) {
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function subscribeInvestorAlertsAction(
    _prevState: AlertSignupState,
    formData: FormData,
    source?: string,
): Promise<AlertSignupState> {
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const signupSource = source ?? String(formData.get('source') ?? '').trim() ?? 'investors-page';

    if (!isValidEmailAddress(email)) {
        return {
            status: 'error',
            message: 'Enter a valid email address to receive investor alerts.',
        };
    }

    try {
        await prisma.investorAlert.upsert({
            where: { email },
            update: { isActive: true },
            create: { email, source: signupSource || 'investors-page', isActive: true },
        });
    } catch {
        return {
            status: 'error',
            message: 'Unable to submit signup right now. Please try again shortly.',
        };
    }

    // Confirmation to the subscriber and a routing notice to the CTO.
    // Neither should block a successful signup.
    await Promise.allSettled([
        emailService.sendAlertConfirmation(email),
        emailService.sendSubscriberNotification(email, signupSource || 'investors-page'),
    ]);

    return {
        status: 'success',
        message: "Confirmed. You'll receive treasury updates, disclosures, and investor event announcements.",
    };
}
