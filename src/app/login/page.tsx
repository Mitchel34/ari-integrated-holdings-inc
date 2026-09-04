import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Logo } from '../../components/brand/Logo';
import { Card } from '../../components/ui/Card';
import { Container } from '../../components/ui/Container';
import { LoginForm } from '../../components/auth/LoginForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Investor Portal',
    description: 'Sign in to the Ari Integrated Holdings investor portal to view treasury information and investor documents.',
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
                            Investor Portal
                        </h1>
                        <p className={styles.subtitle}>
                            Sign in to view treasury information and investor documents.
                        </p>
                    </header>

                    <Suspense fallback={<p className={styles.loading}>Loading sign-in…</p>}>
                        <LoginForm />
                    </Suspense>
                </Card>

                <p className={styles.access}>
                    Need access?{' '}
                    <Link href="/contact" className={styles.accessLink}>
                        Contact us.
                    </Link>
                </p>
            </Container>
        </div>
    );
}
