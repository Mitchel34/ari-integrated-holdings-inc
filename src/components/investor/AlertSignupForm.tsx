'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CONTACT } from '@/lib/site';
import {
    INITIAL_ALERT_SIGNUP_STATE,
    subscribeInvestorAlertsAction,
} from '@/app/investors/actions';
import styles from './AlertSignupForm.module.css';

interface AlertSignupFormProps {
    /** Recorded with the signup so the CTO knows where it came from. */
    source?: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" size="md" className={styles.submitButton} disabled={pending}>
            {pending ? 'Submitting…' : 'Subscribe'}
        </Button>
    );
}

export function AlertSignupForm({ source = 'investors-page' }: AlertSignupFormProps) {
    const [state, formAction] = useActionState(
        subscribeInvestorAlertsAction,
        INITIAL_ALERT_SIGNUP_STATE,
    );

    const isError = state.status === 'error';
    const isSuccess = state.status === 'success';

    return (
        <form className={styles.form} action={formAction}>
            <input type="hidden" name="source" value={source} />

            <div className={styles.row}>
                <Input
                    label="Email address"
                    type="email"
                    name="email"
                    id="investor-alert-email"
                    placeholder="you@firm.com"
                    autoComplete="email"
                    inputMode="email"
                    required
                    hint={isError ? undefined : 'Treasury updates, disclosure releases, and event notices. Nothing else.'}
                    error={isError ? state.message : undefined}
                />
                <div className={styles.submit}>
                    <SubmitButton />
                </div>
            </div>

            {isSuccess ? (
                <p className={styles.success} role="status">
                    <CheckCircle2 aria-hidden="true" focusable="false" />
                    <span>{state.message}</span>
                </p>
            ) : null}

            <p className={styles.fine}>
                Signups are recorded and routed to {CONTACT.name}, {CONTACT.title}. A confirmation is sent to the
                address you enter.
            </p>
        </form>
    );
}
