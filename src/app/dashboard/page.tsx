import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/** Post-login landing: send each role to its own dashboard. */
export default async function DashboardRouter() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/dashboard');
    }

    const role = session.user.role;
    redirect(role === 'EXECUTIVE' || role === 'ADMIN' ? '/executive/dashboard' : '/investor/dashboard');
}
