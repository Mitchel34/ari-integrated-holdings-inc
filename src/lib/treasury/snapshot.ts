// Treasury Snapshot - ETF Holdings Model
// Data source: CFO Report (Mar 1, 2026)
// Prices updated manually from CFO reports

export type ETFSymbol = 'ARKB' | 'FSOL' | 'FETH';

export interface ETFPosition {
    symbol: ETFSymbol;
    name: string;
    shares: number;
    costBasisPerShare: number;
    currentPricePerShare: number;
}

export interface ETFPositionMetrics extends ETFPosition {
    marketValueUsd: number;
    costBasisUsd: number;
    unrealizedPnlUsd: number;
}

export interface CashPositions {
    checking: number;
    brokerage: number;
    total: number;
}

export interface TreasurySnapshot {
    asOfIso: string;
    asOfDate: string; // Human-readable date
    sourceLabel: string;
    sharesOutstanding: number;
    authorizedShares: number;
    remainingShares: number;
    cash: CashPositions;
    holdings: ETFPositionMetrics[];
    totals: {
        capitalInvestments: number;
        totalAssets: number;
        totalCostBasis: number;
        unrealizedPnlUsd: number;
        shareholderEquity: number;
        navPerShareUsd: number;
    };
}

export interface TreasuryFreshness {
    status: 'current' | 'stale';
    label: string;
    ageDays: number;
}

// ============================================================
// CFO REPORT DATA - Update these values when new reports arrive
// Last updated: March 1, 2026
// ============================================================

const REPORT_DATE = '2026-03-01';
const SOURCE_LABEL = 'Manual CFO report';
const STALE_AFTER_DAYS = 14;

// ETF Holdings (from CFO Balance Sheet)
const HOLDINGS: ETFPosition[] = [
    {
        symbol: 'ARKB',
        name: 'ARK 21Shares Bitcoin ETF',
        shares: 120,
        costBasisPerShare: 27.80,      // From Feb 1 valuation: $3,336 / 120 shares
        currentPricePerShare: 21.78,   // $2,613.60 / 120 shares
    },
    {
        symbol: 'FSOL',
        name: 'Franklin Solana ETF',
        shares: 125,
        costBasisPerShare: 11.458,     // Weighted avg: ($927 + $243.50 + $261.75) / 125
        currentPricePerShare: 9.59,    // $1,198.75 / 125 shares
    },
    {
        symbol: 'FETH',
        name: 'Fidelity Ethereum ETF',
        shares: 25,
        costBasisPerShare: 23.66,      // Single purchase @ $23.66
        currentPricePerShare: 19.175,  // $479.38 / 25 shares
    },
];

// Cash Positions (from CFO Balance Sheet)
const CASH: CashPositions = {
    checking: 54.00,
    brokerage: 325.41,
    total: 379.41,
};

// Share Structure (from CFO Share Valuation)
const SHARES_OUTSTANDING = 300008.7;
const AUTHORIZED_SHARES = 25000000;

// ============================================================
// Snapshot Builder
// ============================================================

function buildSnapshot(): TreasurySnapshot {
    // Calculate metrics for each holding
    const holdings: ETFPositionMetrics[] = HOLDINGS.map((h) => {
        const marketValueUsd = h.shares * h.currentPricePerShare;
        const costBasisUsd = h.shares * h.costBasisPerShare;
        const unrealizedPnlUsd = marketValueUsd - costBasisUsd;
        return { ...h, marketValueUsd, costBasisUsd, unrealizedPnlUsd };
    });

    // Calculate totals
    const capitalInvestments = holdings.reduce((sum, h) => sum + h.marketValueUsd, 0);
    const totalAssets = capitalInvestments + CASH.total;
    const totalCostBasis = holdings.reduce((sum, h) => sum + h.costBasisUsd, 0);
    const unrealizedPnlUsd = capitalInvestments - totalCostBasis;
    const shareholderEquity = totalAssets; // No liabilities
    const navPerShareUsd = shareholderEquity / SHARES_OUTSTANDING;
    const remainingShares = AUTHORIZED_SHARES - SHARES_OUTSTANDING;

    return {
        asOfIso: new Date(REPORT_DATE).toISOString(),
        asOfDate: '1 Mar 2026',
        sourceLabel: SOURCE_LABEL,
        sharesOutstanding: SHARES_OUTSTANDING,
        authorizedShares: AUTHORIZED_SHARES,
        remainingShares,
        cash: CASH,
        holdings,
        totals: {
            capitalInvestments,
            totalAssets,
            totalCostBasis,
            unrealizedPnlUsd,
            shareholderEquity,
            navPerShareUsd,
        },
    };
}

// Cached snapshot (static data, no need for live fetching)
let _cachedSnapshot: TreasurySnapshot | null = null;

/** Get treasury snapshot (synchronous - data is static from CFO reports) */
export function getTreasurySnapshot(): TreasurySnapshot {
    if (!_cachedSnapshot) {
        _cachedSnapshot = buildSnapshot();
    }
    return _cachedSnapshot;
}

/** Alias for compatibility - async version (data is still static) */
export async function getTreasurySnapshotLive(): Promise<TreasurySnapshot> {
    return getTreasurySnapshot();
}

export function getTreasuryFreshness(snapshot: TreasurySnapshot, now = new Date()): TreasuryFreshness {
    const asOf = new Date(snapshot.asOfIso);
    const ageMs = now.getTime() - asOf.getTime();
    const ageDays = Math.max(0, Math.floor(ageMs / (1000 * 60 * 60 * 24)));
    const status = ageDays > STALE_AFTER_DAYS ? 'stale' : 'current';

    return {
        status,
        ageDays,
        label: status === 'stale' ? `Stale: ${ageDays} days old` : `Current: ${ageDays} days old`,
    };
}
