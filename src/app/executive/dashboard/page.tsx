import { Container } from '../../../components/ui/Container';
import CalendarView from '../../../components/CalendarView';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import styles from './page.module.css';

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

export default async function ExecutiveDashboard() {
    const session = await getServerSession(authOptions);
    const user = session?.user as ExtendedUser | undefined;

    return (
        <div className={styles.dashboardPage}>
            <Container className={styles.dashboardContainer}>
                <div className={styles.welcomeCard}>
                    <div className={styles.welcomeHeader}>
                        <div className={styles.avatarLarge}>
                            {user?.name?.charAt(0) || 'E'}
                        </div>
                        <div className={styles.welcomeText}>
                            <span className={styles.roleBadge}>Executive</span>
                            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Executive'}</h1>
                            <p>Manage governance workflows and review investor communications</p>
                        </div>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Investor Directory</span>
                            <span className={styles.statValue}>Live data in secure portal</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Treasury Updates</span>
                            <span className={styles.statValue}>Published via disclosures</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
                                <polyline points="17,6 23,6 23,12" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Performance Reporting</span>
                            <span className={styles.statValue}>Published through disclosures</span>
                        </div>
                    </div>
                </div>

                <div className={styles.calendarSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Executive Calendar</h2>
                        <p>Meetings, earnings calls, and strategic events</p>
                    </div>
                    <div className={styles.calendarWrapper}>
                        <CalendarView />
                    </div>
                </div>
            </Container>
        </div>
    );
}
