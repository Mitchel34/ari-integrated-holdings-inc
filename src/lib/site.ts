/**
 * Central site configuration.
 *
 * Every public-facing contact detail, brand string, and allocation constant
 * lives here so that a single edit updates the whole site.
 */

export const SITE = {
    name: 'Ari Integrated Holdings Inc.',
    shortName: 'Ari Integrated Holdings',
    legalName: 'Ari Integrated Holdings Inc.',
    domain: 'ariintegratedholdings.com',
    tagline: 'Building the Strategic Reserve of the Digital Age',
    description:
        'Ari Integrated Holdings Inc. is a disciplined, long-horizon digital-asset treasury company holding BTC, ETH, and SOL exposure through a 50 / 30 / 20 allocation framework, supported by AI-assisted oversight and transparent investor disclosures.',
    /** Default founding year shown in legal footers. */
    foundedYear: 2025,
} as const;

/**
 * All inbound correspondence (contact inquiries, alert signups, meeting
 * notifications, press, and partnership requests) is routed to the CTO.
 */
export const CONTACT = {
    name: 'Mitchel Carson',
    title: 'Chief Technology Officer',
    email: 'mitchelcarson@ariintegratedholdings.com',
    mailto: 'mailto:mitchelcarson@ariintegratedholdings.com',
    responseWindow: 'within two business days',
} as const;

/** Absolute site URL, honoring deployment overrides. */
export function getSiteUrl(): string {
    const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;
    if (configured) {
        return configured.replace(/\/+$/, '');
    }
    return `https://${SITE.domain}`;
}

export type AssetSymbol = 'BTC' | 'ETH' | 'SOL';
/** Lower-case asset id used in URLs and section anchors (`/assets#btc`). */
export type AssetKey = 'btc' | 'eth' | 'sol';

export interface AllocationTarget {
    symbol: AssetSymbol;
    key: AssetKey;
    name: string;
    /** Currency glyph shown in badges. */
    glyph: string;
    /** Target treasury weight, in percent. */
    weight: number;
    /** ETF wrapper used to obtain exposure. */
    etf: string;
    etfName: string;
    /** Short role label, e.g. "Monetary core". */
    role: string;
    summary: string;
    /** Layer description from the portfolio construction lens. */
    layer: string;
    /** Statements shown beside the allocation ring when the asset is selected. */
    points: readonly string[];
    /** Thesis "Why this mix" statement. */
    whyThisMix: string;
    /** Public facts for the Assets page. No performance figures. */
    launchedYear: number;
    consensus: string;
    riskTier: string;
    whatItIs: string;
    roleInTreasury: string;
    whatToWeigh: string;
}

/**
 * The 50 / 30 / 20 target allocation that anchors the treasury strategy.
 * Describes strategy only: target weights, roles, and public facts about each
 * asset. Never current holdings or performance.
 */
export const ALLOCATION: readonly AllocationTarget[] = [
    {
        symbol: 'BTC',
        key: 'btc',
        name: 'Bitcoin',
        glyph: '₿',
        weight: 50,
        etf: 'ARKB',
        etfName: 'ARK 21Shares Bitcoin ETF',
        role: 'Monetary core',
        summary: 'Monetary asset and digital collateral anchor with the deepest liquidity and lowest protocol risk.',
        layer: 'Monetary asset and digital collateral layer',
        points: [
            'The monetary core and digital collateral anchor.',
            'Strongest liquidity profile and lowest protocol risk.',
            'Anchors the portfolio and dampens relative protocol risk.',
        ],
        whyThisMix: 'Monetary core with the lowest protocol risk and deepest liquidity.',
        launchedYear: 2009,
        consensus: 'Proof-of-work',
        riskTier: 'Lowest protocol risk of the three',
        whatItIs:
            'Bitcoin is the first digital asset and the largest by market value. Its supply is capped at 21 million coins, and the network is secured by proof-of-work mining.',
        roleInTreasury:
            'BTC is the monetary core and digital collateral anchor of the treasury. It carries the lowest protocol risk and the deepest liquidity of the three assets, so it anchors the portfolio and dampens relative protocol risk.',
        whatToWeigh:
            'Even as the anchor, BTC is a digital asset. Drawdowns can be moderate to high in absolute terms.',
    },
    {
        symbol: 'ETH',
        key: 'eth',
        name: 'Ethereum',
        glyph: 'Ξ',
        weight: 30,
        etf: 'FETH',
        etfName: 'Fidelity Ethereum ETF',
        role: 'Settlement layer',
        summary: 'Programmable settlement and institutional finance rails with moderate risk and structural upside.',
        layer: 'Settlement and programmable finance layer',
        points: [
            'Programmable settlement and institutional finance rails.',
            'Moderate risk and upside.',
            'Contributes utility exposure and potential staking-driven return support.',
        ],
        whyThisMix: 'Programmable settlement layer with institutional finance relevance.',
        launchedYear: 2015,
        consensus: 'Proof-of-stake',
        riskTier: 'Moderate risk and upside',
        whatItIs:
            'Ethereum is a programmable blockchain that runs smart contracts. It is a base layer for stablecoins, tokenized assets, and decentralized finance, and has been secured by proof-of-stake since 2022.',
        roleInTreasury:
            'ETH is the settlement and programmable finance layer, with institutional finance relevance. It contributes utility exposure and potential staking-driven return support.',
        whatToWeigh:
            'ETH carries more risk than BTC, with moderate risk and upside. Early ETH price data is limited compared with mature public market datasets.',
    },
    {
        symbol: 'SOL',
        key: 'sol',
        name: 'Solana',
        glyph: '◎',
        weight: 20,
        etf: 'FSOL',
        etfName: 'Franklin Solana ETF',
        role: 'Growth optionality',
        summary: 'High-throughput execution layer with higher beta and AI-adjacent growth convexity.',
        layer: 'High-beta, high-volatility execution layer',
        points: [
            'High-throughput, AI-adjacent growth optionality.',
            'Higher beta and growth convexity.',
            'Offers growth convexity if high-throughput chains win AI, gaming, and consumer rails.',
        ],
        whyThisMix: 'High-throughput execution exposure with AI-adjacent optionality.',
        launchedYear: 2020,
        consensus: 'Proof-of-stake with proof-of-history',
        riskTier: 'Highest beta and volatility of the three',
        whatItIs:
            'Solana is a high-throughput blockchain built for fast, low-cost transactions. Its mainnet launched in 2020, and it pairs proof-of-stake with a clock mechanism called proof-of-history.',
        roleInTreasury:
            'SOL is the high-throughput execution layer, with AI-adjacent growth optionality. It offers growth convexity if high-throughput chains win AI, gaming, and consumer rails.',
        whatToWeigh:
            'SOL is the highest-beta, highest-volatility position of the three and is held at the smallest weight. It does not yet have a full 10-year price history.',
    },
] as const;

export const ASSET_KEYS: readonly AssetKey[] = ALLOCATION.map((asset) => asset.key);

export type AssetWeights = Record<AssetKey, number>;

/** Target weights keyed by asset id. */
export const TARGET_WEIGHTS: AssetWeights = Object.fromEntries(
    ALLOCATION.map((asset) => [asset.key, asset.weight]),
) as AssetWeights;

/** Look up an allocation target by its lower-case id or ticker symbol. */
export function getAsset(keyOrSymbol: string): AllocationTarget {
    const needle = keyOrSymbol.toLowerCase();
    return ALLOCATION.find((asset) => asset.key === needle || asset.symbol.toLowerCase() === needle) ?? ALLOCATION[0];
}

export const PRIMARY_NAV = [
    { href: '/thesis', label: 'Thesis' },
    { href: '/assets', label: 'Assets' },
    { href: '/harmony', label: 'Harmony' },
    { href: '/investors', label: 'Investors' },
    { href: '/updates', label: 'Updates' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
] as const;

/**
 * Public positioning of the treasury. Describes strategy and process only;
 * no current values, holdings, or performance are published on the public site.
 */
export const TREASURY_FRAMEWORK = {
    title: 'A disciplined treasury framework',
    summary:
        'Ari maintains long-term digital-asset exposure through regulated investment vehicles, guided by defined allocation principles, risk monitoring, and board-level oversight.',
} as const;

/** The three qualitative principles shown wherever the treasury is introduced. */
export const PRINCIPLES = [
    {
        id: 'horizon',
        title: 'Long-term horizon',
        text: 'A ten-year investment horizon focused on balance sheet strength and disciplined capital deployment rather than short-term trading.',
    },
    {
        id: 'vehicles',
        title: 'ETF-based exposure',
        text: 'Exposure is held through regulated spot ETFs (ARKB, FETH, FSOL) rather than direct custody.',
    },
    {
        id: 'governance',
        title: 'Human governance',
        text: 'AI-assisted analysis informs the work; allocation, risk, and disclosure decisions rest with the board and executive team.',
    },
] as const;

/** Harmony: an internal technology platform, not a business line. */
export const HARMONY = {
    name: 'Harmony',
    tagline: "Ari's internal technology platform for treasury research, risk analysis, and controlled strategy evaluation.",
    positioning:
        "Harmony is Ari's internal technology platform for treasury research, risk analysis, and controlled strategy evaluation. It supports human decision-making and operates within defined governance and risk boundaries.",
} as const;

/**
 * Governing law named in the Terms of Service. Set by counsel (for example
 * 'Delaware'); while null, the Terms refer to the state of organization.
 */
export const GOVERNING_LAW_STATE: string | null = null;
