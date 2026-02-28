'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
    subscribeInvestorAlertsAction,
    INITIAL_ALERT_SIGNUP_STATE,
} from '@/app/investors/actions';
import styles from './ThesisGate.module.css';

const STORAGE_KEY = 'ari_thesis_access';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="md" disabled={pending}>
            {pending ? 'Verifying…' : 'Access Full Thesis'}
        </Button>
    );
}

interface ThesisGateProps {
    children: React.ReactNode;
}

export function ThesisGate({ children }: ThesisGateProps) {
    const [granted, setGranted] = useState<boolean | null>(null);
    const [state, formAction] = useActionState(subscribeInvestorAlertsAction, INITIAL_ALERT_SIGNUP_STATE);

    useEffect(() => {
        setGranted(localStorage.getItem(STORAGE_KEY) === 'true');
    }, []);

    useEffect(() => {
        if (state.status === 'success') {
            localStorage.setItem(STORAGE_KEY, 'true');
            setGranted(true);
        }
    }, [state.status]);

    // Loading state — avoid layout shift
    if (granted === null) {
        return <div style={{ minHeight: '60vh' }} />;
    }

    if (granted) {
        return <>{children}</>;
    }

    return (
        <div className={styles.gateWrapper}>
            {/* Blurred preview */}
            <div className={styles.blurredContent} aria-hidden="true">
                {children}
            </div>

            {/* Gate overlay */}
            <div className={styles.overlay}>
                <div className={styles.gateCard}>
                    <div className={styles.eyebrow}>Investment Thesis</div>
                    <h2 className={styles.gateTitle}>Access the Full Investment Thesis</h2>
                    <p className={styles.gateSubtitle}>
                        Enter your work email to read our complete 7-part treasury strategy,
                        allocation rationale, and 5-year CAGR analysis. You&apos;ll also receive
                        treasury updates and disclosure announcements.
                    </p>

                    <form action={formAction} className={styles.gateForm}>
                        <Input
                            label="Work Email"
                            type="email"
                            name="email"
                            placeholder="investor@example.com"
                            required
                            autoComplete="email"
                        />
                        <SubmitButton />
                        {state.status === 'error' && (
                            <p className={styles.errorMsg} role="alert">{state.message}</p>
                        )}
                    </form>

                    <p className={styles.skip}>
                        Already an investor?{' '}
                        <a href="/login?callbackUrl=/investor/dashboard" className={styles.skipLink}>
                            Sign in to your portal
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
