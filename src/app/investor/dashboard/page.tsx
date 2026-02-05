import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Container } from '../../../components/ui/Container';
import CalendarView from '../../../components/CalendarView';
import styles from './page.module.css';

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

export default async function InvestorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/investor/dashboard');
    }

    const user = session.user as ExtendedUser;

    return (
        <div className={styles.dashboardPage}>
            <Container className={styles.dashboardContainer}>
                <div className={styles.welcomeCard}>
                    <div className={styles.welcomeHeader}>
                        <div className={styles.avatarLarge}>
                            {user?.name?.charAt(0) || 'I'}
                        </div>
                        <div className={styles.welcomeText}>
                            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Investor'}</h1>
                            <p>Access your investment portfolio and upcoming events</p>
                        </div>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Portfolio Status</span>
                            <span className={styles.statValue}>Active</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Upcoming Events</span>
                            <span className={styles.statValue}>3</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10,9 9,9 8,9" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Reports Available</span>
                            <span className={styles.statValue}>2</span>
                        </div>
                    </div>
                </div>

                <div className={styles.calendarSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Investment Calendar</h2>
                        <p>Upcoming earnings calls, reports, and key dates</p>
                    </div>
                    <div className={styles.calendarWrapper}>
                        <CalendarView />
                    </div>
                </div>
            </Container>
        </div>
    );
}
