'use client';

import { useState, FormEvent } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';

interface AccountSettingsFormProps {
    currentEmail: string;
}

export default function AccountSettingsForm({ currentEmail }: AccountSettingsFormProps) {
    const [email, setEmail] = useState(currentEmail);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setMessage('');

        if (!currentPassword) {
            setStatus('error');
            setMessage('Current password is required to make changes.');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setStatus('error');
            setMessage('New passwords do not match.');
            return;
        }

        if (newPassword && newPassword.length < 6) {
            setStatus('error');
            setMessage('New password must be at least 6 characters.');
            return;
        }

        const emailChanged = email !== currentEmail;
        const passwordChanged = !!newPassword;

        if (!emailChanged && !passwordChanged) {
            setStatus('error');
            setMessage('No changes to save.');
            return;
        }

        setStatus('saving');

        try {
            const res = await fetch('/api/executive/account', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailChanged ? email : undefined,
                    currentPassword,
                    newPassword: passwordChanged ? newPassword : undefined,
                }),
            });

            const data = (await res.json()) as { ok?: boolean; error?: string; message?: string; emailChanged?: boolean };

            if (!res.ok || !data.ok) {
                throw new Error(data.error || 'Update failed.');
            }

            setStatus('success');
            setMessage(data.message || 'Account updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // If email changed, user needs to re-sign in with new credentials
            if (data.emailChanged) {
                setMessage('Email updated. You will be redirected to sign in with your new credentials.');
                setTimeout(() => signOut({ callbackUrl: '/login' }), 2500);
            }
        } catch (err) {
            setStatus('error');
            setMessage(err instanceof Error ? err.message : 'An error occurred.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.settingsForm} aria-describedby={message ? 'settings-status' : undefined}>
            {message ? (
                <div
                    id="settings-status"
                    className={`${styles.alert} ${status === 'success' ? styles.alertSuccess : styles.alertError}`}
                    role={status === 'success' ? 'status' : 'alert'}
                >
                    {message}
                </div>
            ) : null}

            <section className={styles.section} aria-labelledby="settings-email-heading">
                <h2 id="settings-email-heading" className={styles.sectionTitle}>Change email</h2>
                <p className={styles.sectionDesc}>Update the address you use to sign in.</p>
                <Input
                    id="settings-email"
                    name="email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
            </section>

            <hr className={`hairline hairline--silver ${styles.divider}`} />

            <section className={styles.section} aria-labelledby="settings-password-heading">
                <h2 id="settings-password-heading" className={styles.sectionTitle}>Change password</h2>
                <p className={styles.sectionDesc}>Leave the new password fields blank if you only want to change your email.</p>
                <Input
                    id="settings-new-password"
                    name="newPassword"
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    autoComplete="new-password"
                    hint="At least 6 characters."
                />
                <Input
                    id="settings-confirm-password"
                    name="confirmPassword"
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                />
            </section>

            <hr className={`hairline hairline--silver ${styles.divider}`} />

            <section className={styles.section} aria-labelledby="settings-confirm-heading">
                <h2 id="settings-confirm-heading" className={styles.sectionTitle}>Confirm changes</h2>
                <p className={styles.sectionDesc}>Enter your current password to authorize changes.</p>
                <Input
                    id="settings-current-password"
                    name="currentPassword"
                    label="Current password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Required to save changes"
                    required
                    autoComplete="current-password"
                />
            </section>

            <div className={styles.formFooter}>
                <Button type="submit" disabled={status === 'saving'}>
                    {status === 'saving' ? 'Saving…' : 'Save changes'}
                </Button>
            </div>
        </form>
    );
}
