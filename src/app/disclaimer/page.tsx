import { Container } from '../../components/ui/Container';
import styles from '../page.module.css';

export default function DisclaimerPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Disclaimer</h1>
                <p>Important information about this site and its content.</p>
            </div>

            <div className={styles.textBlock}>
                <h2>Investment Risk</h2>
                <p>
                    Digital assets are speculative, highly volatile, and may result in substantial
                    losses. Nothing on this site should be considered investment, legal, or tax advice.
                </p>
            </div>
        </Container>
    );
}
