// Target allocation model shared by the allocation ring, the basket mixer,
// the thesis page, and the /assets page. Update copy here and every view follows.

export type AssetKey = 'btc' | 'eth' | 'sol';

export interface TargetAsset {
    key: AssetKey;
    symbol: string;
    name: string;
    glyph: string;
    targetPct: number;
    /** CSS color (a custom property defined in globals.css). */
    color: string;
    /** Short role label, e.g. "Monetary core". */
    role: string;
    /** Layer description from the Portfolio Construction Lens. */
    layer: string;
    /** Statements shown beside the allocation ring. */
    points: string[];
    /** Thesis section 02 summary. */
    whyThisMix: string;
    /** Illustrative CAGR, approx. Apr 2020 to Mar 2025, in percent. */
    illustrativeCagrPct: number;
    launchedYear: number;
    consensus: string;
    riskTier: string;
    vehicle: { ticker: string; name: string };
    whatItIs: string;
    roleInTreasury: string;
    whatToWeigh: string;
}

export const TARGET_ASSETS: TargetAsset[] = [
    {
        key: 'btc',
        symbol: 'BTC',
        name: 'Bitcoin',
        glyph: '₿',
        targetPct: 50,
        color: 'var(--color-asset-btc)',
        role: 'Monetary core',
        layer: 'Monetary asset and digital collateral layer',
        points: [
            'The monetary core and digital collateral anchor.',
            'Strongest liquidity profile and lowest protocol risk.',
            'Anchors the portfolio and dampens relative protocol risk.',
        ],
        whyThisMix: 'Monetary core with the lowest protocol risk and deepest liquidity.',
        illustrativeCagrPct: 59,
        launchedYear: 2009,
        consensus: 'Proof-of-work',
        riskTier: 'Lowest protocol risk of the three',
        vehicle: { ticker: 'ARKB', name: 'ARK 21Shares Bitcoin ETF' },
        whatItIs:
            'Bitcoin is the first digital asset and the largest by market value. Its supply is capped at 21 million coins, and the network is secured by proof-of-work mining.',
        roleInTreasury:
            'BTC is the monetary core and digital collateral anchor of the treasury. It carries the lowest protocol risk and the deepest liquidity of the three assets, so it anchors the portfolio and dampens relative protocol risk.',
        whatToWeigh:
            'Even as the anchor, BTC is a digital asset. Drawdowns can be moderate to high in absolute terms.',
    },
    {
        key: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        glyph: 'Ξ',
        targetPct: 30,
        color: 'var(--color-asset-eth)',
        role: 'Settlement layer',
        layer: 'Settlement and programmable finance layer',
        points: [
            'Programmable settlement and institutional finance rails.',
            'Moderate risk and upside.',
            'Contributes utility exposure and potential staking-driven return support.',
        ],
        whyThisMix: 'Programmable settlement layer with institutional finance relevance.',
        illustrativeCagrPct: 55,
        launchedYear: 2015,
        consensus: 'Proof-of-stake',
        riskTier: 'Moderate risk and upside',
        vehicle: { ticker: 'FETH', name: 'Fidelity Ethereum ETF' },
        whatItIs:
            'Ethereum is a programmable blockchain that runs smart contracts. It is a base layer for stablecoins, tokenized assets, and decentralized finance, and has been secured by proof-of-stake since 2022.',
        roleInTreasury:
            'ETH is the settlement and programmable finance layer, with institutional finance relevance. It contributes utility exposure and potential staking-driven return support.',
        whatToWeigh:
            'ETH carries more risk than BTC, with moderate risk and upside. Early ETH price data is limited compared with mature public market datasets.',
    },
    {
        key: 'sol',
        symbol: 'SOL',
        name: 'Solana',
        glyph: '◎',
        targetPct: 20,
        color: 'var(--color-asset-sol)',
        role: 'Execution layer',
        layer: 'High-beta, high-volatility execution layer',
        points: [
            'High-throughput, AI-adjacent growth optionality.',
            'Higher beta and growth convexity.',
            'Offers growth convexity if high-throughput chains win AI, gaming, and consumer rails.',
        ],
        whyThisMix: 'High-throughput execution exposure with AI-adjacent optionality.',
        illustrativeCagrPct: 123,
        launchedYear: 2020,
        consensus: 'Proof-of-stake with proof-of-history',
        riskTier: 'Highest beta and volatility of the three',
        vehicle: { ticker: 'FSOL', name: 'Franklin Solana ETF' },
        whatItIs:
            'Solana is a high-throughput blockchain built for fast, low-cost transactions. Its mainnet launched in 2020, and it pairs proof-of-stake with a clock mechanism called proof-of-history.',
        roleInTreasury:
            'SOL is the high-throughput execution layer, with AI-adjacent optionality. It offers growth convexity if high-throughput chains win AI, gaming, and consumer rails.',
        whatToWeigh:
            'SOL is the highest-beta, highest-volatility position of the three and is held at the smallest weight. It does not yet have a full 10-year price history.',
    },
];

export const ASSET_KEYS: AssetKey[] = TARGET_ASSETS.map((asset) => asset.key);

export type AssetWeights = Record<AssetKey, number>;

export const TARGET_WEIGHTS: AssetWeights = {
    btc: 50,
    eth: 30,
    sol: 20,
};

export function getTargetAsset(key: AssetKey): TargetAsset {
    return TARGET_ASSETS.find((asset) => asset.key === key) ?? TARGET_ASSETS[0];
}

/**
 * Weighted average of the illustrative per-asset CAGR figures.
 * At the 50/30/20 target this is 70.6, which the thesis states as "roughly ~70%".
 */
export function blendedIllustrativeCagrPct(weights: AssetWeights): number {
    return TARGET_ASSETS.reduce(
        (sum, asset) => sum + (weights[asset.key] * asset.illustrativeCagrPct) / 100,
        0,
    );
}
