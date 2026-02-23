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
                        U.S. Military Veteran and visionary entrepreneur with over 15 years of experience in technology, finance, and cross-functional leadership. Leveraging disciplined operational strategies honed in military service, he spearheads capital allocation, strategic direction, and financial operations. Ensures rigorous governance and audit-readiness across all corporate initiatives.
                    </p>
                </div>
                <div className={styles.textBlock}>
                    <h2>Judith Carson</h2>
                    <h3>Chief Marketing Officer</h3>
                    <p>
                        U.S. Military Veteran and accomplished strategic leader. Drawing on extensive experience in mission-critical communications and global operations, she leads brand strategy, investor relations, and market positioning. Drives awareness and fosters engagement across all stakeholder channels with precision and strategic foresight.
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
