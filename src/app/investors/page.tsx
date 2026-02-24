import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TreasurySnapshot } from '../../components/treasury/TreasurySnapshot';
import { AlertSignupForm } from '../../components/investor/AlertSignupForm';
import {
    getDisclosures,
    getInvestorDocuments,
    getInvestorEvents,
} from '@/lib/investor/disclosures';
import styles from '../page.module.css';

function formatDate(dateIso: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(new Date(dateIso));
}

function formatDateTime(dateIso: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    }).format(new Date(dateIso));
}

export default function InvestorsPage() {
    const disclosures = getDisclosures().slice(0, 3);
    const documents = getInvestorDocuments().slice(0, 4);
    const events = getInvestorEvents();

    return (
        <>
        <section className={styles.pageHeroSection}>
            <Container>
                <div className={styles.sectionHeader}>
                    <h1>Investor Relations</h1>
                    <p>Transparency, disclosure discipline, and long-term treasury execution.</p>
                </div>
            </Container>
        </section>

        <Container className={styles.section}>
            <section aria-labelledby="treasury-snapshot-heading">
                <div className={styles.sectionHeader}>
                    <h2 id="treasury-snapshot-heading">Treasury Snapshot</h2>
                    <p>
                        BTC, ETH, and SOL holdings, valuation, and mNAV context published for investor review.
                    </p>
                </div>
                <TreasurySnapshot withDisclosureLink />
            </section>

            <section className={styles.sectionPanel} aria-labelledby="ir-hub-heading">
                <h2 id="ir-hub-heading" className={styles.srOnly}>
                    Investor Relations hub
                </h2>

                <div className={styles.grid}>
                    <Card variant="glass">
                        <div className={styles.cardIcon}>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#investorGold1)" strokeWidth="1.5"/>
                                <defs><linearGradient id="investorGold1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                            </svg>
                        </div>
                        <h3>Latest Disclosures</h3>
                        <ul className={styles.infoList}>
                            {disclosures.map((item) => (
                                <li key={item.id} className={styles.infoListItem}>
                                    <p className={styles.listMeta}>{item.category} | {formatDate(item.publishedAtIso)}</p>
                                    <p className={styles.listTitle}>{item.title}</p>
                                </li>
                            ))}
                        </ul>
                        <p className={styles.linkRow}>
                            <Link href="/disclosures">View all disclosures</Link>
                        </p>
                    </Card>

                    <Card variant="glass">
                        <div className={styles.cardIcon}>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#investorGold2)" strokeWidth="1.5"/>
                                <defs><linearGradient id="investorGold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                            </svg>
                        </div>
                        <h3>Investor Documents</h3>
                        <ul className={styles.infoList}>
                            {documents.map((item) => (
                                <li key={item.id} className={styles.infoListItem}>
                                    <p className={styles.listMeta}>{item.type} | {formatDate(item.dateIso)}</p>
                                    <p className={styles.listTitle}>
                                        <Link href={item.href}>{item.title}</Link>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card variant="glass">
                        <div className={styles.cardIcon}>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#investorGold3)" strokeWidth="1.5"/>
                                <defs><linearGradient id="investorGold3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                            </svg>
                        </div>
                        <h3>Upcoming Events</h3>
                        <ul className={styles.infoList}>
                            {events.map((event) => (
                                <li key={event.id} className={styles.infoListItem}>
                                    <p className={styles.listMeta}>{formatDateTime(event.startsAtIso)}</p>
                                    <p className={styles.listTitle}>{event.title}</p>
                                    <p>{event.description}</p>
                                    <p className={styles.listMeta}>Location: {event.location}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </section>

            <section className={styles.contactPanel} aria-labelledby="investor-contact-heading">
                <div className={styles.grid}>
                    <Card variant="glass">
                        <div className={styles.cardIcon}>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#investorGold4)" strokeWidth="1.5"/>
                                <defs><linearGradient id="investorGold4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                            </svg>
                        </div>
                        <h2 id="investor-contact-heading">Investor Contact</h2>
                        <p>
                            For diligence inquiries, partnership requests, or direct investor communication,
                            contact the Investor Relations team.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/contact">Contact Investor Relations</Link>
                        </Button>
                    </Card>

                    <Card variant="glass">
                        <div className={styles.cardIcon}>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#investorGold5)" strokeWidth="1.5"/>
                                <defs><linearGradient id="investorGold5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                            </svg>
                        </div>
                        <h2>Email Alerts</h2>
                        <AlertSignupForm />
                    </Card>
                </div>
            </section>
        </Container>
        </>
    );
}
