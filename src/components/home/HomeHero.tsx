import Link from 'next/link';
import { ALLOCATION } from '@/lib/site';
import type { TreasuryFreshness, TreasurySnapshot } from '@/lib/treasury/snapshot';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AllocationRing } from '@/components/brand/AllocationRing';
import { AssetChip } from '@/components/brand/AssetChip';
import { formatDateProse, formatShares, formatUsd } from '@/lib/format';
import styles from './HomeHero.module.css';

interface HomeHeroProps {
    snapshot: TreasurySnapshot;
    freshness: TreasuryFreshness;
}

export function HomeHero({ snapshot, freshness }: HomeHeroProps) {
    const isStale = freshness.status === 'stale';
    const metrics = [
        { label: 'Total assets', value: formatUsd(snapshot.totals.totalAssets) },
        { label: 'Shares outstanding', value: formatShares(snapshot.sharesOutstanding) },
        { label: 'NAV per share', value: formatUsd(snapshot.totals.navPerShareUsd, 4) },
    ];

    return (
        <section className={styles.hero} aria-labelledby="home-title">
            <Container>
                <div className={styles.grid}>
                    <div className={styles.copy}>
                        <p className="eyebrow">Digital-asset treasury</p>
                        <h1 id="home-title" className={`${styles.title} text-gradient-silver`}>
                            Building the Strategic Reserve of the Digital Age
                        </h1>
                        <p className={styles.lead}>
                            Ari Integrated Holdings is an early-stage, long-horizon treasury company. We hold
                            Bitcoin, Ethereum, and Solana exposure through a 50 / 30 / 20 allocation framework,
                            with AI-assisted oversight and transparent disclosures to investors.
                        </p>
                        <div className={styles.actions}>
                            <Button asChild size="lg">
                                <Link href="/thesis">Read the thesis</Link>
                            </Button>
                            <Button asChild variant="secondary" size="lg">
                                <Link href="/login">Investor portal</Link>
                            </Button>
                        </div>

                        <dl className={styles.metrics} aria-label="Treasury snapshot">
                            {metrics.map((metric) => (
                                <div key={metric.label} className={styles.metric}>
                                    <dt className={styles.metricLabel}>{metric.label}</dt>
                                    <dd className={`${styles.metricValue} mono`}>{metric.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className={styles.meta}>
                            <span className="mono">
                                as of {formatDateProse(snapshot.asOfIso)} · {snapshot.sourceLabel}
                            </span>
                            <span className={styles.freshness}>
                                <AssetChip tone={isStale ? 'warn' : 'pos'}>{isStale ? 'Stale' : 'Current'}</AssetChip>
                                <span className="mono">{freshness.ageDays} days old</span>
                            </span>
                        </p>
                    </div>

                    <Card variant="elevated" className={styles.panel}>
                        <div className={styles.ringHolder}>
                            <AllocationRing
                                size={300}
                                label="50 / 30 / 20"
                                sublabel="Target allocation"
                                className={styles.ring}
                            />
                        </div>
                        <ul className={styles.legend} aria-label="Target allocation by asset">
                            {ALLOCATION.map((asset) => (
                                <li key={asset.symbol} className={styles.legendRow}>
                                    <span className={styles.legendChips}>
                                        <AssetChip symbol={asset.symbol} />
                                        <AssetChip symbol={asset.etf} title={asset.etfName} />
                                    </span>
                                    <span className={styles.legendName}>
                                        {asset.name}
                                        <span className={styles.legendRole}>{asset.role}</span>
                                    </span>
                                    <span className={`${styles.legendWeight} mono`}>{asset.weight}%</span>
                                </li>
                            ))}
                        </ul>
                        <p className={styles.panelNote}>
                            Target weights. Exposure is held through spot ETFs rather than direct custody.
                        </p>
                    </Card>
                </div>
            </Container>
        </section>
    );
}
