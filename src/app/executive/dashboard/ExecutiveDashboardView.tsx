import Link from 'next/link';
import { Bell, DollarSign, Settings, TrendingUp, Users } from 'lucide-react';
import type { TreasuryFreshness, TreasurySnapshot } from '@/lib/treasury/snapshot';
import { CONTACT } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MeetingTypeSelector } from '@/components/scheduling/MeetingTypeSelector';
import { ExecMeetingBooking } from '@/components/scheduling/ExecMeetingBooking';
import {
    DataTable,
    DashboardHeader,
    DashboardPanel,
    DashboardShell,
    Delta,
    ErrorState,
    FreshnessBadge,
    MetricCard,
    MetricGrid,
    SERIES_COLORS,
    dashboardStyles,
    formatDateIso,
    formatDateProse,
    formatNumber,
    formatUsd,
} from '@/components/dashboard/Dashboard';
import { ValueBarChart } from '@/components/dashboard/DashboardCharts';
import BroadcastCenter from './BroadcastCenter';
import { TradingSystemStatus } from './TradingSystemStatus';
import styles from './page.module.css';

export interface RecentSubscriber {
    email: string;
    subscribedAtIso: string;
    source: string | null;
}

export interface ExecutiveDashboardViewProps {
    firstName: string;
    snapshot: TreasurySnapshot;
    freshness: TreasuryFreshness;
    subscriberCount: number;
    investorCount: number;
    recentSubscribers: RecentSubscriber[];
    dbError: string | null;
}

/** Pure rendering of the executive dashboard; the page supplies session + data. */
export function ExecutiveDashboardView({
    firstName,
    snapshot,
    freshness,
    subscriberCount,
    investorCount,
    recentSubscribers,
    dbError,
}: ExecutiveDashboardViewProps) {
    const asOf = formatDateProse(snapshot.asOfIso);
    const asOfLine = `as of ${formatDateIso(snapshot.asOfIso)} · ${snapshot.sourceLabel}`;
    const pnl = snapshot.totals.unrealizedPnlUsd;

    const valueData = [
        { name: 'Assets', value: snapshot.totals.totalAssets, color: SERIES_COLORS.GOLD },
        { name: 'Cost basis', value: snapshot.totals.totalCostBasis, color: SERIES_COLORS.SILVER },
        { name: pnl >= 0 ? 'Gain' : 'Loss', value: Math.abs(pnl), color: pnl >= 0 ? SERIES_COLORS.POS : SERIES_COLORS.NEG },
    ];

    return (
        <Container>
            <DashboardShell>
                <DashboardHeader
                    eyebrow="Executive Dashboard"
                    title={`Welcome back, ${firstName}`}
                    description="Manage investor communications, review treasury freshness, and monitor readiness for the future trading-system integration."
                    meta={asOfLine}
                    aside={(
                        <>
                            <FreshnessBadge status={freshness.status} label={freshness.label} />
                            <Button variant="secondary" size="sm" asChild>
                                <Link href="/executive/subscribers">
                                    <Users aria-hidden="true" size={16} />
                                    Subscribers
                                </Link>
                            </Button>
                            <Button variant="secondary" size="sm" asChild>
                                <Link href="/executive/settings">
                                    <Settings aria-hidden="true" size={16} />
                                    Account settings
                                </Link>
                            </Button>
                        </>
                    )}
                />

                {dbError ? (
                    <ErrorState
                        title="Database data unavailable"
                        copy="Investor and broadcast counts could not be loaded. This dashboard is showing fallback values until the database connection is restored."
                    />
                ) : null}

                <MetricGrid columns={3}>
                    <MetricCard
                        icon={<Users aria-hidden="true" />}
                        label="Alert Subscribers"
                        value={dbError ? 'Unavailable' : formatNumber(subscriberCount, 0)}
                        sub={dbError ? 'Database connection failed' : `${formatNumber(investorCount, 0)} registered investor${investorCount === 1 ? '' : 's'}`}
                    />
                    <MetricCard
                        icon={<DollarSign aria-hidden="true" />}
                        label="Total Assets"
                        value={formatUsd(snapshot.totals.totalAssets, 2)}
                        sub={`${formatUsd(snapshot.totals.navPerShareUsd, 4)} NAV per share`}
                        meta={asOfLine}
                    />
                    <MetricCard
                        icon={<TrendingUp aria-hidden="true" />}
                        label="Unrealized P&L"
                        value={<Delta value={pnl} />}
                        sub="Across ARKB, FSOL, FETH"
                        meta={asOfLine}
                    />
                </MetricGrid>

                <div className={dashboardStyles.dashboardGrid}>
                    <DashboardPanel
                        eyebrow="Treasury"
                        title="Treasury operations"
                        description={`Manual snapshot as of ${asOf}; source: ${snapshot.sourceLabel}. Assets against cost basis, with the unrealized result.`}
                        action={<FreshnessBadge status={freshness.status} label={freshness.status === 'stale' ? 'Needs update' : 'Current'} />}
                    >
                        <ValueBarChart data={valueData} />
                        <p className={styles.chartNote}>{asOfLine}</p>
                    </DashboardPanel>

                    <DashboardPanel
                        eyebrow="Investors"
                        title="Investor activity"
                        description="Subscriber readiness and recent signup activity."
                        action={<span className={styles.panelIcon} aria-hidden="true"><Bell size={18} /></span>}
                    >
                        <MetricGrid columns={1}>
                            <MetricCard size="sm" label="Active Alerts" value={dbError ? 'N/A' : formatNumber(subscriberCount, 0)} sub="Subscribed to investor updates" />
                            <MetricCard size="sm" label="Portal Investors" value={dbError ? 'N/A' : formatNumber(investorCount, 0)} sub="Registered investor accounts" />
                            <MetricCard size="sm" label="Recent Signups" value={dbError ? 'N/A' : formatNumber(recentSubscribers.length, 0)} sub="Latest records loaded" />
                        </MetricGrid>
                    </DashboardPanel>
                </div>

                <BroadcastCenter subscriberCount={dbError ? 0 : subscriberCount} />

                {recentSubscribers.length > 0 ? (
                    <DashboardPanel
                        eyebrow="Investors"
                        title="Recent alert subscribers"
                        description={`Latest ${recentSubscribers.length} signups; ${formatNumber(subscriberCount, 0)} active in total.`}
                        action={(
                            <Button variant="secondary" size="sm" asChild>
                                <Link href="/executive/subscribers">View all</Link>
                            </Button>
                        )}
                    >
                        <DataTable
                            caption="Most recent alert subscribers"
                            columns={['Email', { label: 'Source', hideOnMobile: true }, { label: 'Date', mono: true, align: 'right' }]}
                            rows={recentSubscribers.map((sub) => [
                                <span key="email" className={styles.emailCell}>{sub.email}</span>,
                                sub.source ?? 'None',
                                formatDateIso(sub.subscribedAtIso),
                            ])}
                        />
                    </DashboardPanel>
                ) : null}

                <TradingSystemStatus />

                <div className={styles.schedulingStack}>
                    <DashboardPanel
                        eyebrow="Scheduling"
                        title="Executive Zoom meeting"
                        description={`Book a Zoom meeting via Calendly. Executive notifications also reach the CTO correspondence inbox (${CONTACT.email}) and remain separate from trading controls.`}
                    >
                        <ExecMeetingBooking />
                    </DashboardPanel>

                    <DashboardPanel
                        eyebrow="Scheduling"
                        title="Schedule investor meeting"
                        description="Book investor meetings and partnership calls."
                    >
                        <MeetingTypeSelector />
                    </DashboardPanel>
                </div>

                <p className={styles.footnote}>
                    All inbound correspondence for this dashboard is routed to {CONTACT.name}, {CONTACT.title}, at{' '}
                    <a href={CONTACT.mailto} className={styles.footnoteLink}>{CONTACT.email}</a>.
                </p>
            </DashboardShell>
        </Container>
    );
}
