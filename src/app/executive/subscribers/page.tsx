import { Container } from '../../../components/ui/Container';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import SubscriberList from './SubscriberList';
import styles from './page.module.css';

export default async function SubscribersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'EXECUTIVE' && session.user.role !== 'ADMIN')) {
        return null;
    }

    let subscribers: { id: string; email: string; subscribedAt: Date; isActive: boolean; source: string | null }[] = [];
    let totalCount = 0;
    let activeCount = 0;

    try {
        [subscribers, totalCount, activeCount] = await Promise.all([
            prisma.investorAlert.findMany({
                orderBy: { subscribedAt: 'desc' },
            }),
            prisma.investorAlert.count(),
            prisma.investorAlert.count({ where: { isActive: true } }),
        ]);
    } catch {
        // DB not available
    }

    return (
        <div className={styles.page}>
            <Container className={styles.container}>
                <div className={styles.header}>
                    <Link href="/executive/dashboard" className={styles.backLink}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1>Subscriber Management</h1>
                    <p>Manage investor alert subscribers</p>
                </div>

                <div className={styles.statsRow}>
                    <div className={styles.statBadge}>
                        <span className={styles.statNumber}>{totalCount}</span>
                        <span className={styles.statLabel}>Total</span>
                    </div>
                    <div className={styles.statBadge}>
                        <span className={styles.statNumber} style={{ color: '#4ade80' }}>{activeCount}</span>
                        <span className={styles.statLabel}>Active</span>
                    </div>
                    <div className={styles.statBadge}>
                        <span className={styles.statNumber} style={{ color: '#f87171' }}>{totalCount - activeCount}</span>
                        <span className={styles.statLabel}>Inactive</span>
                    </div>
                </div>

                <SubscriberList initialSubscribers={subscribers.map(s => ({
                    ...s,
                    subscribedAt: s.subscribedAt.toISOString(),
                }))} />
            </Container>
        </div>
    );
}
