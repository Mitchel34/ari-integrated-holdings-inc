// Kept out of actions.ts on purpose: a 'use server' file may only export async
// functions, and exporting this object from it makes every call to the action
// fail at runtime.
export interface AlertSignupState {
    status: 'idle' | 'success' | 'error';
    message: string;
}

export const INITIAL_ALERT_SIGNUP_STATE: AlertSignupState = {
    status: 'idle',
    message: '',
};
