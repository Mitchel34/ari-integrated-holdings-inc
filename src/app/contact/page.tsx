import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import styles from '../page.module.css';

export default function ContactPage() {
    return (
        <>
        <section className={styles.pageHeroSection}>
            <Container>
                <div className={styles.sectionHeader}>
                    <h1>Contact Us</h1>
                    <p>Investor inquiries, partnership discussions, and media relations.</p>
                </div>
            </Container>
        </section>

        <Container className={styles.section}>
            <div className={styles.grid}>
                <Card variant="glass">
                    <div className={styles.cardIcon}>
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#contactGold1)" strokeWidth="1.5"/>
                            <defs><linearGradient id="contactGold1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                        </svg>
                    </div>
                    <h2>Investor Inquiries</h2>
                    <p>
                        For diligence requests, partnership discussions, or general investor relations
                        questions, reach out directly to our team. We respond to verified investor
                        inquiries as soon as possible.
                    </p>
                    <Button asChild size="lg">
                        <a href="mailto:contact@ariholdings.com?subject=Investor%20Inquiry">Send Inquiry</a>
                    </Button>
                </Card>

                <Card variant="glass">
                    <div className={styles.cardIcon}>
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="2" y="4" width="20" height="16" rx="2" stroke="url(#contactGold2)" strokeWidth="1.5"/>
                            <polyline points="2,6 12,14 22,6" stroke="url(#contactGold2)" strokeWidth="1.5"/>
                            <defs><linearGradient id="contactGold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                        </svg>
                    </div>
                    <h2>Direct Contact</h2>
                    <p>
                        Reach the Investor Relations team by email. For time-sensitive or media
                        inquiries, include a relevant subject line for faster routing.
                    </p>
                    <p className={styles.listMeta} style={{ fontSize: '0.95rem', color: 'var(--color-accent-gold-bright)', marginBottom: '1rem' }}>
                        contact@ariholdings.com
                    </p>
                    <Button asChild size="lg" variant="outline">
                        <a href="mailto:contact@ariholdings.com">Send Email</a>
                    </Button>
                </Card>
            </div>

            <section className={styles.contactPanel} aria-label="Response information">
                <div className={styles.textBlock}>
                    <h2>Response Times</h2>
                    <p>
                        Our team reviews all inquiries and responds to verified investor requests within
                        2–3 business days. Partnership and media inquiries may take additional time
                        depending on volume.
                    </p>
                </div>
            </section>
        </Container>
        </>
    );
}
