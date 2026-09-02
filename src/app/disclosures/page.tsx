import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import { PageHero } from '../../components/layout/PageHero';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AssetChip } from '../../components/brand/AssetChip';
import { formatIsoDate, formatProseDate } from '../../components/investor/format';
import { CONTACT } from '@/lib/site';
import { getDisclosures, type DisclosureCategory } from '@/lib/investor/disclosures';
import styles from './disclosures.module.css';

export const metadata: Metadata = {
    title: 'Disclosures',
    description:
        'Material updates, treasury actions, and financial communications from Ari Integrated Holdings Inc., published in the order they were released, with a machine-readable JSON feed.',
    alternates: { canonical: '/disclosures' },
};

function categoryTone(category: DisclosureCategory): 'gold' | 'neutral' {
    return category === 'Treasury Update' ? 'gold' : 'neutral';
}

export default function DisclosuresPage() {
    const disclosures = getDisclosures();
    const latest = disclosures[0];

    return (
        <>
            <PageHero
                eyebrow="Investors"
                title="Disclosures"
                lead="Material updates, treasury actions, and financial communications, listed as they were published. Each entry is the public summary of the underlying report; the treasury figures it cites are reproduced exactly on the Investor Relations page."
                meta={
                    <>
                        <span>{disclosures.length} entries</span>
                        {latest ? <span>Latest {formatIsoDate(latest.publishedAtIso)}</span> : null}
                        <span>Feed /api/disclosures</span>
                    </>
                }
            />

            <Section compact aria-label="Disclosure timeline and subscription">
                <div className={styles.layout}>
                    <ol className={styles.timeline} aria-label="Disclosures, newest first">
                        {disclosures.map((item) => (
                            <li key={item.id} className={styles.entry}>
                                <span className={styles.marker} aria-hidden="true" />
                                <article id={item.id} className={`glass-1 ${styles.card}`} aria-labelledby={`${item.id}-title`}>
                                    <div className={styles.meta}>
                                        <time className="mono" dateTime={formatIsoDate(item.publishedAtIso)}>
                                            {formatIsoDate(item.publishedAtIso)}
                                        </time>
                                        <AssetChip tone={categoryTone(item.category)}>{item.category}</AssetChip>
                                    </div>
                                    <h2 id={`${item.id}-title`} className={styles.title}>{item.title}</h2>
                                    <p className={styles.summary}>{item.summary}</p>
                                    <p className={styles.published}>Published {formatProseDate(item.publishedAtIso)}</p>
                                </article>
                            </li>
                        ))}
                    </ol>

                    <aside className={styles.aside} aria-labelledby="follow-heading">
                        <Card variant="glass" as="div">
                            <div className={styles.asideHead}>
                                <span className={styles.iconBox} aria-hidden="true">
                                    <Rss focusable="false" />
                                </span>
                                <h2 id="follow-heading" className={styles.asideTitle}>Follow disclosures</h2>
                            </div>
                            <p className={styles.asideText}>
                                New entries are announced to alert subscribers by email. The same list is available as JSON
                                for portfolio systems and archival.
                            </p>
                            <div className={styles.asideActions}>
                                <Button asChild variant="secondary" block>
                                    <Link href="/investors#alerts">Subscribe to alerts</Link>
                                </Button>
                            </div>
                            <a href="/api/disclosures" className={`mono ${styles.feedLink}`}>
                                GET /api/disclosures
                                <ArrowUpRight aria-hidden="true" focusable="false" />
                            </a>
                        </Card>
                    </aside>
                </div>

                <p className={styles.closing}>
                    Questions about any disclosure are routed to {CONTACT.name}, {CONTACT.title}, at{' '}
                    <a href={CONTACT.mailto} className={`mono ${styles.email}`}>{CONTACT.email}</a>. Responses are sent{' '}
                    {CONTACT.responseWindow}.
                </p>
            </Section>
        </>
    );
}
