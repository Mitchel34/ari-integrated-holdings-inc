import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DashboardHeader, DashboardShell } from '@/components/dashboard/Dashboard';
import AccountSettingsForm from './AccountSettingsForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Account Settings',
    description: 'Update the email and password used to sign in to the executive portal.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/executive/settings' },
};

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return (
        <Container narrow>
            <DashboardShell>
                <DashboardHeader
                    eyebrow="Executive"
                    title="Account Settings"
                    description="Update the email and password used to sign in to the executive portal. Your current password is required to authorize any change."
                    aside={(
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/executive/dashboard">
                                <ArrowLeft aria-hidden="true" size={16} />
                                Back to dashboard
                            </Link>
                        </Button>
                    )}
                />

                <Card variant="glass" className={styles.card}>
                    <AccountSettingsForm currentEmail={user?.email || ''} />
                </Card>
            </DashboardShell>
        </Container>
    );
}
