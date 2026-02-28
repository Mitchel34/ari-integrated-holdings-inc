import { Container } from '@/components/ui/Container';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import AccountSettingsForm from './AccountSettingsForm';
import styles from './page.module.css';

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return (
        <div className={styles.settingsPage}>
            <Container className={styles.settingsContainer}>
                <div className={styles.backLink}>
                    <Link href="/executive/dashboard">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                <div className={styles.header}>
                    <h1>Account Settings</h1>
                    <p>Update your login credentials</p>
                </div>

                <div className={styles.card}>
                    <AccountSettingsForm currentEmail={user?.email || ''} />
                </div>
            </Container>
        </div>
    );
}
