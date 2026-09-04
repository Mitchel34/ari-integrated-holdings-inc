export interface AlertSignupState {
    status: 'idle' | 'success' | 'error';
    message: string;
}

export const INITIAL_ALERT_SIGNUP_STATE: AlertSignupState = {
    status: 'idle',
    message: '',
};

/**
 * Signup origins the server accepts; anything else is recorded as "website".
 * 'disclosures' is kept only so records created before the section was renamed
 * to Company Updates stay valid.
 */
export const ALERT_SIGNUP_SOURCES = ['investors-page', 'home', 'updates', 'disclosures', 'thesis', 'website'] as const;
