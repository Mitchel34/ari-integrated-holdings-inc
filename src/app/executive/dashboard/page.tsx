import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { Bell, DollarSign, Settings, TrendingUp, Users } from 'lucide-react';
import { authOptions } from "@/lib/auth";
import { getTreasuryFreshness, getTreasurySnapshot } from '@/lib/treasury/snapshot';
import { prisma } from '@/lib/prisma';
import { Container } from '../../../components/ui/Container';
import { MeetingTypeSelector } from '../../../components/scheduling/MeetingTypeSelector';
import { ExecMeetingBooking } from '../../../components/scheduling/ExecMeetingBooking';
import {
    DataTable,
    DashboardHeader,
    DashboardPanel,
    DashboardShell,
    ErrorState,
    FreshnessBadge,
    MetricCard,
    MetricGrid,
    StatusBadge,
    dashboardStyles,
} from '../../../components/dashboard/Dashboard';
import { ValueBarChart } from '../../../components/dashboard/DashboardCharts';
import BroadcastCenter from './BroadcastCenter';
import { TradingSystemStatus } from './TradingSystemStatus';
import styles from './page.module.css';

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

function formatUsd(n: number, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(n);
}

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso));
}

export default async function ExecutiveDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login?callbackUrl=/executive/dashboard');
    }

    const user = session.user as ExtendedUser;
    const snapshot = getTreasurySnapshot();
    const freshness = getTreasuryFreshness(snapshot);

    let subscriberCount = 0;
    let investorCount = 0;
    let recentSubscribers: { email: string; subscribedAt: Date; source: string | null }[] = [];
    let dbError: string | null = null;

    try {
        [subscriberCount, investorCount, recentSubscribers] = await Promise.all([
            prisma.investorAlert.count({ where: { isActive: true } }),
            prisma.user.count({ where: { role: 'INVESTOR' } }),
            prisma.investorAlert.findMany({
                orderBy: { subscribedAt: 'desc' },
                take: 20,
            }),
        ]);
    } catch (error) {
        dbError = error instanceof Error ? error.message : 'Database is unavailable.';
    }

    const valueData = [
        { name: 'Assets', value: snapshot.totals.totalAssets, color: '#E8C87A' },
        { name: 'Cost', value: snapshot.totals.totalCostBasis, color: '#84b8ff' },
        { name: 'P&L', value: Math.abs(snapshot.totals.unrealizedPnlUsd), color: snapshot.totals.unrealizedPnlUsd >= 0 ? '#86efac' : '#fca5a5' },
    ];

    return (
        <div className={styles.dashboardPage}>
            <Container className={styles.dashboardContainer}>
                <DashboardShell>
                    <DashboardHeader
                        eyebrow="Executive Dashboard"
                        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Executive'}`}
                        description="Manage investor communications, review treasury freshness, and monitor readiness for future trading-system integration."
                        aside={(
                            <>
                                <FreshnessBadge status={freshness.status} label={freshness.label} />
                                <Link href="/executive/settings" className={styles.settingsLink}>
                                    <Settings aria-hidden="true" size={16} />
                                    Account Settings
                                </Link>
                            </>
                        )}
                    />

                    {dbError ? (
                        <ErrorState
                            title="Database data unavailable"
                            copy="Investor and broadcast counts could not be loaded. This dashboard is showing fallback values until the database connection is restored."
                        />
                    ) : null}

                    <MetricGrid>
                        <MetricCard
                            icon={<Users aria-hidden="true" />}
                            label="Alert Subscribers"
                            value={dbError ? 'Unavailable' : subscriberCount.toLocaleString()}
                            sub={dbError ? 'Database connection failed' : `${investorCount} registered investors`}
                        />
                        <MetricCard
                            icon={<DollarSign aria-hidden="true" />}
                            label="Total Assets"
                            value={formatUsd(snapshot.totals.totalAssets, 2)}
                            sub={`${formatUsd(snapshot.totals.navPerShareUsd, 4)}/share`}
                        />
                        <MetricCard
                            icon={<TrendingUp aria-hidden="true" />}
                            label="Unrealized P&L"
                            value={<span className={snapshot.totals.unrealizedPnlUsd >= 0 ? styles.success : styles.danger}>{snapshot.totals.unrealizedPnlUsd >= 0 ? '+' : ''}{formatUsd(snapshot.totals.unrealizedPnlUsd, 2)}</span>}
                            sub="Across ARKB, FSOL, FETH"
                        />
                    </MetricGrid>

                    <div className={dashboardStyles.dashboardGrid}>
                        <DashboardPanel
                            title="Treasury Operations"
                            description={`Manual snapshot as of ${snapshot.asOfDate}; source: ${snapshot.sourceLabel}.`}
                            action={<FreshnessBadge status={freshness.status} label={freshness.status === 'stale' ? 'Needs update' : 'Current'} />}
                        >
                            <ValueBarChart data={valueData} />
                        </DashboardPanel>

                        <DashboardPanel
                            title="Investor Activity"
                            description="Subscriber readiness and recent signup activity."
                            action={<Bell aria-hidden="true" size={18} />}
                        >
                            <MetricGrid>
                                <MetricCard label="Active Alerts" value={dbError ? 'N/A' : subscriberCount.toLocaleString()} sub="Subscribed to investor updates" />
                                <MetricCard label="Portal Investors" value={dbError ? 'N/A' : investorCount.toLocaleString()} sub="Registered investor accounts" />
                                <MetricCard label="Recent Signups" value={dbError ? 'N/A' : recentSubscribers.length.toLocaleString()} sub="Latest records loaded" />
                            </MetricGrid>
                        </DashboardPanel>
                    </div>

                    <BroadcastCenter subscriberCount={dbError ? 0 : subscriberCount} />

                    {recentSubscribers.length > 0 ? (
                        <DashboardPanel
                            title="Recent Alert Subscribers"
                            description={`Latest ${recentSubscribers.length} signups; ${subscriberCount} active total.`}
                            action={<Link href="/executive/subscribers" className={styles.textLink}>View all</Link>}
                        >
                            <DataTable
                                columns={['Email', 'Source', 'Date']}
                                rows={recentSubscribers.map((sub) => [
                                    <span key="email" className={styles.emailCell}>{sub.email}</span>,
                                    sub.source ?? 'None',
                                    formatDate(sub.subscribedAt.toISOString()),
                                ])}
                            />
                        </DashboardPanel>
                    ) : null}

                    <TradingSystemStatus />

                    <div className={dashboardStyles.twoColumnGrid}>
                        <DashboardPanel
                            title="Executive Zoom Meeting"
                            description="Book a Zoom meeting via Calendly; executive notifications remain separate from trading controls."
                        >
                            <ExecMeetingBooking />
                        </DashboardPanel>

                        <DashboardPanel
                            title="Schedule Investor Meeting"
                            description="Book investor meetings and partnership calls."
                        >
                            <MeetingTypeSelector />
                        </DashboardPanel>
                    </div>
                </DashboardShell>
            </Container>
        </div>
    );
}
