import { Container } from '../../components/ui/Container';
import styles from '../page.module.css';

export default function TeamPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Leadership Team</h1>
                <p>Experienced Leadership with Crypto and AI Expertise</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.textBlock}>
                    <h3>Founder & CEO</h3>
                    <p>
                        Visionary entrepreneur with over 15 years of experience in technology and finance.
                        Spearheads capital allocation and strategic direction.
                    </p>
                </div>
                <div className={styles.textBlock}>
                    <h3>Chief Investment Officer (CIO)</h3>
                    <p>
                        Responsible for formulating and implementing the crypto investment strategy.
                        Deep expertise in portfolio construction and risk management.
                    </p>
                </div>
                <div className={styles.textBlock}>
                    <h3>Chief Technology Officer (CTO)</h3>
                    <p>
                        Leads AI development and the Harmony Trading App. Expert in algorithmic trading systems
                        and data analytics.
                    </p>
                </div>
                <div className={styles.textBlock}>
                    <h3>Chief Financial Officer (CFO)</h3>
                    <p>
                        Handles financial operations, reporting, and compliance. Ensures rigorous governance
                        and audit-readiness.
                    </p>
                </div>
            </div>
        </Container>
    );
}
