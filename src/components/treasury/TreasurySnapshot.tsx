import { AlertTriangle, Coins, Landmark, PieChart, Wallet } from 'lucide-react';
import { AssetChip } from '../brand/AssetChip';
import { StatTile } from '../ui/StatTile';
import { ALLOCATION } from '@/lib/site';
import {
    getTreasuryFreshness,
    getTreasurySnapshot,
    type ETFSymbol,
    type TreasuryFreshness,
    type TreasurySnapshot as TreasurySnapshotData,
} from '@/lib/treasury/snapshot';
import { formatIsoDate, formatProseDate } from '../investor/format';
import {
    formatPercent,
    formatShares,
    formatSignedPoints,
    formatSignedUsd,
    formatUnits,
    formatUsd,
    formatUsdPrecise,
} from './format';
import styles from './TreasurySnapshot.module.css';

interface TreasurySnapshotProps {
    /** Defaults to the current CFO snapshot. */
    snapshot?: TreasurySnapshotData;
    /** Defaults to the freshness of `snapshot` at render time. */
    freshness?: TreasuryFreshness;
    /** Heading id used to label the region. */
    headingId?: string;
}

const RAIL: Record<ETFSymbol, string> = {
    ARKB: styles.railBtc,
    FETH: styles.railEth,
    FSOL: styles.railSol,
};

const FILL: Record<ETFSymbol, string> = {
    ARKB: styles.fillBtc,
    FETH: styles.fillEth,
    FSOL: styles.fillSol,
};

function targetWeightFor(symbol: ETFSymbol): number {
    return ALLOCATION.find((a) => a.etf === symbol)?.weight ?? 0;
}

function underlyingFor(symbol: ETFSymbol): string {
    return ALLOCATION.find((a) => a.etf === symbol)?.name ?? symbol;
}

function pnlClass(value: number): string {
    return value > 0 ? styles.pos : value < 0 ? styles.neg : '';
}

/**
 * Public treasury summary: four metric tiles, the ETF holdings table with
 * weight-versus-target bars, and the source line. Every figure is exact,
 * tabular, and stamped with the report date.
 */
export function TreasurySnapshot({
    snapshot = getTreasurySnapshot(),
    freshness = getTreasuryFreshness(snapshot),
    headingId,
}: TreasurySnapshotProps) {
    const asOfIso = formatIsoDate(snapshot.asOfIso);
    const asOfProse = formatProseDate(snapshot.asOfIso);
    const stampLine = `as of ${asOfIso} · ${snapshot.sourceLabel}`;
    const investments = snapshot.totals.capitalInvestments || 1;
    const isStale = freshness.status === 'stale';

    const rows = snapshot.holdings.map((holding) => {
        const weight = (holding.marketValueUsd / investments) * 100;
        const target = targetWeightFor(holding.symbol);
        return { holding, weight, target, drift: weight - target };
    });

    return (
        <div className={styles.root} aria-labelledby={headingId} role={headingId ? 'region' : undefined}>
            {isStale ? (
                <p className={styles.notice} role="status">
                    <AlertTriangle aria-hidden="true" focusable="false" />
                    <span>
                        <strong>Stale snapshot.</strong> These figures are from the CFO report dated {asOfProse} (
                        <span className="mono">{freshness.ageDays}</span> days old) and do not reflect current market prices.
                        The public summary is refreshed when the next report arrives.
                    </span>
                </p>
            ) : null}

            <div className={styles.tiles}>
                <StatTile
                    label="Total assets"
                    value={formatUsd(snapshot.totals.totalAssets)}
                    sub={stampLine}
                    icon={<Landmark aria-hidden="true" focusable="false" />}
                    accent="gold"
                />
                <StatTile
                    label="Capital investments"
                    value={formatUsd(snapshot.totals.capitalInvestments)}
                    delta={snapshot.totals.unrealizedPnlUsd}
                    formatDelta={formatSignedUsd}
                    sub={`unrealized vs cost basis ${formatUsd(snapshot.totals.totalCostBasis)}`}
                    icon={<PieChart aria-hidden="true" focusable="false" />}
                />
                <StatTile
                    label="Cash positions"
                    value={formatUsd(snapshot.cash.total)}
                    sub={`checking ${formatUsd(snapshot.cash.checking)} · brokerage ${formatUsd(snapshot.cash.brokerage)}`}
                    icon={<Wallet aria-hidden="true" focusable="false" />}
                />
                <StatTile
                    label="NAV per share"
                    value={formatUsdPrecise(snapshot.totals.navPerShareUsd)}
                    sub={`${formatShares(snapshot.sharesOutstanding)} shares outstanding · no liabilities`}
                    icon={<Coins aria-hidden="true" focusable="false" />}
                />
            </div>

            <div className={styles.tableWrap}>
                <div className={styles.scroll}>
                    <table className={styles.table}>
                        <caption className={styles.caption}>
                            ETF holdings as of {asOfIso} · {snapshot.sourceLabel} · weights are shares of capital
                            investments against the 50 / 30 / 20 target
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Asset</th>
                                <th scope="col" className={styles.num}>Units</th>
                                <th scope="col" className={styles.num}>Price</th>
                                <th scope="col" className={styles.num}>Market value</th>
                                <th scope="col" className={styles.num}>Cost basis</th>
                                <th scope="col" className={styles.num}>Unrealized P&amp;L</th>
                                <th scope="col" className={styles.weightHead}>Weight vs target</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ holding, weight, target, drift }) => (
                                <tr key={holding.symbol} className={RAIL[holding.symbol]}>
                                    <th scope="row" className={styles.assetCell}>
                                        <span className={styles.asset}>
                                            <AssetChip symbol={holding.symbol} size="md" />
                                            <span className={styles.assetName}>
                                                <span>{underlyingFor(holding.symbol)}</span>
                                                <small>{holding.name}</small>
                                            </span>
                                        </span>
                                    </th>
                                    <td data-label="Units" className={styles.num}>{formatUnits(holding.shares)}</td>
                                    <td data-label="Price" className={styles.num}>{formatUsd(holding.currentPricePerShare)}</td>
                                    <td data-label="Market value" className={styles.num}>{formatUsd(holding.marketValueUsd)}</td>
                                    <td data-label="Cost basis" className={styles.num}>{formatUsd(holding.costBasisUsd)}</td>
                                    <td data-label="Unrealized P&L" className={`${styles.num} ${pnlClass(holding.unrealizedPnlUsd)}`.trim()}>
                                        <span aria-hidden="true">{holding.unrealizedPnlUsd < 0 ? '▼ ' : holding.unrealizedPnlUsd > 0 ? '▲ ' : ''}</span>
                                        {formatSignedUsd(holding.unrealizedPnlUsd)}
                                    </td>
                                    <td data-label="Weight vs target" className={styles.weightCell}>
                                        <span className={styles.weight}>
                                            <span className={styles.weightText}>
                                                <span className="mono">{formatPercent(weight)}</span>
                                                <span className={styles.weightTarget}>
                                                    target <span className="mono">{formatPercent(target)}</span> ·{' '}
                                                    <span className="mono">{formatSignedPoints(drift)}</span>
                                                </span>
                                            </span>
                                            <span className={styles.weightBar} aria-hidden="true">
                                                <span
                                                    className={`${styles.weightFill} ${FILL[holding.symbol]}`}
                                                    style={{ width: `${Math.min(100, Math.max(0, weight))}%` }}
                                                />
                                                <span className={styles.weightTick} style={{ left: `${target}%` }} />
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th scope="row" className={styles.assetCell}>
                                    <span className={styles.totalLabel}>Total investments</span>
                                </th>
                                <td data-label="Units" className={styles.num} aria-hidden="true" />
                                <td data-label="Price" className={styles.num} aria-hidden="true" />
                                <td data-label="Market value" className={styles.num}>{formatUsd(snapshot.totals.capitalInvestments)}</td>
                                <td data-label="Cost basis" className={styles.num}>{formatUsd(snapshot.totals.totalCostBasis)}</td>
                                <td data-label="Unrealized P&L" className={`${styles.num} ${pnlClass(snapshot.totals.unrealizedPnlUsd)}`.trim()}>
                                    <span aria-hidden="true">{snapshot.totals.unrealizedPnlUsd < 0 ? '▼ ' : snapshot.totals.unrealizedPnlUsd > 0 ? '▲ ' : ''}</span>
                                    {formatSignedUsd(snapshot.totals.unrealizedPnlUsd)}
                                </td>
                                <td data-label="Weight vs target" className={styles.weightCell}>
                                    <span className="mono">100%</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <p className={styles.source}>
                Source: manual CFO report · updated when new reports arrive. Figures as of {asOfIso}; unaudited.
            </p>
        </div>
    );
}
