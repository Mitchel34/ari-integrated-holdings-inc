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
    { href: '/disclosures', label: 'Disclosures' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
] as const;
