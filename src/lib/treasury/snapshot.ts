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

const BASE_ASSETS: TreasuryAssetPosition[] = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        units: 188.42,
        averageCostUsd: 61750,
        spotPriceUsd: 96200,
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        units: 2810.25,
        averageCostUsd: 2280,
        spotPriceUsd: 3290,
    },
    {
        symbol: 'SOL',
        name: 'Solana',
        units: 22450,
        averageCostUsd: 122,
        spotPriceUsd: 188,
    },
];

const MARKET_CAP_USD = 34250000;
const SHARES_OUTSTANDING = 12750000;
const AS_OF_ISO = '2026-02-08T00:00:00.000Z';

export function getTreasurySnapshot(): TreasurySnapshot {
    const assets = BASE_ASSETS.map((asset) => {
        const marketValueUsd = asset.units * asset.spotPriceUsd;
        const costBasisUsd = asset.units * asset.averageCostUsd;
        const unrealizedPnlUsd = marketValueUsd - costBasisUsd;

        return {
            ...asset,
            marketValueUsd,
            costBasisUsd,
            unrealizedPnlUsd,
        };
    });

    const marketValueUsd = assets.reduce((total, asset) => total + asset.marketValueUsd, 0);
    const costBasisUsd = assets.reduce((total, asset) => total + asset.costBasisUsd, 0);
    const netAssetValueUsd = marketValueUsd;
    const navPerShareUsd = netAssetValueUsd / SHARES_OUTSTANDING;
    const mnavRatio = MARKET_CAP_USD / netAssetValueUsd;
    const mnavPremiumPct = (mnavRatio - 1) * 100;
    const unrealizedPnlUsd = marketValueUsd - costBasisUsd;

    return {
        asOfIso: AS_OF_ISO,
        marketCapUsd: MARKET_CAP_USD,
        sharesOutstanding: SHARES_OUTSTANDING,
        assets,
        totals: {
            marketValueUsd,
            costBasisUsd,
            netAssetValueUsd,
            navPerShareUsd,
            mnavRatio,
            mnavPremiumPct,
            unrealizedPnlUsd,
        },
    };
}
