import { Container } from '../../components/ui/Container';
import { MeetingTypeSelector } from '../../components/scheduling/MeetingTypeSelector';
import ContactForm from './ContactForm';
import styles from '../page.module.css';
import contactStyles from './contact.module.css';

export default function ContactPage() {
    return (
        <>
        <section className={styles.pageHeroSection}>
            <Container>
                <div className={styles.sectionHeader}>
                    <h1>Contact Us</h1>
                    <p>Schedule a meeting with our team or send us a direct inquiry.</p>
                </div>
            </Container>
        </section>

        <Container className={styles.section}>

            {/* Schedule a meeting */}
            <div className={contactStyles.scheduleSection}>
                <div className={contactStyles.scheduleSectionHeader}>
                    <h2>Schedule a Meeting</h2>
                    <p>
                        Select a meeting type and book directly on our calendar. All meetings include
                        a confirmation email with call details.
                    </p>
                </div>
                <MeetingTypeSelector />
            </div>

            {/* Divider */}
            <div className={contactStyles.divider}>
                <span>or send a direct message</span>
            </div>

            {/* Contact form */}
            <div className={contactStyles.formSection}>
                <div className={contactStyles.formHeader}>
                    <h2>Send an Inquiry</h2>
                    <p>
                        For diligence requests, partnership discussions, or general investor relations
                        questions. We respond to all verified investor inquiries.
                    </p>
                </div>
                <ContactForm />
            </div>

            {/* Fallback */}
            <section className={contactStyles.fallbackPanel} aria-label="Direct contact">
                <p>
                    Prefer email?{' '}
                    <a href="mailto:investor-relations@ariholdings.com" className={contactStyles.emailLink}>
                        investor-relations@ariholdings.com
                    </a>
                </p>
            </section>

        </Container>
        </>
    );
}
