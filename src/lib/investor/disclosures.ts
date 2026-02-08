export type DisclosureCategory = 'Treasury Update' | 'Financial Results' | 'Governance' | 'Operations';

export interface DisclosureItem {
    id: string;
    publishedAtIso: string;
    category: DisclosureCategory;
    title: string;
    summary: string;
}

export interface InvestorDocument {
    id: string;
    title: string;
    dateIso: string;
    type: string;
    href: string;
}

export interface InvestorEvent {
    id: string;
    startsAtIso: string;
    title: string;
    description: string;
    location: string;
}

const DISCLOSURES: DisclosureItem[] = [
    {
        id: 'treasury-allocation-q1-2026',
        publishedAtIso: '2026-02-06T14:00:00.000Z',
        category: 'Treasury Update',
        title: 'Q1 2026 Treasury Allocation Update',
        summary:
            'Updated BTC, ETH, and SOL treasury allocations, cost basis progression, and reserve management activity through January 2026.',
    },
    {
        id: 'operations-harmony-briefing',
        publishedAtIso: '2026-01-20T15:30:00.000Z',
        category: 'Operations',
        title: 'Harmony Trading Operational Briefing',
        summary:
            'Summary of supporting subsidiary performance, risk guardrails, and cost-offset contribution for the prior quarter.',
    },
    {
        id: 'fye-2025-shareholder-letter',
        publishedAtIso: '2026-01-08T13:00:00.000Z',
        category: 'Financial Results',
        title: 'Fiscal Year 2025 Shareholder Letter',
        summary:
            'Management commentary on treasury growth, operating posture, and strategic priorities entering 2026.',
    },
    {
        id: 'governance-disclosure-policy',
        publishedAtIso: '2025-12-18T18:00:00.000Z',
        category: 'Governance',
        title: 'Investor Disclosure and Governance Policy',
        summary:
            'Formalized reporting cadence, material update thresholds, and board-level governance responsibilities for disclosures.',
    },
];

const INVESTOR_DOCUMENTS: InvestorDocument[] = [
    {
        id: 'prospectus',
        title: 'Company Prospectus',
        dateIso: '2026-01-25T00:00:00.000Z',
        type: 'Prospectus',
        href: '/thesis',
    },
    {
        id: 'treasury-update',
        title: 'Treasury Update - January 2026',
        dateIso: '2026-02-06T00:00:00.000Z',
        type: 'Treasury Update',
        href: '/disclosures#treasury-allocation-q1-2026',
    },
    {
        id: 'risk-policy',
        title: 'Risk Management Policy Summary',
        dateIso: '2026-01-15T00:00:00.000Z',
        type: 'Policy',
        href: '/disclaimer',
    },
    {
        id: 'governance',
        title: 'Corporate Governance Overview',
        dateIso: '2025-12-18T00:00:00.000Z',
        type: 'Governance',
        href: '/disclosures#governance-disclosure-policy',
    },
];

const INVESTOR_EVENTS: InvestorEvent[] = [
    {
        id: 'march-investor-briefing',
        startsAtIso: '2026-03-12T16:00:00.000Z',
        title: 'Quarterly Investor Briefing',
        description: 'Management call covering treasury performance and strategic priorities.',
        location: 'Virtual webcast',
    },
    {
        id: 'april-financial-review',
        startsAtIso: '2026-04-09T17:00:00.000Z',
        title: 'Q1 Financial Review',
        description: 'Discussion of operating expenses, disclosure cadence, and governance updates.',
        location: 'Virtual webcast',
    },
    {
        id: 'may-strategy-session',
        startsAtIso: '2026-05-14T16:00:00.000Z',
        title: 'Treasury Strategy Session',
        description: 'Review of BTC, ETH, SOL positioning and long-term reserve management framework.',
        location: 'Investor portal',
    },
];

function sortByDateDescending<T>(items: T[], getDate: (item: T) => string): T[] {
    return [...items].sort((left, right) => {
        return new Date(getDate(right)).getTime() - new Date(getDate(left)).getTime();
    });
}

export function getDisclosures(): DisclosureItem[] {
    return sortByDateDescending(DISCLOSURES, (item) => item.publishedAtIso);
}

export function getInvestorDocuments(): InvestorDocument[] {
    return sortByDateDescending(INVESTOR_DOCUMENTS, (item) => item.dateIso);
}

export function getInvestorEvents(): InvestorEvent[] {
    return [...INVESTOR_EVENTS].sort((left, right) => {
        return new Date(left.startsAtIso).getTime() - new Date(right.startsAtIso).getTime();
    });
}
