'use server';

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
): Promise<AlertSignupState> {
    const email = String(formData.get('email') ?? '').trim().toLowerCase();

    if (!isValidEmailAddress(email)) {
        return {
            status: 'error',
            message: 'Enter a valid email address to receive investor alerts.',
        };
    }

    try {
        await emailService.sendEmail(
            'investor-relations@ari-integrated.com',
            'Investor Alerts Signup Request',
            `New investor alert signup requested for: ${email}`,
        );

        return {
            status: 'success',
            message: 'Signup received. Investor Relations will include this email in update notifications.',
        };
    } catch {
        return {
            status: 'error',
            message: 'Unable to submit signup right now. Please try again shortly.',
        };
    }
}
