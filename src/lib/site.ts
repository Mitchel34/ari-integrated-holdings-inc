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

export interface AllocationTarget {
    symbol: AssetSymbol;
    name: string;
    /** Target treasury weight, in percent. */
    weight: number;
    /** ETF wrapper used to obtain exposure. */
    etf: string;
    etfName: string;
    role: string;
    summary: string;
}

/** The 50 / 30 / 20 target allocation that anchors the treasury strategy. */
export const ALLOCATION: readonly AllocationTarget[] = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        weight: 50,
        etf: 'ARKB',
        etfName: 'ARK 21Shares Bitcoin ETF',
        role: 'Monetary core',
        summary: 'Monetary asset and digital collateral anchor with the deepest liquidity and lowest protocol risk.',
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        weight: 30,
        etf: 'FETH',
        etfName: 'Fidelity Ethereum ETF',
        role: 'Settlement layer',
        summary: 'Programmable settlement and institutional finance rails with moderate risk and structural upside.',
    },
    {
        symbol: 'SOL',
        name: 'Solana',
        weight: 20,
        etf: 'FSOL',
        etfName: 'Franklin Solana ETF',
        role: 'Growth optionality',
        summary: 'High-throughput execution layer with higher beta and AI-adjacent growth convexity.',
    },
] as const;

export const PRIMARY_NAV = [
    { href: '/thesis', label: 'Thesis' },
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
