export interface AlertSignupState {
    status: 'idle' | 'success' | 'error';
    message: string;
}

export const INITIAL_ALERT_SIGNUP_STATE: AlertSignupState = {
    status: 'idle',
    message: '',
};

/** Signup origins the server accepts; anything else is recorded as "website". */
export const ALERT_SIGNUP_SOURCES = ['investors-page', 'home', 'disclosures', 'thesis', 'website'] as const;
