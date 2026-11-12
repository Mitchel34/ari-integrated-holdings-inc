import { Container } from '../../components/ui/Container';
import styles from '../page.module.css';

export default function PrivacyPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Privacy Policy</h1>
                <p>How we handle personal information.</p>
            </div>

            <div className={styles.textBlock}>
                <h2>Policy Overview</h2>
                <p>
                    We are preparing a full privacy policy for the Ari Integrated Holdings Inc. investor experience.
                    In the meantime, we limit data collection to what is necessary for communications
                    and do not sell personal information.
                </p>
            </div>
        </Container>
    );
}
