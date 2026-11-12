'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { ALLOCATION, type AssetKey } from '@/lib/site';
import { AllocationRing } from './AllocationRing';
import styles from './AllocationExplorer.module.css';

interface AllocationExplorerProps {
    /** `stacked` puts the detail under the ring; `split` puts it beside the ring. */
    layout?: 'stacked' | 'split';
    /** Ring diameter in pixels. */
    size?: number;
    /** Step through the three assets until the visitor interacts. */
    autoCycle?: boolean;
    /** Show the supporting statements for the selected asset. */
    showPoints?: boolean;
    /** Show a link to the selected asset on the /assets page. */
    showLink?: boolean;
    caption?: string;
    /** Controlled selection, for pages that drive the ring from scroll position. */
    activeKey?: AssetKey;
    onSelect?: (key: AssetKey) => void;
    /** `view-transition-name` for the ring so it carries over between pages. */
    transitionName?: string;
    className?: string;
}

const DOT_CLASS: Record<AssetKey, string> = {
    btc: styles.dotBtc,
    eth: styles.dotEth,
    sol: styles.dotSol,
};

const CYCLE_MS = 3600;

/**
 * The allocation ring with its asset detail: select a slice (pointer) or a
 * chip (pointer or keyboard) to read what that position is for.
 */
export function AllocationExplorer({
    layout = 'split',
    size = 260,
    autoCycle = false,
    showPoints = true,
    showLink = true,
    caption,
    activeKey,
    onSelect,
    transitionName,
    className = '',
}: AllocationExplorerProps) {
    const controlled = activeKey !== undefined;
    const [selected, setSelected] = useState(0);
    const [hovered, setHovered] = useState<number | null>(null);
    const [interacted, setInteracted] = useState(false);

    const controlledIndex = controlled
        ? Math.max(0, ALLOCATION.findIndex((asset) => asset.key === activeKey))
        : selected;
    const current = hovered ?? controlledIndex;
    const asset = ALLOCATION[current];

    useEffect(() => {
        if (!autoCycle || controlled || interacted) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = window.setInterval(() => {
            setSelected((index) => (index + 1) % ALLOCATION.length);
        }, CYCLE_MS);
        return () => window.clearInterval(id);
    }, [autoCycle, controlled, interacted]);

    const choose = (index: number) => {
        setInteracted(true);
        setSelected(index);
        onSelect?.(ALLOCATION[index].key);
    };

    const indexOfSymbol = (symbol: string | null) =>
        symbol === null ? null : ALLOCATION.findIndex((item) => item.symbol === symbol.toUpperCase());

    return (
        <div className={`${styles.explorer} ${styles[layout]} ${className}`.trim()}>
            <div className={styles.figure}>
                <AllocationRing
                    size={size}
                    label={`${asset.weight}%`}
                    sublabel={`${asset.symbol} · ${asset.role}`}
                    activeSymbol={asset.symbol}
                    ariaLabel="Target allocation: Bitcoin 50 percent, Ethereum 30 percent, Solana 20 percent"
                    transitionName={transitionName}
                    onSelect={(symbol) => {
                        const index = indexOfSymbol(symbol);
                        if (index !== null && index >= 0) choose(index);
                    }}
                    onPreview={(symbol) => {
                        const index = indexOfSymbol(symbol);
                        if (index !== null && index >= 0) setInteracted(true);
                        setHovered(index !== null && index >= 0 ? index : null);
                    }}
                />
            </div>

            <div className={styles.detail}>
                <div className={styles.segments} role="group" aria-label="Select an asset">
                    {ALLOCATION.map((item, index) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`${styles.segment} mono`}
                            style={{ '--asset-color': `var(--${item.key})` } as CSSProperties}
                            aria-pressed={index === current}
                            onClick={() => choose(index)}
                            onPointerEnter={() => {
                                setInteracted(true);
                                setHovered(index);
                            }}
                            onPointerLeave={() => setHovered(null)}
                        >
                            <span className={`${styles.dot} ${DOT_CLASS[item.key]}`} aria-hidden="true" />
                            {item.symbol} {item.weight}%
                        </button>
                    ))}
                </div>

                <div className={styles.role} aria-live={interacted ? 'polite' : 'off'}>
                    <p className={styles.roleTitle}>
                        <span className={styles.assetName}>{asset.name}</span>
                        <span className={styles.roleSep} aria-hidden="true">·</span>
                        <span className={styles.roleLabel}>{asset.role}</span>
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
