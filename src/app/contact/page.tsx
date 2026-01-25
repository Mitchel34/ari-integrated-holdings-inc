import { Container } from '../../components/ui/Container';
import styles from '../page.module.css';

export default function ContactPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Contact Us</h1>
                <p>Investor inquiries and partnership discussions.</p>
            </div>

            <div className={styles.textBlock}>
                <h2>Get in Touch</h2>
                <p>
                    Please share a brief overview of your inquiry, and our team will follow up with
                    next steps. We respond to verified investor requests as soon as possible.
                </p>
            </div>
        </Container>
    );
}
