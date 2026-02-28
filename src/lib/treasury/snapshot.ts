import { fetchSpotPrices } from './prices';

export interface TreasuryAssetPosition {
    symbol: 'BTC' | 'ETH' | 'SOL';
    name: string;
    units: number;
    averageCostUsd: number;
    spotPriceUsd: number;
}

export interface TreasuryAssetMetrics extends TreasuryAssetPosition {
    marketValueUsd: number;
    costBasisUsd: number;
    unrealizedPnlUsd: number;
}

export interface TreasurySnapshot {
    asOfIso: string;
    marketCapUsd: number;
    sharesOutstanding: number;
    priceSource: 'live' | 'fallback';
    assets: TreasuryAssetMetrics[];
    totals: {
        marketValueUsd: number;
        costBasisUsd: number;
        netAssetValueUsd: number;
        navPerShareUsd: number;
        mnavRatio: number;
        mnavPremiumPct: number;
        unrealizedPnlUsd: number;
    };
}

// Company acquisition records — update these as treasury changes
const HOLDINGS = [
    { symbol: 'BTC' as const, name: 'Bitcoin',  units: 188.42,  averageCostUsd: 61750 },
    { symbol: 'ETH' as const, name: 'Ethereum', units: 2810.25, averageCostUsd: 2280  },
    { symbol: 'SOL' as const, name: 'Solana',   units: 22450,   averageCostUsd: 122   },
];

const MARKET_CAP_USD = 34250000;
const SHARES_OUTSTANDING = 12750000;

function buildSnapshot(
    spotBtc: number,
    spotEth: number,
    spotSol: number,
    asOfIso: string,
    priceSource: 'live' | 'fallback',
): TreasurySnapshot {
    const spotMap = { BTC: spotBtc, ETH: spotEth, SOL: spotSol };

    const assets = HOLDINGS.map((h) => {
        const spotPriceUsd    = spotMap[h.symbol];
        const marketValueUsd  = h.units * spotPriceUsd;
        const costBasisUsd    = h.units * h.averageCostUsd;
        const unrealizedPnlUsd = marketValueUsd - costBasisUsd;
        return { ...h, spotPriceUsd, marketValueUsd, costBasisUsd, unrealizedPnlUsd };
    });

    const marketValueUsd   = assets.reduce((s, a) => s + a.marketValueUsd, 0);
    const costBasisUsd     = assets.reduce((s, a) => s + a.costBasisUsd, 0);
    const netAssetValueUsd = marketValueUsd;
    const navPerShareUsd   = netAssetValueUsd / SHARES_OUTSTANDING;
    const mnavRatio        = MARKET_CAP_USD / netAssetValueUsd;
    const mnavPremiumPct   = (mnavRatio - 1) * 100;
    const unrealizedPnlUsd = marketValueUsd - costBasisUsd;

    return {
        asOfIso,
        marketCapUsd: MARKET_CAP_USD,
        sharesOutstanding: SHARES_OUTSTANDING,
        priceSource,
        assets,
        totals: { marketValueUsd, costBasisUsd, netAssetValueUsd, navPerShareUsd, mnavRatio, mnavPremiumPct, unrealizedPnlUsd },
    };
}

/** Synchronous snapshot with last-known fallback prices — for server components that can't be async */
export function getTreasurySnapshot(): TreasurySnapshot {
    return buildSnapshot(96200, 3290, 188, new Date().toISOString(), 'fallback');
}

/** Async snapshot fetching live CoinGecko prices */
export async function getTreasurySnapshotLive(): Promise<TreasurySnapshot> {
    const prices = await fetchSpotPrices();
    return buildSnapshot(prices.btc, prices.eth, prices.sol, prices.asOfIso, prices.source);
}
