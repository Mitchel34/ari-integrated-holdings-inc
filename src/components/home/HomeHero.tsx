import Link from 'next/link';
import { ALLOCATION, PRINCIPLES } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AllocationRing } from '@/components/brand/AllocationRing';
import { AssetChip } from '@/components/brand/AssetChip';
import styles from './HomeHero.module.css';

export function HomeHero() {
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
                            with AI-assisted oversight and human governance.
                        </p>
                        <div className={styles.actions}>
                            <Button asChild size="lg">
                                <Link href="/thesis">Read the thesis</Link>
                            </Button>
                            <Button asChild variant="secondary" size="lg">
                                <Link href="/login">Investor portal</Link>
                            </Button>
                        </div>

                        <ol className={styles.principles} aria-label="Treasury principles">
                            {PRINCIPLES.map((principle, index) => (
                                <li key={principle.id} className={styles.principle}>
                                    <span className={`${styles.principleIndex} mono`} aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className={styles.principleBody}>
                                        <span className={styles.principleTitle}>{principle.title}</span>
                                        <span className={styles.principleText}>{principle.text}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
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
