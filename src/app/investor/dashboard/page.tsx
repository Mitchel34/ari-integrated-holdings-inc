import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { CalendarClock, DollarSign, FileText, PieChart, WalletCards } from 'lucide-react';
import { authOptions } from "@/lib/auth";
import { getTreasuryFreshness, getTreasurySnapshot } from '@/lib/treasury/snapshot';
import { getInvestorDocuments, getNextInvestorEvent } from '@/lib/investor/disclosures';
import { Container } from '../../../components/ui/Container';
import { MeetingTypeSelector } from '../../../components/scheduling/MeetingTypeSelector';
import {
    DataTable,
    DashboardHeader,
    DashboardPanel,
    DashboardShell,
    EmptyState,
    FreshnessBadge,
    MetricCard,
    MetricGrid,
    StatusBadge,
    dashboardStyles,
} from '../../../components/dashboard/Dashboard';
import { AllocationChart, ValueBarChart } from '../../../components/dashboard/DashboardCharts';
import styles from './page.module.css';

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    createdAt?: string;
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

function formatEventDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
    }).format(new Date(iso));
}

const chartColors = ['#E8C87A', '#84b8ff', '#b49dff', '#94a3b8'];

export default async function InvestorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/investor/dashboard');
    }

    const user = session.user as ExtendedUser;
    const snapshot = getTreasurySnapshot();
    const freshness = getTreasuryFreshness(snapshot);
    const documents = getInvestorDocuments();
    const nextEvent = getNextInvestorEvent();
    const pnlTone = snapshot.totals.unrealizedPnlUsd >= 0 ? 'success' : 'danger';

    const allocationData = [
        ...snapshot.holdings.map((holding, index) => ({
            name: holding.symbol,
            value: holding.marketValueUsd,
            color: chartColors[index],
        })),
        { name: 'Cash', value: snapshot.cash.total, color: chartColors[3] },
    ];

    const valueData = snapshot.holdings.map((holding, index) => ({
        name: holding.symbol,
        value: holding.marketValueUsd,
        color: chartColors[index],
    }));

    return (
        <div className={styles.dashboardPage}>
            <Container className={styles.dashboardContainer}>
                <DashboardShell>
                    <DashboardHeader
                        eyebrow="Investor Portal"
                        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Investor'}`}
                        description="Review treasury posture, investor documents, and upcoming communications from one operational view."
                        aside={(
                            <>
                                <FreshnessBadge status={freshness.status} label={freshness.label} />
                                <StatusBadge tone="neutral">{snapshot.sourceLabel}</StatusBadge>
                            </>
                        )}
                    />

                    <MetricGrid>
                        <MetricCard
                            icon={<DollarSign aria-hidden="true" />}
                            label="Total Assets"
                            value={formatUsd(snapshot.totals.totalAssets, 2)}
                            sub={<span className={styles[pnlTone]}>P&L {snapshot.totals.unrealizedPnlUsd >= 0 ? '+' : ''}{formatUsd(snapshot.totals.unrealizedPnlUsd, 2)}</span>}
                        />
                        <MetricCard
                            icon={<WalletCards aria-hidden="true" />}
                            label="NAV per Share"
                            value={formatUsd(snapshot.totals.navPerShareUsd, 4)}
                            sub={`${snapshot.sharesOutstanding.toLocaleString()} shares outstanding`}
                        />
                        <MetricCard
                            icon={<CalendarClock aria-hidden="true" />}
                            label="Next Event"
                            value={nextEvent ? nextEvent.title : 'No upcoming events'}
                            sub={nextEvent ? formatEventDate(nextEvent.startsAtIso) : 'Investor calendar is clear'}
                        />
                    </MetricGrid>

                    <div className={dashboardStyles.dashboardGrid}>
                        <DashboardPanel
                            title="Treasury Allocation"
                            description={`Manual snapshot as of ${snapshot.asOfDate}; source: ${snapshot.sourceLabel}.`}
                            action={<FreshnessBadge status={freshness.status} label={freshness.status === 'stale' ? 'Needs update' : 'Current'} />}
                        >
                            <AllocationChart data={allocationData} />
                        </DashboardPanel>

                        <DashboardPanel
                            title="ETF Market Value"
                            description="Capital investment values by current manual mark."
                        >
                            <ValueBarChart data={valueData} />
                        </DashboardPanel>
                    </div>

                    <div className={dashboardStyles.twoColumnGrid}>
                        <DashboardPanel
                            title="Capital Investments"
                            description="ETF holdings and unrealized performance."
                        >
                            <DataTable
                                columns={['Holding', 'Shares', 'Price', 'Market Value', 'P&L']}
                                rows={snapshot.holdings.map((holding) => [
                                    <strong key="symbol">{holding.symbol}</strong>,
                                    holding.shares.toLocaleString(),
                                    formatUsd(holding.currentPricePerShare, 2),
                                    formatUsd(holding.marketValueUsd, 2),
                                    <span key="pnl" className={holding.unrealizedPnlUsd >= 0 ? styles.success : styles.danger}>
                                        {holding.unrealizedPnlUsd >= 0 ? '+' : ''}{formatUsd(holding.unrealizedPnlUsd, 2)}
                                    </span>,
                                ])}
                            />
                        </DashboardPanel>

                        <DashboardPanel
                            title="Cash Positions"
                            description={`Reported as of ${snapshot.asOfDate}.`}
                        >
                            <DataTable
                                columns={['Account', 'Value']}
                                rows={[
                                    ['Checking Account', formatUsd(snapshot.cash.checking, 2)],
                                    ['Brokerage Cash', formatUsd(snapshot.cash.brokerage, 2)],
                                    [<strong key="total">Total Cash</strong>, <strong key="value">{formatUsd(snapshot.cash.total, 2)}</strong>],
                                ]}
                            />
                        </DashboardPanel>
                    </div>

                    <DashboardPanel
                        title="Document Vault"
                        description="Investor documents, disclosures, and governance materials."
                        action={<FileText aria-hidden="true" size={18} />}
                    >
                        <DataTable
                            columns={['Document', 'Type', 'Date']}
                            rows={documents.map((doc) => [
                                <a key={doc.id} href={doc.href} target={doc.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={styles.docLink}>{doc.title}</a>,
                                doc.type,
                                formatDate(doc.dateIso),
                            ])}
                        />
                    </DashboardPanel>

                    <DashboardPanel
                        title="Upcoming Investor Event"
                        description="Only future events are shown here."
                        action={<PieChart aria-hidden="true" size={18} />}
                    >
                        {nextEvent ? (
                            <div className={styles.eventCard}>
                                <StatusBadge tone="success">Scheduled</StatusBadge>
                                <h3>{nextEvent.title}</h3>
                                <p>{nextEvent.description}</p>
                                <dl>
                                    <div>
                                        <dt>When</dt>
                                        <dd>{formatEventDate(nextEvent.startsAtIso)}</dd>
                                    </div>
                                    <div>
                                        <dt>Where</dt>
                                        <dd>{nextEvent.location}</dd>
                                    </div>
                                </dl>
                            </div>
                        ) : (
                            <EmptyState title="No upcoming events" copy="New briefings will appear here once they are scheduled." />
                        )}
                    </DashboardPanel>

                    <DashboardPanel
                        title="Schedule a Meeting"
                        description="Book time directly with the ARI leadership team."
                    >
                        <MeetingTypeSelector />
                    </DashboardPanel>
                </DashboardShell>
            </Container>
        </div>
    );
}
