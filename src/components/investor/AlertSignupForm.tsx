'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
    INITIAL_ALERT_SIGNUP_STATE,
    subscribeInvestorAlertsAction,
} from '@/app/investors/actions';
import styles from './AlertSignupForm.module.css';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" size="md" disabled={pending}>
            {pending ? 'Submitting...' : 'Subscribe'}
        </Button>
    );
}

export function AlertSignupForm() {
    const [state, formAction] = useActionState(
        subscribeInvestorAlertsAction,
        INITIAL_ALERT_SIGNUP_STATE,
    );

    return (
        <form className={styles.form} action={formAction}>
            <p className={styles.formHint}>
                Receive treasury updates, disclosure releases, and investor event announcements.
            </p>
            <Input
                label="Work Email"
                type="email"
                name="email"
                placeholder="investor@example.com"
                required
                autoComplete="email"
            />
            <div className={styles.actions}>
                <SubmitButton />
                {state.message ? (
                    <p
                        className={`${styles.feedback} ${
                            state.status === 'success' ? styles.feedbackSuccess : styles.feedbackError
                        }`.trim()}
                        role="status"
                    >
                        {state.message}
                    </p>
                ) : null}
            </div>
        </form>
    );
}
