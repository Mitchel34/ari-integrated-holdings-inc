import { Container } from '../../components/ui/Container';
import { ZoomMeetingScheduler } from '../../components/scheduling/ZoomMeetingScheduler';
import { ContactEmail } from '../../components/ui/ContactEmail';
import { CONTACT_EMAIL } from '@/lib/contact';
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
                        Choose what you would like to discuss and book a Zoom meeting directly on our
                        calendar. All meetings include a confirmation email with call details.
                    </p>
                </div>
                <ZoomMeetingScheduler />
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
                    <a href={`mailto:${CONTACT_EMAIL}`} className={contactStyles.emailLink}>
                        <ContactEmail />
                    </a>
                </p>
            </section>

        </Container>
        </>
    );
}
