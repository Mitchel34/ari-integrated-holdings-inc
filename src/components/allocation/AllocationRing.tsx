'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { TARGET_ASSETS, type AssetKey } from '@/lib/allocation';
import styles from './AllocationRing.module.css';

interface AllocationRingProps {
    /** `stacked` puts the detail under the ring; `split` puts it beside the ring. */
    layout?: 'stacked' | 'split';
    /** Step through the three assets until the visitor interacts. */
    autoCycle?: boolean;
    /** Show the three supporting statements for the selected asset. */
    showPoints?: boolean;
    /** Show a link to the selected asset on the /assets page. */
    showLink?: boolean;
    caption?: string;
    /** Controlled selection, for pages that drive the ring from scroll position. */
    activeKey?: AssetKey;
    onSelect?: (key: AssetKey) => void;
}

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 86;
const GAP_DEGREES = 1.4;

function pointOnRing(angle: number): [number, number] {
    const radians = ((angle - 90) * Math.PI) / 180;
    return [CENTER + RADIUS * Math.cos(radians), CENTER + RADIUS * Math.sin(radians)];
}

function arcPath(startAngle: number, endAngle: number): string {
    const [x0, y0] = pointOnRing(startAngle);
    const [x1, y1] = pointOnRing(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const ARCS = (() => {
    let angle = 0;
    return TARGET_ASSETS.map((asset) => {
        const sweep = asset.targetPct * 3.6;
        const d = arcPath(angle + GAP_DEGREES, angle + sweep - GAP_DEGREES);
        angle += sweep;
        return d;
    });
})();

export function AllocationRing({
    layout = 'split',
    autoCycle = false,
    showPoints = true,
    showLink = true,
    caption,
    activeKey,
    onSelect,
}: AllocationRingProps) {
    const controlled = activeKey !== undefined;
    const [selected, setSelected] = useState(0);
    const [hovered, setHovered] = useState<number | null>(null);
    const [interacted, setInteracted] = useState(false);

    const controlledIndex = controlled
        ? Math.max(0, TARGET_ASSETS.findIndex((asset) => asset.key === activeKey))
        : selected;
    const current = hovered ?? controlledIndex;
    const asset = TARGET_ASSETS[current];

    useEffect(() => {
        if (!autoCycle || controlled || interacted) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = window.setInterval(() => {
            setSelected((index) => (index + 1) % TARGET_ASSETS.length);
        }, 3600);
        return () => window.clearInterval(id);
    }, [autoCycle, controlled, interacted]);

    const choose = (index: number) => {
        setInteracted(true);
        setSelected(index);
        onSelect?.(TARGET_ASSETS[index].key);
    };

    const preview = (index: number) => {
        setInteracted(true);
        if (controlled) {
            setHovered(index);
        } else {
            setSelected(index);
        }
    };

    return (
        <div className={`${styles.ring} ${styles[layout]}`}>
            <figure className={styles.figure}>
                <svg
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    className={styles.svg}
                    style={{ viewTransitionName: 'allocation-ring' }}
                    role="group"
                    aria-label="Target allocation: 50% BTC, 30% ETH, 20% SOL"
                >
                    {TARGET_ASSETS.map((item, index) => (
                        <path
                            key={item.key}
                            d={ARCS[index]}
                            className={`${styles.arc} ${index === current ? styles.arcActive : ''}`.trim()}
                            style={{ stroke: item.color }}
                            role="button"
                            tabIndex={0}
                            aria-label={`${item.symbol}, ${item.targetPct} percent. ${item.role}.`}
                            aria-pressed={index === current}
                            onPointerEnter={() => preview(index)}
                            onPointerLeave={() => setHovered(null)}
                            onFocus={() => preview(index)}
                            onBlur={() => setHovered(null)}
                            onClick={() => choose(index)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    choose(index);
                                }
                            }}
                        />
                    ))}
                    <text className={styles.centerCaption} x={CENTER} y={80} textAnchor="middle">TARGET</text>
                    <text className={styles.centerPct} x={CENTER} y={124} textAnchor="middle">{asset.targetPct}%</text>
                    <text className={styles.centerSymbol} x={CENTER} y={148} textAnchor="middle">{asset.symbol}</text>
                </svg>
            </figure>

            <div className={styles.detail}>
                <div className={styles.segments} role="group" aria-label="Select an asset">
                    {TARGET_ASSETS.map((item, index) => (
                        <button
                            key={item.key}
                            type="button"
                            className={styles.segment}
                            style={{ '--asset-color': item.color } as React.CSSProperties}
                            aria-pressed={index === current}
                            onClick={() => choose(index)}
                        >
                            <span className={styles.swatch} aria-hidden="true" />
                            {item.symbol} {item.targetPct}%
                        </button>
                    ))}
                </div>

                <div className={styles.role} aria-live={interacted ? 'polite' : 'off'}>
                    <p className={styles.roleTitle}>
                        <span style={{ color: asset.color }}>{asset.name}</span> · {asset.role}
                    </p>
                    {showPoints ? (
                        <ul className={styles.points}>
                            {asset.points.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    ) : null}
                </div>

                {showLink ? (
                    <Link href={`/assets#${asset.key}`} className={styles.more}>
                        More on {asset.name}
                        <ArrowRight aria-hidden="true" />
                    </Link>
                ) : null}

                {caption ? <p className={styles.caption}>{caption}</p> : null}
            </div>
        </div>
    );
}
