'use client';

import { useState, FormEvent } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './ContactForm.module.css';

const INVESTOR_TYPES = [
    'Individual Accredited Investor',
    'Family Office',
    'Registered Investment Advisor',
    'Hedge Fund / Asset Manager',
    'Institutional Investor',
    'Strategic Partner',
    'Media / Press',
    'Other',
];

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
    const [state, setState] = useState<FormState>('idle');
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setState('submitting');
        setError('');

        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            company: (form.elements.namedItem('company') as HTMLInputElement).value,
            investorType: (form.elements.namedItem('investorType') as HTMLSelectElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error || 'Submission failed.');
            }
            setState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            setState('error');
        }
    }

    if (state === 'success') {
        return (
            <div className={styles.successBox} role="status">
                <div className={styles.successIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h3>Inquiry Sent</h3>
                <p>
                    Our Investor Relations team has received your message. We will follow up at
                    the email address you provided.
                </p>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
                <Input label="Full Name" name="name" required placeholder="Jane Smith" autoComplete="name" />
                <Input label="Work Email" name="email" type="email" required placeholder="investor@example.com" autoComplete="email" />
            </div>

            <div className={styles.row}>
                <Input label="Company / Organization" name="company" placeholder="Optional" autoComplete="organization" />
                <div className={styles.selectWrapper}>
                    <label className={styles.selectLabel} htmlFor="investorType">Investor Type</label>
                    <select id="investorType" name="investorType" className={styles.select} defaultValue="">
                        <option value="" disabled>Select type…</option>
                        {INVESTOR_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.fieldWrapper}>
                <label className={styles.textareaLabel} htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    className={styles.textarea}
                    rows={5}
                    required
                    placeholder="Tell us about your investment goals, questions about the treasury strategy, or reason for reaching out…"
                />
            </div>

            {state === 'error' && error && (
                <p className={styles.errorMsg} role="alert">{error}</p>
            )}

            <Button type="submit" size="lg" disabled={state === 'submitting'}>
                {state === 'submitting' ? 'Sending…' : 'Send Inquiry'}
            </Button>
        </form>
    );
}
