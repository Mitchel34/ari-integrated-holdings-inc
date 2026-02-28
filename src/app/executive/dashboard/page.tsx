import { Container } from '../../../components/ui/Container';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTreasurySnapshot } from '@/lib/treasury/snapshot';
import { prisma } from '@/lib/prisma';
import { MeetingTypeSelector } from '../../../components/scheduling/MeetingTypeSelector';
import BroadcastTool from './BroadcastTool';
import styles from './page.module.css';

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

function formatUsd(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso));
}

export default async function ExecutiveDashboard() {
    const session = await getServerSession(authOptions);
    const user = session?.user as ExtendedUser | undefined;

    const snapshot = getTreasurySnapshot();

    let subscriberCount = 0;
    let investorCount = 0;
    let recentSubscribers: { email: string; subscribedAt: Date; source: string | null }[] = [];

    try {
        [subscriberCount, investorCount, recentSubscribers] = await Promise.all([
            prisma.investorAlert.count({ where: { isActive: true } }),
            prisma.user.count({ where: { role: 'INVESTOR' } }),
            prisma.investorAlert.findMany({
                orderBy: { subscribedAt: 'desc' },
                take: 20,
            }),
        ]);
    } catch {
        // DB not available in dev/demo — show zeros
    }

    return (
        <div className={styles.dashboardPage}>
            <Container className={styles.dashboardContainer}>

                {/* Welcome */}
                <div className={styles.welcomeCard}>
                    <div className={styles.welcomeHeader}>
                        <div className={styles.avatarLarge}>
                            {user?.name?.charAt(0) || 'E'}
                        </div>
                        <div className={styles.welcomeText}>
                            <span className={styles.roleBadge}>Executive</span>
                            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Executive'}</h1>
                            <p>Manage investor communications and review treasury operations</p>
                        </div>
                    </div>
                </div>

                {/* Live stat cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Alert Subscribers</span>
                            <span className={styles.statValue}>{subscriberCount.toLocaleString()}</span>
                            <span className={styles.statSub}>{investorCount} registered investors</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Treasury NAV</span>
                            <span className={styles.statValue}>{formatUsd(snapshot.totals.netAssetValueUsd)}</span>
                            <span className={styles.statSub}>mNAV {snapshot.totals.mnavRatio.toFixed(2)}x</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
                                <polyline points="17,6 23,6 23,12" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Unrealized P&L</span>
                            <span className={styles.statValue} style={{ color: '#4ade80' }}>
                                {formatUsd(snapshot.totals.unrealizedPnlUsd)}
                            </span>
                            <span className={styles.statSub}>across BTC, ETH, SOL</span>
                        </div>
                    </div>
                </div>

                {/* Broadcast tool */}
                <div className={styles.panelSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Send Investor Alert</h2>
                        <p>Broadcast a treasury update or announcement to all active alert subscribers</p>
                    </div>
                    <div className={styles.panelBody}>
                        <BroadcastTool subscriberCount={subscriberCount} />
                    </div>
                </div>

                {/* Recent subscribers */}
                {recentSubscribers.length > 0 && (
                    <div className={styles.panelSection}>
                        <div className={styles.sectionHeader}>
                            <h2>Recent Alert Subscribers</h2>
                            <p>Latest {recentSubscribers.length} signups — {subscriberCount} active total</p>
                        </div>
                        <div className={styles.subscriberTable}>
                            <div className={styles.tableHeader}>
                                <span>Email</span>
                                <span>Source</span>
                                <span>Date</span>
                            </div>
                            {recentSubscribers.map((sub) => (
                                <div key={sub.email} className={styles.tableRow}>
                                    <span className={styles.subEmail}>{sub.email}</span>
                                    <span className={styles.subSource}>{sub.source ?? '—'}</span>
                                    <span className={styles.subDate}>{formatDate(sub.subscribedAt.toISOString())}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Schedule meetings */}
                <div className={styles.panelSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Schedule a Meeting</h2>
                        <p>Book investor meetings and partnership calls</p>
                    </div>
                    <div className={styles.schedulingWrapper}>
                        <MeetingTypeSelector />
                    </div>
                </div>

            </Container>
        </div>
    );
}
