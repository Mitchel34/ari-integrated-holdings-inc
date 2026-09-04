import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import { PageHero } from '../../components/layout/PageHero';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AssetChip } from '../../components/brand/AssetChip';
import { formatDateIso, formatDateProse } from '@/lib/format';
import { getCompanyUpdates, type UpdateCategory } from '@/lib/investor/updates';
import styles from './updates.module.css';

export const metadata: Metadata = {
    title: 'Company Updates',
    description:
        'Current announcements from Ari Integrated Holdings Inc., published in the order they were released, with a machine-readable JSON feed.',
    alternates: { canonical: '/updates' },
};

function categoryTone(category: UpdateCategory): 'gold' | 'neutral' {
    return category === 'Governance' ? 'gold' : 'neutral';
}

export default function UpdatesPage() {
    const updates = getCompanyUpdates();
    const latest = updates[0];

    return (
        <>
            <PageHero
                eyebrow="Company"
                title="Company Updates"
                lead="Current announcements from Ari Integrated Holdings. Detailed treasury information is available to verified investors through the secure portal."
                meta={
                    <>
                        <span>{updates.length} {updates.length === 1 ? 'entry' : 'entries'}</span>
                        {latest ? <span>Latest {formatDateIso(latest.publishedAtIso)}</span> : null}
                        <span>Feed /api/updates</span>
                    </>
                }
            />

            <Section compact aria-label="Company updates timeline and subscription">
                <div className={styles.layout}>
                    <ol className={styles.timeline} aria-label="Company updates, newest first">
                        {updates.map((item) => (
                            <li key={item.id} className={styles.entry}>
                                <span className={styles.marker} aria-hidden="true" />
                                <article id={item.id} className={`glass-1 ${styles.card}`} aria-labelledby={`${item.id}-title`}>
                                    <div className={styles.meta}>
                                        <time className="mono" dateTime={formatDateIso(item.publishedAtIso)}>
                                            {formatDateIso(item.publishedAtIso)}
                                        </time>
                                        <AssetChip tone={categoryTone(item.category)}>{item.category}</AssetChip>
                                    </div>
                                    <h2 id={`${item.id}-title`} className={styles.title}>{item.title}</h2>
                                    <p className={styles.summary}>{item.summary}</p>
                                    <p className={styles.published}>Published {formatDateProse(item.publishedAtIso)}</p>
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
                                <h2 id="follow-heading" className={styles.asideTitle}>Follow updates</h2>
                            </div>
                            <p className={styles.asideText}>
                                New updates are announced to alert subscribers by email. The same list is available as
                                JSON for portfolio systems and archival.
                            </p>
                            <div className={styles.asideActions}>
                                <Button asChild variant="secondary" block>
                                    <Link href="/investors#alerts">Subscribe to alerts</Link>
                                </Button>
                            </div>
                            <a href="/api/updates" className={`mono ${styles.feedLink}`}>
                                GET /api/updates
                                <ArrowUpRight aria-hidden="true" focusable="false" />
                            </a>
                        </Card>
                    </aside>
                </div>

                <p className={styles.closing}>
                    Questions about an update?{' '}
                    <Link href="/contact" className={styles.closingLink}>Contact us</Link>.
                </p>
            </Section>
        </>
    );
}
