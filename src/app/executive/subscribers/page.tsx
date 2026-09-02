import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, UserCheck, UserX, Users } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
    DashboardHeader,
    DashboardPanel,
    DashboardShell,
    MetricCard,
    MetricGrid,
    formatNumber,
} from '@/components/dashboard/Dashboard';
import SubscriberList from './SubscriberList';

export const metadata: Metadata = {
    title: 'Subscribers',
    description: 'Manage investor alert subscribers: search, filter, export, and toggle active status.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/executive/subscribers' },
};

export default async function SubscribersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'EXECUTIVE' && session.user.role !== 'ADMIN')) {
        return null;
    }

    let subscribers: { id: string; email: string; subscribedAt: Date; isActive: boolean; source: string | null }[] = [];
    let totalCount = 0;
    let activeCount = 0;

    try {
        [subscribers, totalCount, activeCount] = await Promise.all([
            prisma.investorAlert.findMany({
                orderBy: { subscribedAt: 'desc' },
            }),
            prisma.investorAlert.count(),
            prisma.investorAlert.count({ where: { isActive: true } }),
        ]);
    } catch {
        // DB not available
    }

    return (
        <Container>
            <DashboardShell>
                <DashboardHeader
                    eyebrow="Executive"
                    title="Subscribers"
                    description="Manage investor alert subscribers. Deactivated addresses stop receiving broadcasts but remain on record."
                    aside={(
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/executive/dashboard">
                                <ArrowLeft aria-hidden="true" size={16} />
                                Back to dashboard
                            </Link>
                        </Button>
                    )}
                />

                <MetricGrid columns={3}>
                    <MetricCard icon={<Users aria-hidden="true" />} label="Total" value={formatNumber(totalCount, 0)} sub="All alert signups on record" />
                    <MetricCard icon={<UserCheck aria-hidden="true" />} label="Active" value={formatNumber(activeCount, 0)} sub="Receiving investor broadcasts" />
                    <MetricCard icon={<UserX aria-hidden="true" />} label="Inactive" value={formatNumber(totalCount - activeCount, 0)} sub="Deactivated or unsubscribed" />
                </MetricGrid>

                <DashboardPanel
                    eyebrow="Investors"
                    title="Subscriber list"
                    description="Search by email, filter by status, or export the current view as CSV."
                >
                    <SubscriberList initialSubscribers={subscribers.map((s) => ({
                        ...s,
                        subscribedAt: s.subscribedAt.toISOString(),
                    }))} />
                </DashboardPanel>
            </DashboardShell>
        </Container>
    );
}
