import { CalendarClock, DollarSign, FileText, TrendingUp, WalletCards } from 'lucide-react';
import type { TreasuryFreshness, TreasurySnapshot } from '@/lib/treasury/snapshot';
import type { InvestorDocument, InvestorEvent } from '@/lib/investor/disclosures';
import { CONTACT } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { AssetChip } from '@/components/brand/AssetChip';
import { MeetingTypeSelector } from '@/components/scheduling/MeetingTypeSelector';
import {
    DataTable,
    DashboardHeader,
    DashboardPanel,
    DashboardShell,
    Delta,
    EmptyState,
    FreshnessBadge,
    MetricCard,
    MetricGrid,
    StatusBadge,
    dashboardStyles,
    formatDateIso,
    formatDateProse,
    formatDateTimeProse,
    formatNumber,
    formatUsd,
    seriesColorFor,
} from '@/components/dashboard/Dashboard';
import { AllocationChart, ValueBarChart } from '@/components/dashboard/DashboardCharts';
import styles from './page.module.css';

export interface InvestorDashboardViewProps {
    firstName: string;
    snapshot: TreasurySnapshot;
    freshness: TreasuryFreshness;
    documents: InvestorDocument[];
    nextEvent: InvestorEvent | null;
}

/** Pure rendering of the investor dashboard; the page supplies session + data. */
export function InvestorDashboardView({ firstName, snapshot, freshness, documents, nextEvent }: InvestorDashboardViewProps) {
    const asOf = formatDateProse(snapshot.asOfIso);
    const asOfLine = `as of ${formatDateIso(snapshot.asOfIso)} · ${snapshot.sourceLabel}`;

    const allocationData = [
        ...snapshot.holdings.map((holding) => ({
            name: holding.symbol,
            value: holding.marketValueUsd,
            color: seriesColorFor(holding.symbol),
        })),
        { name: 'Cash', value: snapshot.cash.total, color: seriesColorFor('CASH') },
    ];

    const valueData = snapshot.holdings.map((holding) => ({
        name: holding.symbol,
        value: holding.marketValueUsd,
        color: seriesColorFor(holding.symbol),
    }));

    return (
        <Container>
            <DashboardShell>
                <DashboardHeader
                    eyebrow="Investor Portal"
                    title={`Welcome back, ${firstName}`}
                    description="Treasury posture, investor documents, and upcoming communications in one view. Figures are a manual snapshot from the CFO report, not a live feed."
                    meta={asOfLine}
                    aside={(
                        <>
                            <FreshnessBadge status={freshness.status} label={freshness.label} />
                            <StatusBadge tone="neutral">{snapshot.sourceLabel}</StatusBadge>
                        </>
                    )}
                />

                <MetricGrid columns={4}>
                    <MetricCard
                        icon={<DollarSign aria-hidden="true" />}
                        label="Total Assets"
                        value={formatUsd(snapshot.totals.totalAssets, 2)}
                        sub={`ETF positions ${formatUsd(snapshot.totals.capitalInvestments, 2)} + cash ${formatUsd(snapshot.cash.total, 2)}`}
                        meta={asOfLine}
                    />
                    <MetricCard
                        icon={<WalletCards aria-hidden="true" />}
                        label="NAV per Share"
                        value={formatUsd(snapshot.totals.navPerShareUsd, 4)}
                        sub={`${formatNumber(snapshot.sharesOutstanding, 1)} shares outstanding`}
                        meta={asOfLine}
                    />
                    <MetricCard
                        icon={<TrendingUp aria-hidden="true" />}
                        label="Unrealized P&L"
                        value={<Delta value={snapshot.totals.unrealizedPnlUsd} />}
                        sub={`versus cost basis ${formatUsd(snapshot.totals.totalCostBasis, 2)}`}
                        meta={asOfLine}
                    />
                    <MetricCard
                        icon={<CalendarClock aria-hidden="true" />}
                        label="Next Event"
                        value={<span className={styles.metricText}>{nextEvent ? nextEvent.title : 'None scheduled'}</span>}
                        sub={nextEvent ? formatDateTimeProse(nextEvent.startsAtIso) : 'Briefings appear here once they are scheduled'}
                    />
                </MetricGrid>

                <div className={dashboardStyles.dashboardGrid}>
                    <DashboardPanel
                        eyebrow="Treasury"
                        title="Allocation by market value"
                        description={`Manual snapshot as of ${asOf}; source: ${snapshot.sourceLabel}. Target allocation is 50 / 30 / 20 across BTC / ETH / SOL.`}
                        action={<FreshnessBadge status={freshness.status} label={freshness.status === 'stale' ? 'Needs update' : 'Current'} />}
                    >
                        <AllocationChart
                            data={allocationData}
                            title={`Allocation by market value as of ${asOf}`}
                            description={`${allocationData.map((item) => `${item.name} ${formatUsd(item.value, 2)}`).join(', ')}; ${asOfLine}. Full figures are listed in the legend below the chart.`}
                        />
                    </DashboardPanel>

                    <DashboardPanel
                        eyebrow="Treasury"
                        title="ETF market value"
                        description={`Market value of each ETF wrapper at the ${asOf} manual mark.`}
                    >
                        <ValueBarChart
                            data={valueData}
                            title={`ETF market value as of ${asOf}`}
                            description={`${valueData.map((item) => `${item.name} ${formatUsd(item.value, 2)}`).join(', ')}; ${asOfLine}. The same values appear in the capital investments table below.`}
                        />
                        <p className={styles.chartNote}>{asOfLine}</p>
                    </DashboardPanel>
                </div>

                <div className={dashboardStyles.twoColumnGrid}>
                    <DashboardPanel
                        eyebrow="Holdings"
                        title="Capital investments"
                        description="ETF positions with the unrealized result against cost basis."
                    >
                        <DataTable
                            caption={`ETF holdings as of ${asOf}`}
                            columns={[
                                'Holding',
                                { label: 'Shares', numeric: true, hideOnMobile: true },
                                { label: 'Price', numeric: true, hideOnMobile: true },
                                { label: 'Market value', numeric: true },
                                { label: 'P&L', numeric: true },
                            ]}
                            rows={snapshot.holdings.map((holding) => [
                                <span key="symbol" className={styles.holdingCell}>
                                    <AssetChip symbol={holding.symbol} />
                                    <span className={styles.holdingName}>{holding.name}</span>
                                </span>,
                                formatNumber(holding.shares),
                                formatUsd(holding.currentPricePerShare, 2),
                                formatUsd(holding.marketValueUsd, 2),
                                <Delta key="pnl" value={holding.unrealizedPnlUsd} />,
                            ])}
                        />
                        <p className={styles.tableNote}>{asOfLine}</p>
                    </DashboardPanel>

                    <DashboardPanel
                        eyebrow="Holdings"
                        title="Cash positions"
                        description={`Reported balances as of ${asOf}.`}
                    >
                        <DataTable
                            caption={`Cash positions as of ${asOf}`}
                            columns={['Account', { label: 'Balance', numeric: true }]}
                            rows={[
                                ['Checking account', formatUsd(snapshot.cash.checking, 2)],
                                ['Brokerage cash', formatUsd(snapshot.cash.brokerage, 2)],
                                ['Total cash', formatUsd(snapshot.cash.total, 2)],
                            ]}
                            emphasizeLastRow
                        />
                        <p className={styles.tableNote}>{asOfLine}</p>
                    </DashboardPanel>
                </div>

                <DashboardPanel
                    eyebrow="Documents"
                    title="Document vault"
                    description="Investor documents, disclosures, and governance materials."
                    action={<span className={styles.panelIcon} aria-hidden="true"><FileText size={18} /></span>}
                >
                    <DataTable
                        caption="Investor documents"
                        columns={['Document', { label: 'Type', hideOnMobile: true }, { label: 'Date', mono: true, align: 'right' }]}
                        rows={documents.map((doc) => [
                            <a
                                key={doc.id}
                                href={doc.href}
                                target={doc.href.startsWith('http') ? '_blank' : undefined}
                                rel={doc.href.startsWith('http') ? 'noreferrer' : undefined}
                                className={styles.docLink}
                            >
                                {doc.title}
                            </a>,
                            doc.type,
                            formatDateIso(doc.dateIso),
                        ])}
                    />
                </DashboardPanel>

                <DashboardPanel
                    eyebrow="Communications"
                    title="Upcoming investor event"
                    description="Only future events are shown here."
                    action={<span className={styles.panelIcon} aria-hidden="true"><CalendarClock size={18} /></span>}
                >
                    {nextEvent ? (
                        <div className={styles.eventCard}>
                            <StatusBadge tone="success">Scheduled</StatusBadge>
                            <h3 className={styles.eventTitle}>{nextEvent.title}</h3>
                            <p className={styles.eventCopy}>{nextEvent.description}</p>
                            <dl className={styles.eventMeta}>
                                <div>
                                    <dt>When</dt>
                                    <dd className="mono">{formatDateTimeProse(nextEvent.startsAtIso)}</dd>
                                </div>
                                <div>
                                    <dt>Where</dt>
                                    <dd>{nextEvent.location}</dd>
                                </div>
                            </dl>
                        </div>
                    ) : (
                        <EmptyState
                            title="No upcoming events"
                            copy="The investor calendar is clear. New briefings will appear here once they are scheduled, and alert subscribers are notified by email."
                            icon={<CalendarClock />}
                        />
                    )}
                </DashboardPanel>

                <DashboardPanel
                    eyebrow="Scheduling"
                    title="Schedule a meeting"
                    description="Book time directly with the Ari leadership team. Calendly sends you a confirmation with call details and adds the meeting to the executive calendar."
                >
                    <MeetingTypeSelector />
                </DashboardPanel>

                <p className={styles.footnote}>
                    Questions about these figures or your holdings are routed to {CONTACT.name}, {CONTACT.title}, at{' '}
                    <a href={CONTACT.mailto} className={styles.footnoteLink}>{CONTACT.email}</a>.
                </p>
            </DashboardShell>
        </Container>
    );
}
