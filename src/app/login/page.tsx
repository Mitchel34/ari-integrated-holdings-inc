import { Container } from '../../components/ui/Container';
import styles from '../page.module.css';

export default function LoginPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Investor Login</h1>
                <p>Secure portal access for authorized investors.</p>
            </div>

            <div className={styles.textBlock}>
                <h2>Portal Access</h2>
                <p>
                    Investor portal access is provided to verified investors only. If you need access
                    or have questions about onboarding, please contact the Ari Integrated Holdings Inc. team.
                </p>
            </div>
        </Container>
    );
}
