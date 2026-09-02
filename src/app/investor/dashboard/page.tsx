import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getTreasuryFreshness, getTreasurySnapshot } from '@/lib/treasury/snapshot';
import { getInvestorDocuments, getNextInvestorEvent } from '@/lib/investor/disclosures';
import { InvestorDashboardView } from './InvestorDashboardView';

export const metadata: Metadata = {
    title: 'Investor Dashboard',
    description: 'Treasury snapshot, investor documents, and upcoming communications for authenticated investors.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/investor/dashboard' },
};

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    createdAt?: string;
}

export default async function InvestorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/investor/dashboard');
    }

    const user = session.user as ExtendedUser;
    const snapshot = getTreasurySnapshot();
    const freshness = getTreasuryFreshness(snapshot);
    const documents = getInvestorDocuments();
    const nextEvent = getNextInvestorEvent();

    return (
        <InvestorDashboardView
            firstName={user?.name?.split(' ')[0] || 'Investor'}
            snapshot={snapshot}
            freshness={freshness}
            documents={documents}
            nextEvent={nextEvent}
        />
    );
}
