// Kept out of actions.ts on purpose: a 'use server' file may only export async
// functions, and exporting this object from it makes every call to the action
// fail at runtime.
export interface AlertSignupState {
    status: 'idle' | 'success' | 'error';
    message: string;
    /** On an error, the address as typed, so the form can keep it for a retry. */
    email?: string;
}

/** Where a signup can come from. Anything else is recorded as 'investors-page'. */
export const ALERT_SIGNUP_SOURCES = ['investors-page', 'thesis', 'home', 'disclosures'] as const;

export const INITIAL_ALERT_SIGNUP_STATE: AlertSignupState = {
    status: 'idle',
    message: '',
};
