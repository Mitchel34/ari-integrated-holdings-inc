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
                    <h2>Curtis Carson</h2>
                    <h3>Chief Executive Officer & Chief Financial Officer</h3>
                    <p>
                        Visionary entrepreneur with over 15 years of experience in technology and finance.
                        Spearheads capital allocation, strategic direction, and financial operations.
                        Ensures rigorous governance and audit-readiness.
                    </p>
                </div>
                <div className={styles.textBlock}>
                    <h2>Judith Carson</h2>
                    <h3>Chief Marketing Officer</h3>
                    <p>
                        Leads brand strategy, investor relations, and market positioning.
                        Drives awareness and engagement across all stakeholder channels.
                    </p>
                </div>
                <div className={styles.textBlock}>
                    <h2>Mitchel Carson</h2>
                    <h3>Chief Technology Officer</h3>
                    <p>
                        Leads AI development and the Harmony Trading App. Expert in algorithmic trading systems,
                        data analytics, and software architecture.
                    </p>
                </div>
            </div>
        </Container>
    );
}
