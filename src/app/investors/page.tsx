import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BellRing, CalendarClock, CalendarX2, FileText, Lock, Mail } from 'lucide-react';
import { PageHero } from '../../components/layout/PageHero';
import { Section } from '../../components/layout/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AssetChip } from '../../components/brand/AssetChip';
import { AlertSignupForm } from '../../components/investor/AlertSignupForm';
import { formatDateIso, formatUtcTime } from '@/lib/format';
import { CONTACT, PRINCIPLES } from '@/lib/site';
import { getInvestorDocuments, getUpcomingInvestorEvents } from '@/lib/investor/updates';
import styles from './investors.module.css';

export const metadata: Metadata = {
    title: 'Investor Relations',
    description:
        'Investor documents, events, and alert signup for Ari Integrated Holdings Inc. Detailed treasury information is available to verified investors through the secure portal.',
    alternates: { canonical: '/investors' },
};

/** Re-render hourly so the upcoming-events filter stays current between deploys. */
export const revalidate = 3600;

function documentTone(type: string): 'gold' | 'neutral' {
    return type === 'Governance' ? 'gold' : 'neutral';
}

export default function InvestorsPage() {
    const documents = getInvestorDocuments();
    const now = new Date();
    const upcomingEvents = getUpcomingInvestorEvents(now);
    const [emailLocal, emailDomain] = CONTACT.email.split('@');

    return (
        <>
            <PageHero
                eyebrow="Investors"
                title="Investor Relations"
                lead="Transparency and disclosure discipline over promotion. Company updates are published here; detailed treasury information is available to verified investors through the secure portal."
                actions={
                    <>
                        <Button asChild variant="secondary">
                            <a href="#alerts">Subscribe to alerts</a>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/updates">Read company updates</Link>
                        </Button>
                    </>
                }
            />

            <Section compact aria-labelledby="treasury-heading">
                <Card variant="elevated" as="article" className={styles.portalCard}>
                    <span className={styles.iconBox} aria-hidden="true">
                        <Lock focusable="false" />
                    </span>
                    <p className="eyebrow">Treasury</p>
                    <h2 id="treasury-heading" className={styles.portalTitle}>
                        Detailed treasury information is available to verified investors through the secure portal.
                    </h2>
                    <p className={styles.portalText}>
                        The portal contains current holdings, cash positions, and the full update history.
                    </p>
                    <div className={styles.portalActions}>
                        <Button asChild variant="primary">
                            <Link href="/login">Investor portal</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/contact">Request access</Link>
                        </Button>
                    </div>
                </Card>

                <ul className={styles.principles} aria-label="Treasury principles">
                    {PRINCIPLES.map((principle) => (
                        <li key={principle.id} className={`glass-1 ${styles.principle}`}>
                            <h3 className={styles.principleTitle}>{principle.title}</h3>
                            <p className={styles.principleText}>{principle.text}</p>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section tone="alt" hairline aria-label="Documents and events">
                <div className={styles.split}>
                    <div>
                        <SectionHeader
                            id="documents-heading"
                            eyebrow="Documents"
                            title="Investor documents"
                            lead="Reference documents describing the strategy, governance, and risk framework, in reverse date order."
                            compact
                        />
                        <ul className={styles.list} aria-labelledby="documents-heading">
                            {documents.map((doc) => (
                                <li key={doc.id} className={`glass-1 ${styles.row}`}>
                                    <span className={styles.iconBox} aria-hidden="true">
                                        <FileText focusable="false" />
                                    </span>
                                    <span className={styles.rowBody}>
                                        <Link href={doc.href} className={styles.rowTitle}>
                                            {doc.title}
                                            <ArrowUpRight aria-hidden="true" focusable="false" />
                                        </Link>
                                        <span className={styles.rowMeta}>
                                            <AssetChip tone={documentTone(doc.type)}>{doc.type}</AssetChip>
                                            <time className="mono" dateTime={formatDateIso(doc.dateIso)}>
                                                {formatDateIso(doc.dateIso)}
                                            </time>
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <SectionHeader
                            id="events-heading"
                            eyebrow="Events"
                            title="Investor events"
                            lead="Management calls and strategy sessions. Times are stated in UTC."
                            compact
                        />

                        <h3 className={styles.subheading}>Upcoming</h3>
                        {upcomingEvents.length > 0 ? (
                            <ul className={styles.list} aria-label="Upcoming investor events">
                                {upcomingEvents.map((event) => (
                                    <li key={event.id} className={`glass-1 ${styles.row}`}>
                                        <span className={styles.iconBox} aria-hidden="true">
                                            <CalendarClock focusable="false" />
                                        </span>
                                        <span className={styles.rowBody}>
                                            <span className={styles.rowTitle}>{event.title}</span>
                                            <span className={styles.rowText}>{event.description}</span>
                                            <span className={styles.rowMeta}>
                                                <time className="mono" dateTime={event.startsAtIso}>
                                                    {formatDateIso(event.startsAtIso)} · {formatUtcTime(event.startsAtIso)}
                                                </time>
                                                <span>{event.location}</span>
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={`glass-1 ${styles.empty}`}>
                                <span className={styles.iconBox} aria-hidden="true">
                                    <CalendarX2 focusable="false" />
                                </span>
                                <span>
                                    No upcoming events scheduled.{' '}
                                    <a href="#alerts" className={styles.inlineLink}>Subscribe to alerts</a> to be notified.
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </Section>

            <Section id="alerts" className={styles.anchor} aria-labelledby="alerts-heading">
                <SectionHeader
                    id="alerts-heading"
                    eyebrow="Stay informed"
                    title="Alerts and contact"
                    lead="One list for company updates, one contact for questions. No newsletters, no marketing sequences."
                />
                <div className={styles.cards}>
                    <Card variant="glass" as="article" aria-labelledby="alerts-card-heading">
                        <div className={styles.cardHead}>
                            <span className={styles.iconBox} aria-hidden="true">
                                <BellRing focusable="false" />
                            </span>
                            <h3 id="alerts-card-heading">Email alerts</h3>
                        </div>
                        <p className={styles.cardLead}>
                            Receive a notice when a company update or investor event is published.
                        </p>
                        <AlertSignupForm source="investors-page" />
                    </Card>

                    <Card variant="glass" as="article" aria-labelledby="contact-card-heading">
                        <div className={styles.cardHead}>
                            <span className={styles.iconBox} aria-hidden="true">
                                <Mail focusable="false" />
                            </span>
                            <h3 id="contact-card-heading">Investor contact</h3>
                        </div>
                        <p className={styles.cardLead}>
                            Diligence requests, partnership discussions, and shareholder questions are welcome.
                            Responses are sent {CONTACT.responseWindow}.
                        </p>
                        <dl className={styles.contact}>
                            <div>
                                <dt>Name</dt>
                                <dd>{CONTACT.name}</dd>
                            </div>
                            <div>
                                <dt>Title</dt>
                                <dd>{CONTACT.title}</dd>
                            </div>
                            <div>
                                <dt>Email</dt>
                                <dd>
                                    <a href={CONTACT.mailto} className={`mono ${styles.email}`}>
                                        {emailLocal}@<wbr />{emailDomain}
                                    </a>
                                </dd>
                            </div>
                        </dl>
                        <div className={styles.cardActions}>
                            <Button asChild variant="secondary">
                                <Link href="/contact">Contact us</Link>
                            </Button>
                        </div>
                    </Card>
                </div>

                <p className={styles.disclosure}>
                    Nothing on this page is an offer to sell or a solicitation to buy securities. Digital assets and
                    the ETFs that hold them are volatile. No performance information is published on the public site.
                </p>
            </Section>
        </>
    );
}
