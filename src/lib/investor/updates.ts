/**
 * Company Updates: current, supportable public announcements only.
 *
 * Treasury figures, financial results, and performance commentary are not
 * published here. Detailed treasury information is available to verified
 * investors through the secure portal.
 */

export type UpdateCategory = 'Company' | 'Governance' | 'Investor Relations';

export interface CompanyUpdate {
    id: string;
    publishedAtIso: string;
    category: UpdateCategory;
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

const UPDATES: CompanyUpdate[] = [
    {
        id: 'investor-relations-refresh-2026',
        publishedAtIso: '2026-09-02T12:00:00.000Z',
        category: 'Investor Relations',
        title: 'Redesigned website and investor portal',
        summary:
            'Ari launched a redesigned corporate website with a secure investor portal, an email alert list for company updates, and a single correspondence channel for investor, partner, and press inquiries.',
    },
    {
        id: 'governance-disclosure-policy',
        publishedAtIso: '2025-12-18T18:00:00.000Z',
        category: 'Governance',
        title: 'Investor communications and governance policy',
        summary:
            'Formalized reporting cadence, material update thresholds, and board-level governance responsibilities for investor communications.',
    },
];

const INVESTOR_DOCUMENTS: InvestorDocument[] = [
    {
        id: 'thesis',
        title: 'Investment Thesis',
        dateIso: '2026-09-02T00:00:00.000Z',
        type: 'Thesis',
        href: '/thesis',
    },
    {
        id: 'governance',
        title: 'Corporate Governance Overview',
        dateIso: '2025-12-18T00:00:00.000Z',
        type: 'Governance',
        href: '/updates#governance-disclosure-policy',
    },
    {
        id: 'risk-disclaimer',
        title: 'Risk Disclaimer',
        dateIso: '2026-09-02T00:00:00.000Z',
        type: 'Disclaimer',
        href: '/disclaimer',
    },
];

/** No investor events are scheduled. Add entries here when a briefing is confirmed. */
const INVESTOR_EVENTS: InvestorEvent[] = [];

function sortByDateDescending<T>(items: T[], getDate: (item: T) => string): T[] {
    return [...items].sort((left, right) => {
        return new Date(getDate(right)).getTime() - new Date(getDate(left)).getTime();
    });
}

export function getCompanyUpdates(): CompanyUpdate[] {
    return sortByDateDescending(UPDATES, (item) => item.publishedAtIso);
}

export function getInvestorDocuments(): InvestorDocument[] {
    return sortByDateDescending(INVESTOR_DOCUMENTS, (item) => item.dateIso);
}

export function getInvestorEvents(): InvestorEvent[] {
    return [...INVESTOR_EVENTS].sort((left, right) => {
        return new Date(left.startsAtIso).getTime() - new Date(right.startsAtIso).getTime();
    });
}

export function getUpcomingInvestorEvents(now = new Date()): InvestorEvent[] {
    const nowMs = now.getTime();
    return getInvestorEvents().filter((event) => new Date(event.startsAtIso).getTime() > nowMs);
}

export function getNextInvestorEvent(now = new Date()): InvestorEvent | null {
    return getUpcomingInvestorEvents(now)[0] ?? null;
}
