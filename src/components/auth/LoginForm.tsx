'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import styles from './LoginForm.module.css';

/** Only same-origin relative paths are honored; anything else lands on the role router. */
function safeCallbackUrl(raw: string | null): string {
    if (raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\')) {
        return raw;
    }
    return '/dashboard';
}

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'));

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
                callbackUrl,
            });

            if (res?.error) {
                setError('Invalid email or password');
            } else if (res?.ok) {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} aria-describedby={error ? 'login-error' : undefined}>
            {error ? (
                <p id="login-error" className={styles.error} role="alert">
                    {error}
                </p>
            ) : null}

            <Input
                label="Email address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
            />

            <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
            />

            <Button type="submit" variant="primary" size="lg" block className={styles.submit} disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className={styles.spinner} aria-hidden="true" />
                        <span>Signing in…</span>
                    </>
                ) : (
                    'Sign in'
                )}
            </Button>
        </form>
    );
}
