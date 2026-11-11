'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './HarmonyLoop.module.css';

interface LoopStep {
    title: string;
    source: string;
    copy: string;
}

// Each step keeps the copy from the card it replaced.
const STEPS: LoopStep[] = [
    {
        title: 'A small allocation trades',
        source: 'Limited Scope & Risk Controls',
        copy: 'A small portion of assets is allocated to trading with strict risk limits to protect the core BTC, ETH, and SOL treasury holdings.',
    },
    {
        title: 'Modest, steady revenue',
        source: 'Proprietary Platform',
        copy: 'An internal trading application employing algorithmic and AI-driven strategies. It operates as an internal-only platform today, with a customer-facing product roadmap under active evaluation.',
    },
    {
        title: 'Bills paid without selling',
        source: 'Purpose',
        copy: 'Its primary role is to generate modest, steady revenue to cover operating expenses and reduce the need to liquidate core treasury assets.',
    },
    {
        title: 'Models inform the treasury',
        source: 'AI Sandbox',
        copy: 'Harmony serves as a testing ground for analytics and models that inform broader treasury allocation decisions.',
    },
];

const NODE_CLASSES = [styles.node1, styles.node2, styles.node3, styles.node4];
const ARROW_CLASSES = [styles.arrow1, styles.arrow2, styles.arrow3, styles.arrow4];

export function HarmonyLoop() {
    const [active, setActive] = useState(0);
    const [interacted, setInteracted] = useState(false);

    useEffect(() => {
        if (interacted) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = window.setInterval(() => {
            setActive((index) => (index + 1) % STEPS.length);
        }, 3200);
        return () => window.clearInterval(id);
    }, [interacted]);

    const step = STEPS[active];

    return (
        <div className={styles.wrapper}>
            <div className={styles.loop}>
                {STEPS.map((item, index) => (
                    <button
                        key={item.title}
                        type="button"
                        className={`${styles.node} ${NODE_CLASSES[index]} ${index === active ? styles.nodeActive : ''}`.trim()}
                        aria-pressed={index === active}
                        onClick={() => {
                            setInteracted(true);
                            setActive(index);
                        }}
                    >
                        <span className={styles.stepLabel}>Step {index + 1}</span>
                        <span className={styles.stepTitle}>{item.title}</span>
                    </button>
                ))}
                {ARROW_CLASSES.map((arrowClass, index) => (
                    <span
                        key={arrowClass}
                        className={`${styles.arrow} ${arrowClass} ${index === active ? styles.arrowActive : ''}`.trim()}
                        aria-hidden="true"
                    >
                        <ArrowRight />
                    </span>
                ))}
            </div>

            <div className={styles.detail} aria-live={interacted ? 'polite' : 'off'}>
                <p className={styles.detailStep}>Step {active + 1} of {STEPS.length}</p>
                <h3 className={styles.detailTitle}>{step.source}</h3>
                <p className={styles.detailCopy}>{step.copy}</p>
                <p className={styles.detailHint}>
                    {interacted ? 'Select another step to continue around the loop.' : 'Select a step to pause the loop.'}
                </p>
            </div>
        </div>
    );
}
