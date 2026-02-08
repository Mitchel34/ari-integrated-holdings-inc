import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
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
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Investor Relations</h1>
                <p>Transparency, disclosure discipline, and long-term treasury execution.</p>
            </div>

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
                    <article className={styles.textBlock}>
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
                    </article>

                    <article className={styles.textBlock}>
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
                    </article>

                    <article className={styles.textBlock}>
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
                    </article>
                </div>
            </section>

            <section className={styles.contactPanel} aria-labelledby="investor-contact-heading">
                <div className={styles.grid}>
                    <article className={styles.textBlock}>
                        <h2 id="investor-contact-heading">Investor Contact</h2>
                        <p>
                            For diligence inquiries, partnership requests, or direct investor communication,
                            contact the Investor Relations team.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/contact">Contact Investor Relations</Link>
                        </Button>
                    </article>

                    <article className={styles.textBlock}>
                        <h2>Email Alerts</h2>
                        <AlertSignupForm />
                    </article>
                </div>
            </section>
        </Container>
    );
}
