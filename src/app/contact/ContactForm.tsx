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

/** Keep mailto links well under browser and mail-client URL limits. */
const MAILTO_BODY_MAX = 1500;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
    name?: string;
    email?: string;
    message?: string;
}

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
    /** Offer the direct-email fallback (delivery problems), not for validation errors. */
    showFallback: boolean;
}

interface Submission {
    name: string;
    message: string;
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

/** mailto: link to the CTO carrying the reference and the visitor's own message. */
function directEmailHref(reference: string | undefined, submission: Submission | null): string {
    const subject = `Website inquiry${submission?.name ? ` from ${submission.name}` : ''}${reference ? ` [${reference}]` : ''}`;
    const params = new URLSearchParams();
    params.set('subject', subject);
    if (submission?.message) {
        params.set('body', submission.message.slice(0, MAILTO_BODY_MAX));
    }
    // URLSearchParams encodes spaces as "+", which mail clients do not decode.
    return `${CONTACT.mailto}?${params.toString().replace(/\+/g, '%20')}`;
}

export default function ContactForm() {
    const [state, setState] = useState<FormState>('idle');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [failure, setFailure] = useState<FailureInfo | null>(null);
    const [success, setSuccess] = useState<SuccessInfo | null>(null);
    const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFailure(null);

        // The form stays mounted through every failure path below, so the
        // visitor's entries are preserved for a retry or for the mailto fallback.
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
            setFailure({ message: RATE_LIMIT_MESSAGE, showFallback: true });
        } else if (body.delivery === 'failed') {
            setFailure({ message: 'Your inquiry could not be delivered.', reference: body.reference, showFallback: true });
        } else {
            setFailure({ message: body.error || 'Submission failed. Please check the form and try again.', showFallback: false });
        }
        setState('error');
    }

    function clearFieldError(field: keyof FieldErrors) {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    if (state === 'success' && success) {
        const dryRun = success.delivery === 'dry-run';
        return (
            <div className={`${styles.success} glass-1`} role="status" aria-live="polite">
                <span className={styles.successIcon} aria-hidden="true">
                    <Check size={20} strokeWidth={2.25} />
                </span>
                <div className={styles.successText}>
                    <p className={styles.successTitle}>{dryRun ? 'Logged, not sent (dry run).' : 'Inquiry sent.'}</p>
                    <p className={styles.successBody}>
                        {dryRun ? (
                            'EMAIL_DRY_RUN is set in this environment, so the inquiry was logged locally and was not delivered.'
                        ) : (
                            <>
                                Your message is on its way to {CONTACT.name}, {CONTACT.title}, who will reply {CONTACT.responseWindow}.
                                If you have not heard back by then, email{' '}
                                <a href={CONTACT.mailto} className={styles.inlineLink}>{CONTACT.email}</a> directly.
                            </>
                        )}
                    </p>
                    {success.reference ? (
                        <p className={styles.successReference}>
                            Reference <span className="mono">{success.reference}</span>
                        </p>
                    ) : null}
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

            {state === 'error' && failure ? (
                <div className={styles.formError} role="alert">
                    <p>{failure.message}</p>
                    {failure.showFallback ? (
                        <p>
                            Nothing was lost: your message is still in the form. Try again, or{' '}
                            <a href={directEmailHref(failure.reference, lastSubmission)} className={styles.inlineLink}>
                                email {CONTACT.name} directly
                            </a>
                            {failure.reference ? (
                                <>
                                    {' '}and quote reference <span className="mono">{failure.reference}</span>
                                </>
                            ) : null}
                            .
                        </p>
                    ) : null}
                </div>
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
