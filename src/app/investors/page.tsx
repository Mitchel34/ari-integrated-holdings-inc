import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, BellRing, CalendarClock, CalendarX2, FileText, Mail } from 'lucide-react';
import { PageHero } from '../../components/layout/PageHero';
import { Section } from '../../components/layout/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AssetChip } from '../../components/brand/AssetChip';
import { AlertSignupForm } from '../../components/investor/AlertSignupForm';
import { TreasurySnapshot } from '../../components/treasury/TreasurySnapshot';
import { formatIsoDate, formatProseDate, formatUtcTime } from '../../components/investor/format';
import { CONTACT } from '@/lib/site';
import { getTreasuryFreshness, getTreasurySnapshot } from '@/lib/treasury/snapshot';
import {
    getInvestorDocuments,
    getPastInvestorEvents,
    getUpcomingInvestorEvents,
} from '@/lib/investor/disclosures';
import styles from './investors.module.css';

export const metadata: Metadata = {
    title: 'Investor Relations',
    description:
        'Public treasury summary, investor documents, events, and alert signup for Ari Integrated Holdings Inc. Every figure is exact, dated, and sourced from the CFO report.',
    alternates: { canonical: '/investors' },
};

/** Re-render hourly so the freshness age stays honest between deploys. */
export const revalidate = 3600;

function documentTone(type: string): 'gold' | 'neutral' {
    return type === 'Treasury Update' ? 'gold' : 'neutral';
}

export default function InvestorsPage() {
    const snapshot = getTreasurySnapshot();
    const freshness = getTreasuryFreshness(snapshot);
    const documents = getInvestorDocuments();
    const now = new Date();
    const upcomingEvents = getUpcomingInvestorEvents(now);
    const pastEvents = getPastInvestorEvents(now);

    const asOfIso = formatIsoDate(snapshot.asOfIso);
    const asOfProse = formatProseDate(snapshot.asOfIso);
    const isStale = freshness.status === 'stale';

    return (
        <>
            <PageHero
                eyebrow="Investors"
                title="Investor Relations"
                lead="Transparency and disclosure discipline over promotion. The treasury is reported exactly as the CFO books it, every material update is published here, and all correspondence is routed to one accountable officer."
                meta={
                    <>
                        <span>Treasury as of {asOfIso}</span>
                        <span className={isStale ? styles.metaWarn : styles.metaOk}>
                            {isStale ? <AlertTriangle aria-hidden="true" focusable="false" /> : null}
                            {freshness.label}
                        </span>
                        <span>{snapshot.sourceLabel}</span>
                    </>
                }
                actions={
                    <>
                        <Button asChild variant="secondary">
                            <a href="#alerts">Subscribe to alerts</a>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/disclosures">Read disclosures</Link>
                        </Button>
                    </>
                }
            />

            <Section compact aria-labelledby="treasury-heading">
                <SectionHeader
                    id="treasury-heading"
                    className={styles.treasuryHeader}
                    eyebrow="Treasury"
                    title="Public treasury summary"
                    lead="An early-stage treasury reported without adjustment. Holdings are ETF wrappers for BTC, ETH, and SOL, valued at the prices on the CFO balance sheet rather than a live feed."
                    aside={
                        <AssetChip tone={isStale ? 'warn' : 'pos'} size="md">
                            {isStale ? 'Stale' : 'Current'} · as of {asOfIso}
                        </AssetChip>
                    }
                />
                <TreasurySnapshot snapshot={snapshot} freshness={freshness} headingId="treasury-heading" />
            </Section>

            <Section tone="alt" hairline aria-label="Documents and events">
                <div className={styles.split}>
                    <div>
                        <SectionHeader
                            id="documents-heading"
                            eyebrow="Documents"
                            title="Investor documents"
                            lead="Reports and policies referenced by the disclosures, in reverse date order."
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
                                            <time className="mono" dateTime={formatIsoDate(doc.dateIso)}>
                                                {formatIsoDate(doc.dateIso)}
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
                                                    {formatIsoDate(event.startsAtIso)} · {formatUtcTime(event.startsAtIso)}
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

                        {pastEvents.length > 0 ? (
                            <>
                                <h3 className={styles.subheading}>Recent investor events</h3>
                                <ul className={styles.list} aria-label="Recent investor events">
                                    {pastEvents.map((event) => (
                                        <li key={event.id} className={`glass-1 ${styles.row} ${styles.rowPast}`}>
                                            <span className={styles.dateBlock}>
                                                <time className="mono" dateTime={event.startsAtIso}>
                                                    {formatIsoDate(event.startsAtIso)}
                                                </time>
                                                <span className="mono">{formatUtcTime(event.startsAtIso)}</span>
                                            </span>
                                            <span className={styles.rowBody}>
                                                <span className={styles.rowTitle}>{event.title}</span>
                                                <span className={styles.rowText}>{event.description}</span>
                                                <span className={styles.rowMeta}>
                                                    <span>{event.location}</span>
                                                </span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : null}
                    </div>
                </div>
            </Section>

            <Section id="alerts" className={styles.anchor} aria-labelledby="alerts-heading">
                <SectionHeader
                    id="alerts-heading"
                    eyebrow="Stay informed"
                    title="Alerts and correspondence"
                    lead="One list for material updates, one officer for questions. No newsletters, no marketing sequences."
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
                            Receive a notice when a treasury update, disclosure, or investor event is published.
                        </p>
                        <AlertSignupForm source="investors-page" />
                    </Card>

                    <Card variant="glass" as="article" aria-labelledby="contact-card-heading">
                        <div className={styles.cardHead}>
                            <span className={styles.iconBox} aria-hidden="true">
                                <Mail focusable="false" />
                            </span>
                            <h3 id="contact-card-heading">Investor correspondence</h3>
                        </div>
                        <p className={styles.cardLead}>
                            Diligence requests, partnership discussions, and shareholder questions are routed to the
                            Chief Technology Officer, who responds {CONTACT.responseWindow}.
                        </p>
                        <dl className={styles.contact}>
                            <div>
                                <dt>Officer</dt>
                                <dd>{CONTACT.name}</dd>
                            </div>
                            <div>
                                <dt>Title</dt>
                                <dd>{CONTACT.title}</dd>
                            </div>
                            <div>
                                <dt>Email</dt>
                                <dd>
                                    <a href={CONTACT.mailto} className={`mono ${styles.email}`}>{CONTACT.email}</a>
                                </dd>
                            </div>
                        </dl>
                        <div className={styles.cardActions}>
                            <Button asChild variant="secondary">
                                <Link href="/contact">Contact the CTO</Link>
                            </Button>
                        </div>
                    </Card>
                </div>

                <p className={styles.disclosure}>
                    Nothing on this page is an offer to sell or a solicitation to buy securities. Treasury figures are
                    unaudited and reflect the CFO report dated {asOfProse}. Digital assets and the ETFs that hold them
                    are volatile; unrealized results can change materially between reports.
                </p>
            </Section>
        </>
    );
}
