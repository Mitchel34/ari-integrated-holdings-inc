'use client';

import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CONTACT } from '../../lib/site';
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

/** Mirrors the server-side limits in /api/contact. */
const LIMITS = {
    name: 120,
    email: 254,
    company: 160,
    investorType: 80,
    message: 5000,
} as const;

const RATE_LIMIT_MESSAGE =
    'You have sent several inquiries in a short time. Please wait a little while before trying again, or email us directly.';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
    name?: string;
    email?: string;
    message?: string;
}

function validate(data: { name: string; email: string; message: string }): FieldErrors {
    const errors: FieldErrors = {};
    if (!data.name.trim()) {
        errors.name = 'Enter your full name.';
    }
    if (!data.email.trim()) {
        errors.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }
    if (!data.message.trim()) {
        errors.message = 'Tell us what you want to discuss.';
    }
    return errors;
}

export default function ContactForm() {
    const [state, setState] = useState<FormState>('idle');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');

        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            company: (form.elements.namedItem('company') as HTMLInputElement).value,
            investorType: (form.elements.namedItem('investorType') as HTMLSelectElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
            website: (form.elements.namedItem('website') as HTMLInputElement).value,
        };

        const errors = validate(data);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            setState('error');
            return;
        }

        setState('submitting');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error(RATE_LIMIT_MESSAGE);
                }
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error || 'Submission failed.');
            }
            setState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            setState('error');
        }
    }

    function clearFieldError(field: keyof FieldErrors) {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    if (state === 'success') {
        return (
            <div className={`${styles.success} glass-1`} role="status" aria-live="polite">
                <span className={styles.successIcon} aria-hidden="true">
                    <Check size={20} strokeWidth={2.25} />
                </span>
                <div className={styles.successText}>
                    <p className={styles.successTitle}>Received.</p>
                    <p className={styles.successBody}>
                        {CONTACT.name} will reply {CONTACT.responseWindow}.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
                <Input
                    label="Full name"
                    name="name"
                    required
                    maxLength={LIMITS.name}
                    autoComplete="name"
                    placeholder="Jane Smith"
                    error={fieldErrors.name}
                    onChange={() => clearFieldError('name')}
                />
                <Input
                    label="Email address"
                    name="email"
                    type="email"
                    required
                    maxLength={LIMITS.email}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    error={fieldErrors.email}
                    onChange={() => clearFieldError('email')}
                />
            </div>

            <div className={styles.row}>
                <Input
                    label="Company"
                    name="company"
                    maxLength={LIMITS.company}
                    autoComplete="organization"
                    placeholder="Firm or family office"
                    hint="Optional"
                />
                <Select label="Investor type" name="investorType" defaultValue="" hint="Optional">
                    <option value="" disabled>
                        Select type…
                    </option>
                    {INVESTOR_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </Select>
            </div>

            <Textarea
                label="Message"
                name="message"
                rows={6}
                required
                maxLength={LIMITS.message}
                placeholder="Who you are, your investor type, and what you would like to discuss."
                error={fieldErrors.message}
                onChange={() => clearFieldError('message')}
            />

            {/* Honeypot: hidden from people, filled only by bots. */}
            <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                    id="contact-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    defaultValue=""
                />
            </div>

            {state === 'error' && error ? (
                <p className={styles.formError} role="alert">
                    {error}
                </p>
            ) : null}

            <div className={styles.footer}>
                <Button type="submit" size="lg" disabled={state === 'submitting'}>
                    {state === 'submitting' ? 'Sending…' : 'Send inquiry'}
                </Button>
                <p className={styles.footnote}>
                    Delivered to {CONTACT.name}, {CONTACT.title}.
                </p>
            </div>
        </form>
    );
}
