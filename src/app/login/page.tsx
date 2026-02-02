"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import styles from '../page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/executive/dashboard';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            username,
            password,
            callbackUrl,
        });

        if (res?.error) {
            setError('Invalid credentials');
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Investor Login</h1>
                <p>Secure portal access for authorized investors.</p>
            </div>

            <div className={styles.textBlock} style={{ maxWidth: '400px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                    <div>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin@ari.com"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="admin"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <Button type="submit">Login</Button>
                </form>
            </div>

            <div className={styles.textBlock}>
                <h2>Portal Access</h2>
                <p>
                    Investor portal access is provided to verified investors only. If you need access
                    or have questions about onboarding, please contact the Ari Integrated Holdings Inc. team.
                </p>
            </div>
        </Container>
    );
}

