import type { Metadata } from 'next';
import { CalendarDays, Clock, ListChecks, Mail } from 'lucide-react';
import { PageHero } from '../../components/layout/PageHero';
import { Section } from '../../components/layout/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MeetingTypeSelector } from '../../components/scheduling/MeetingTypeSelector';
import { CONTACT } from '../../lib/site';
import ContactForm from './ContactForm';
import styles from './contact.module.css';

export const metadata: Metadata = {
    title: 'Contact',
    description: `Investor, partnership, press, and technical inquiries for Ari Integrated Holdings are routed to ${CONTACT.name}, ${CONTACT.title}. Send an inquiry or schedule a meeting.`,
    alternates: { canonical: '/contact' },
};

const [emailLocal, emailDomain] = CONTACT.email.split('@');

export default function ContactPage() {
    return (
        <>
            <PageHero
                eyebrow="Correspondence"
                title="Contact"
                lead={`All correspondence — investor, partnership, press, and technical — is routed to ${CONTACT.name}, ${CONTACT.title}.`}
            />

            <Section flush aria-label="Send an inquiry">
                <div className={styles.grid}>
                    <Card variant="elevated" className={styles.formCard} as="article" aria-labelledby="inquiry-title">
                        <div className={styles.formHead}>
                            <p className="eyebrow">Direct inquiry</p>
                            <h2 id="inquiry-title" className={styles.formTitle}>Send an inquiry</h2>
                            <p className={styles.formLead}>
                                Diligence requests, partnership discussions, press, and technical questions.
                                Replies come from the CTO&apos;s correspondence inbox {CONTACT.responseWindow}.
                            </p>
                        </div>
                        <ContactForm />
                    </Card>

                    <aside className={styles.aside} aria-label="Contact details">
                        <Card variant="glass" className={styles.asideCard}>
                            <div className={styles.cardHead}>
                                <span className={styles.iconBox} aria-hidden="true">
                                    <Mail size={20} strokeWidth={1.75} />
                                </span>
                                <div>
                                    <h2 className={styles.cardTitle}>{CONTACT.name}</h2>
                                    <p className={styles.cardSub}>{CONTACT.title}</p>
                                </div>
                            </div>
                            <a href={CONTACT.mailto} className={`${styles.mailto} mono`}>
                                {emailLocal}@<wbr />{emailDomain}
                            </a>
                            <p className={styles.responseWindow}>
                                <Clock size={16} strokeWidth={1.75} aria-hidden="true" />
                                <span>Replies {CONTACT.responseWindow}</span>
                            </p>
                        </Card>

                        <Card variant="subtle" className={styles.asideCard}>
                            <div className={styles.cardHead}>
                                <span className={styles.iconBox} aria-hidden="true">
                                    <ListChecks size={20} strokeWidth={1.75} />
                                </span>
                                <h2 className={styles.cardTitle}>What to include</h2>
                            </div>
                            <ol className={styles.includeList}>
                                <li>
                                    <span className={`${styles.includeIndex} mono`}>01</span>
                                    <span>Who you are and the entity you represent.</span>
                                </li>
                                <li>
                                    <span className={`${styles.includeIndex} mono`}>02</span>
                                    <span>Your investor type — individual, family office, adviser, institution, or partner.</span>
                                </li>
                                <li>
                                    <span className={`${styles.includeIndex} mono`}>03</span>
                                    <span>What you want to discuss, and any diligence materials you need.</span>
                                </li>
                            </ol>
                        </Card>

                        <Card variant="subtle" className={styles.asideCard}>
                            <div className={styles.cardHead}>
                                <span className={styles.iconBox} aria-hidden="true">
                                    <CalendarDays size={20} strokeWidth={1.75} />
                                </span>
                                <h2 className={styles.cardTitle}>Prefer to talk?</h2>
                            </div>
                            <p className={styles.cardBody}>
                                Book an introduction, an investor briefing, or a partnership discussion
                                directly on the calendar below.
                            </p>
                            <Button asChild variant="secondary" size="md">
                                <a href="#schedule">Schedule a meeting</a>
                            </Button>
                        </Card>
                    </aside>
                </div>
            </Section>

            <Section id="schedule" hairline aria-labelledby="schedule-title">
                <SectionHeader
                    eyebrow="Calendar"
                    id="schedule-title"
                    title="Schedule a meeting"
                    lead="Select a meeting type and book a time. Every booking sends a confirmation with call details, and a copy reaches the CTO's correspondence inbox."
                />
                <MeetingTypeSelector />
            </Section>
        </>
    );
}
