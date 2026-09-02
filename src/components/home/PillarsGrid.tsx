import { BrainCircuit, Landmark, Scale } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import styles from './HomeSections.module.css';

const PILLARS = [
    {
        title: 'Disciplined Treasury',
        Icon: Landmark,
        text: 'A long-duration balance-sheet approach with explicit BTC/ETH/SOL target weights and ongoing risk monitoring rather than short-term trading.',
    },
    {
        title: 'AI-Assisted Oversight',
        Icon: BrainCircuit,
        text: 'AI supports scenario analysis, volatility mapping, and allocation discipline while human governance remains responsible for final decisions.',
    },
    {
        title: 'Asymmetric Exposure',
        Icon: Scale,
        text: 'The mix seeks strong upside capture across cycles while avoiding concentration into a single high-beta crypto position.',
    },
] as const;

export function PillarsGrid() {
    return (
        <div className={styles.grid3}>
            {PILLARS.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 80}>
                    <Card variant="glass" className={styles.pillarCard}>
                        <span className={`${styles.iconBox} glass-1`} aria-hidden="true">
                            <pillar.Icon size={20} strokeWidth={1.6} />
                        </span>
                        <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                        <p className={styles.cardText}>{pillar.text}</p>
                    </Card>
                </Reveal>
            ))}
        </div>
    );
}
