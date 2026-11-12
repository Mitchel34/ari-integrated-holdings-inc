import Link from 'next/link';
import { PRINCIPLES } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AllocationExplorer } from '@/components/brand/AllocationExplorer';
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
                        <AllocationExplorer
                            layout="stacked"
                            size={260}
                            autoCycle
                            transitionName="allocation-ring"
                            caption="Target weights. Exposure is held through spot ETFs rather than direct custody."
                            className={styles.explorer}
                        />
                    </Card>
                </div>
            </Container>
        </section>
    );
}
