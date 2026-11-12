'use client';

import { useState, FormEvent } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CONTACT_EMAIL } from '@/lib/contact';
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

/** Mirrors the server-side limits in /api/contact. */
const LIMITS = {
    name: 120,
    email: 254,
    company: 160,
    message: 5000,
} as const;

/** Keep mailto links well under browser and mail-client URL limits. */
const MAILTO_BODY_MAX = 1500;

/** Shape of a /api/contact response. */
interface ContactResponse {
    ok?: boolean;
    delivery?: 'accepted' | 'dry-run' | 'failed';
    reference?: string;
    error?: string;
}

interface SuccessInfo {
    delivery: 'accepted' | 'dry-run';
    reference?: string;
}

interface FailureInfo {
    message: string;
    reference?: string;
    /** Offer the direct-email fallback for delivery problems, not for validation errors. */
    showFallback: boolean;
}

interface Submission {
    name: string;
    message: string;
}

/** mailto: link carrying the reference and the visitor's own message, for when the form cannot deliver. */
function directEmailHref(reference: string | undefined, submission: Submission | null): string {
    const subject = `Website inquiry${submission?.name ? ` from ${submission.name}` : ''}${reference ? ` [${reference}]` : ''}`;
    const params = new URLSearchParams();
    params.set('subject', subject);
    if (submission?.message) {
        params.set('body', submission.message.slice(0, MAILTO_BODY_MAX));
    }
    // URLSearchParams encodes spaces as "+", which mail clients do not decode.
    return `mailto:${CONTACT_EMAIL}?${params.toString().replace(/\+/g, '%20')}`;
}

export default function ContactForm() {
    const [state, setState] = useState<FormState>('idle');
    const [failure, setFailure] = useState<FailureInfo | null>(null);
    const [success, setSuccess] = useState<SuccessInfo | null>(null);
    const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setState('submitting');
        setFailure(null);

        // The form stays mounted through every failure path below, so the
        // visitor's entries are kept for a retry or for the email fallback.
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            company: (form.elements.namedItem('company') as HTMLInputElement).value,
            investorType: (form.elements.namedItem('investorType') as HTMLSelectElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
            website: (form.elements.namedItem('website') as HTMLInputElement).value,
        };
        setLastSubmission({ name: data.name.trim(), message: data.message.trim() });

        let res: Response;
        try {
            res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        } catch {
            setFailure({ message: 'We could not reach the server, so your inquiry was not sent.', showFallback: true });
            setState('error');
            return;
        }

        const body = (await res.json().catch(() => ({}))) as ContactResponse;

        if (res.ok && body.ok) {
            setSuccess({ delivery: body.delivery === 'dry-run' ? 'dry-run' : 'accepted', reference: body.reference });
            setState('success');
            return;
        }

        if (res.status === 429) {
            setFailure({
                message: 'You have sent several inquiries in a short time. Please wait a little while before trying again.',
                showFallback: true,
            });
        } else if (body.delivery === 'failed') {
            // The server could not hand the message to the email provider.
            setFailure({ message: 'Your inquiry could not be delivered.', reference: body.reference, showFallback: true });
        } else {
            setFailure({ message: body.error || 'Submission failed. Please check the form and try again.', showFallback: false });
        }
        setState('error');
    }

    if (state === 'success' && success) {
        const dryRun = success.delivery === 'dry-run';
        return (
            <div className={styles.successBox} role="status">
                <div className={styles.successIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h3>{dryRun ? 'Logged, Not Sent (Dry Run)' : 'Inquiry Sent'}</h3>
                <p>
                    {dryRun
                        ? 'EMAIL_DRY_RUN is set in this environment, so the inquiry was logged locally and was not delivered.'
                        : 'Our Investor Relations team has received your message. We will follow up at the email address you provided.'}
                </p>
                {success.reference ? (
                    <p className={styles.reference}>
                        Reference <span className={styles.referenceCode}>{success.reference}</span>
                    </p>
                ) : null}
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
                <Input label="Full Name" name="name" required maxLength={LIMITS.name} placeholder="Jane Smith" autoComplete="name" />
                <Input label="Work Email" name="email" type="email" required maxLength={LIMITS.email} placeholder="investor@example.com" autoComplete="email" />
            </div>

            <div className={styles.row}>
                <Input label="Company / Organization" name="company" maxLength={LIMITS.company} placeholder="Optional" autoComplete="organization" />
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
                    maxLength={LIMITS.message}
                    placeholder="Tell us about your investment goals, questions about the treasury strategy, or reason for reaching out…"
                />
            </div>

            {/* Honeypot: hidden from people, filled only by bots. */}
            <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {state === 'error' && failure && (
                <div className={styles.errorMsg} role="alert">
                    <p>{failure.message}</p>
                    {failure.showFallback && (
                        <p>
                            Your message is still in the form. Try again, or{' '}
                            <a href={directEmailHref(failure.reference, lastSubmission)} className={styles.errorLink}>
                                email us directly
                            </a>
                            {failure.reference ? (
                                <>
                                    {' '}and quote reference <span className={styles.referenceCode}>{failure.reference}</span>
                                </>
                            ) : null}
                            .
                        </p>
                    )}
                </div>
            )}

            <Button type="submit" size="lg" disabled={state === 'submitting'}>
                {state === 'submitting' ? 'Sending…' : 'Send Inquiry'}
            </Button>
        </form>
    );
}
