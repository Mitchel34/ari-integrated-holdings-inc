import { Container } from '../../components/ui/Container';
import styles from '../page.module.css';

export default function TermsPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Terms of Service</h1>
                <p>General terms for using this website.</p>
            </div>

            <div className={styles.textBlock}>
                <h2>Summary</h2>
                <p>
                    This site is provided for informational purposes. We are drafting a complete set
                    of terms and conditions that will govern use of the investor portal and related services.
                </p>
            </div>
        </Container>
    );
}
