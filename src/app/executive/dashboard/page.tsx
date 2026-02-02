import { Container } from '../../../components/ui/Container';
import CalendarView from '../../../components/CalendarView';
import { getServerSession } from "next-auth/next"
import { GET } from "../../api/auth/[...nextauth]/route"
import styles from './page.module.css';

export default async function ExecutiveDashboard() {
    const session = await getServerSession(GET);

    return (
        <Container className={styles.dashboard}>
            <div className={styles.header}>
                <h1>Executive Dashboard</h1>
                <p>Welcome back, {session?.user?.name}</p>
            </div>

            <div className={styles.calendarSection}>
                <CalendarView />
            </div>
        </Container>
    );
}
