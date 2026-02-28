'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { signOut } from 'next-auth/react';
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
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
            {message && (
                <div className={`${styles.alert} ${status === 'success' ? styles.alertSuccess : styles.alertError}`}>
                    {message}
                </div>
            )}

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Change Email</h3>
                <p className={styles.sectionDesc}>Update your login email address.</p>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="settings-email">Email Address</label>
                    <input
                        id="settings-email"
                        className={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Change Password</h3>
                <p className={styles.sectionDesc}>Leave the new password fields blank if you only want to change your email.</p>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="settings-new-password">New Password</label>
                    <input
                        id="settings-new-password"
                        className={styles.input}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        autoComplete="new-password"
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="settings-confirm-password">Confirm New Password</label>
                    <input
                        id="settings-confirm-password"
                        className={styles.input}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                    />
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Confirm Changes</h3>
                <p className={styles.sectionDesc}>Enter your current password to authorize changes.</p>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="settings-current-password">Current Password</label>
                    <input
                        id="settings-current-password"
                        className={styles.input}
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Required to save changes"
                        required
                        autoComplete="current-password"
                    />
                </div>
            </div>

            <div className={styles.formFooter}>
                <Button type="submit" disabled={status === 'saving'}>
                    {status === 'saving' ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
