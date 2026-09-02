import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import styles from './HomeSections.module.css';

const ENGINES = [
    {
        eyebrow: 'Core',
        title: 'Treasury',
        text: 'A ten-year, disciplined treasury approach for long-term digital-asset holdings. The 50 / 30 / 20 target structure is built for long-duration construction, emphasizing discipline across market cycles instead of reactive allocation changes.',
        href: '/thesis',
        cta: 'Read the thesis',
    },
    {
        eyebrow: 'Operating subsidiary',
        title: 'Harmony Trading',
        text: 'Harmony Trading App handles limited trading activity under strict risk limits. Its role is to generate modest, steady revenue that covers operating expenses and reduces the need to liquidate core treasury assets.',
        href: '/harmony',
        cta: 'About Harmony',
    },
] as const;

export function EnginesSplit() {
    return (
        <div className={styles.grid2}>
            {ENGINES.map((engine, index) => (
                <Reveal key={engine.title} delay={index * 80}>
                    <Card variant="glass" className={styles.engineCard}>
                        <p className="eyebrow eyebrow--plain">{engine.eyebrow}</p>
                        <h3 className={styles.engineTitle}>{engine.title}</h3>
                        <p className={styles.cardText}>{engine.text}</p>
                        <div className={styles.engineAction}>
                            <Button asChild variant="outline" size="sm">
                                <Link href={engine.href}>
                                    {engine.cta}
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </Reveal>
            ))}
        </div>
    );
}
