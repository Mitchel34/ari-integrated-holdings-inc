import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Logo } from '../../components/brand/Logo';
import { Card } from '../../components/ui/Card';
import { Container } from '../../components/ui/Container';
import { LoginForm } from '../../components/auth/LoginForm';
import { CONTACT } from '../../lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Secure access to the Ari Integrated Holdings investor and executive dashboards.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/login' },
};

export default function LoginPage() {
    return (
        <div className={styles.page}>
            <Container className={styles.container}>
                <Card variant="elevated" className={styles.card} as="section" aria-labelledby="login-title">
                    <header className={styles.head}>
                        <Logo size={56} wordmark={false} href={null} priority className={styles.logo} />
                        <h1 id="login-title" className={styles.title}>
                            Investor &amp; Executive Access
                        </h1>
                        <p className={styles.subtitle}>
                            Sign in to the investor dashboard or the executive console.
                        </p>
                    </header>

                    <Suspense fallback={<p className={styles.loading}>Loading sign-in…</p>}>
                        <LoginForm />
                    </Suspense>
                </Card>

                <p className={styles.access}>
                    Need access? Email{' '}
                    <a href={CONTACT.mailto} className={styles.accessLink}>
                        {CONTACT.name}, CTO
                    </a>
                    . Accounts are issued to verified investors and executives only.
                </p>
            </Container>
        </div>
    );
}
