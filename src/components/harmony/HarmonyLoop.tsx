'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Activity, ArrowRight, FlaskConical, Search, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import styles from './HarmonyLoop.module.css';

interface LoopStep {
    id: string;
    title: string;
    copy: string;
    icon: LucideIcon;
}

/**
 * The four-node loop: research → risk → controlled evaluation → human decision.
 * The first three steps keep the copy from the "What Harmony does" cards they
 * replaced; the fourth is the boundary that closes the loop.
 */
const STEPS: LoopStep[] = [
    {
        id: 'research',
        title: 'Treasury research',
        copy: 'Market structure, liquidity, and allocation analysis for the BTC, ETH, and SOL exposure held in the treasury framework.',
        icon: Search,
    },
    {
        id: 'risk',
        title: 'Risk analysis',
        copy: 'Volatility, correlation, and drawdown monitoring across the target allocation, so the board and executive team see risk before it compounds.',
        icon: Activity,
    },
    {
        id: 'evaluation',
        title: 'Controlled strategy evaluation',
        copy: 'Models and strategies are evaluated in a bounded, internal environment. Nothing leaves that environment without human review.',
        icon: FlaskConical,
    },
    {
        id: 'decision',
        title: 'Human decision',
        copy: 'Harmony produces analysis; people make the calls. Allocation, risk, and disclosure decisions rest with the board and executive team, and the loop runs inside defined governance and risk boundaries.',
        icon: Users,
    },
];

const AUTO_ADVANCE_MS = 3200;
const NODE_CLASSES = [styles.node1, styles.node2, styles.node3, styles.node4];
const ARROW_CLASSES = [styles.arrow1, styles.arrow2, styles.arrow3, styles.arrow4];

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}

function getReducedMotion() {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotion() {
    return false;
}

export function HarmonyLoop() {
    const [active, setActive] = useState(0);
    const [interacted, setInteracted] = useState(false);
    const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
    const autoAdvancing = !interacted && !reducedMotion;

    useEffect(() => {
        if (!autoAdvancing) return;
        const id = window.setInterval(() => {
            setActive((index) => (index + 1) % STEPS.length);
        }, AUTO_ADVANCE_MS);
        return () => window.clearInterval(id);
    }, [autoAdvancing]);

    const step = STEPS[active];

    return (
        <div className={styles.wrapper}>
            <div className={styles.loop} role="group" aria-label="The Harmony loop, four steps in sequence">
                {STEPS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === active;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`${styles.node} ${NODE_CLASSES[index]} ${isActive ? styles.nodeActive : ''}`.trim()}
                            aria-pressed={isActive}
                            onClick={() => {
                                setInteracted(true);
                                setActive(index);
                            }}
                        >
                            <span className={styles.nodeHead}>
                                <Icon className={styles.nodeIcon} size={16} strokeWidth={1.75} aria-hidden="true" />
                                <span className={`${styles.stepLabel} mono`}>Step {index + 1}</span>
                            </span>
                            <span className={styles.stepTitle}>{item.title}</span>
                        </button>
                    );
                })}
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

            <Card variant="elevated" className={styles.detail}>
                <div className={styles.detailBody} aria-live={interacted ? 'polite' : 'off'}>
                    <p className={`${styles.detailStep} mono`}>
                        Step {active + 1} of {STEPS.length}
                    </p>
                    <h3 className={styles.detailTitle}>{step.title}</h3>
                    <p className={styles.detailCopy}>{step.copy}</p>
                </div>
                <p className={styles.detailHint}>
                    {interacted
                        ? 'Select another step to continue around the loop.'
                        : reducedMotion
                          ? 'Select a step to read it.'
                          : 'Select a step to pause the loop.'}
                </p>
            </Card>
        </div>
    );
}
