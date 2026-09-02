import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getTreasuryFreshness, getTreasurySnapshot } from '@/lib/treasury/snapshot';
import { prisma } from '@/lib/prisma';
import { ExecutiveDashboardView } from './ExecutiveDashboardView';

export const metadata: Metadata = {
    title: 'Executive Dashboard',
    description: 'Investor communications, treasury freshness, and trading-system readiness for Ari executives.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/executive/dashboard' },
};

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

export default async function ExecutiveDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login?callbackUrl=/executive/dashboard');
    }

    const user = session.user as ExtendedUser;
    const snapshot = getTreasurySnapshot();
    const freshness = getTreasuryFreshness(snapshot);

    let subscriberCount = 0;
    let investorCount = 0;
    let recentSubscribers: { email: string; subscribedAt: Date; source: string | null }[] = [];
    let dbError: string | null = null;

    try {
        [subscriberCount, investorCount, recentSubscribers] = await Promise.all([
            prisma.investorAlert.count({ where: { isActive: true } }),
            prisma.user.count({ where: { role: 'INVESTOR' } }),
            prisma.investorAlert.findMany({
                orderBy: { subscribedAt: 'desc' },
                take: 20,
            }),
        ]);
    } catch (error) {
        dbError = error instanceof Error ? error.message : 'Database is unavailable.';
    }

    return (
        <ExecutiveDashboardView
            firstName={user?.name?.split(' ')[0] || 'Executive'}
            snapshot={snapshot}
            freshness={freshness}
            subscriberCount={subscriberCount}
            investorCount={investorCount}
            recentSubscribers={recentSubscribers.map((sub) => ({
                email: sub.email,
                source: sub.source,
                subscribedAtIso: sub.subscribedAt.toISOString(),
            }))}
            dbError={dbError}
        />
    );
}
