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
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    try {
        await prisma.investorAlert.upsert({
            where: { email },
            update: { isActive: true },
            create: { email, source: source ?? 'investors-page', isActive: true },
        });

        await emailService.sendAlertConfirmation(email);

        return {
            status: 'success',
            message: 'Confirmed. You\'ll receive treasury updates, disclosures, and investor event announcements.',
        };
    } catch {
        return {
            status: 'error',
            message: 'Unable to submit signup right now. Please try again shortly.',
        };
    }
}
