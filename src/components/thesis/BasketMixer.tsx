'use client';

import { useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AssetChip } from '@/components/brand/AssetChip';
import {
    ALLOCATION,
    ASSET_KEYS,
    TARGET_WEIGHTS,
    getAsset,
    type AssetKey,
    type AssetWeights,
} from '@/lib/site';
import styles from './BasketMixer.module.css';

/** Move one weight and rebalance the other two proportionally so the total stays 100. */
function rebalance(weights: AssetWeights, key: AssetKey, value: number): AssetWeights {
    const next = Math.max(0, Math.min(100, Math.round(value)));
    const [first, second] = ASSET_KEYS.filter((other) => other !== key);
    const remainder = 100 - next;
    const othersTotal = weights[first] + weights[second];
    const firstShare = othersTotal === 0
        ? Math.round(remainder / 2)
        : Math.round((remainder * weights[first]) / othersTotal);

    return { ...weights, [key]: next, [first]: firstShare, [second]: remainder - firstShare };
}

function describeMix(weights: AssetWeights, largest: AssetKey): string {
    const onTarget = ASSET_KEYS.every((key) => weights[key] === TARGET_WEIGHTS[key]);
    if (onTarget) {
        return 'This is the target mix. BTC anchors the basket, ETH adds utility exposure, and SOL adds growth convexity.';
    }
    if (weights.sol >= 50) {
        return `SOL is ${weights.sol}% of the basket. This is the single high-beta bet the thesis is built to avoid.`;
    }
    if (weights[largest] >= 75) {
        return `${largest.toUpperCase()} is ${weights[largest]}% of the basket, which is close to a single-asset position.`;
    }
    if (weights.sol > TARGET_WEIGHTS.sol) {
        return 'SOL is above its 20% target, so more of the basket sits in the highest-volatility layer.';
    }
    if (weights.btc > TARGET_WEIGHTS.btc) {
        return 'BTC is above its 50% target. Protocol risk falls, and so does exposure to the settlement and execution layers.';
    }
    return 'ETH is above its 30% target, which takes weight away from the BTC anchor.';
}

/** Sum of absolute point differences from target, counted once (each point moved appears on both sides). */
function driftFromTarget(weights: AssetWeights): number {
    const total = ASSET_KEYS.reduce((sum, key) => sum + Math.abs(weights[key] - TARGET_WEIGHTS[key]), 0);
    return Math.round(total / 2);
}

/**
 * Hypothetical basket mixer. Illustrates concentration only: how far a mix
 * drifts from the 50 / 30 / 20 target and how large its biggest position is.
 * No prices, holdings, or performance figures.
 */
export function BasketMixer() {
    const [weights, setWeights] = useState<AssetWeights>(TARGET_WEIGHTS);

    const largest = ASSET_KEYS.reduce<AssetKey>(
        (top, key) => (weights[key] > weights[top] ? key : top),
        'btc',
    );
    const largestSymbol = getAsset(largest).symbol;
    const drift = driftFromTarget(weights);

    return (
        <Card variant="glass" as="section" spotlight={false} className={styles.mixer} aria-labelledby="basket-mixer-title">
            <div className={styles.header}>
                <h3 id="basket-mixer-title" className={styles.title}>Try a different mix</h3>
                <p className={styles.hint}>Drag any slider. The other two rebalance so the total stays 100%.</p>
            </div>

            <div className={styles.sliders}>
                {ALLOCATION.map((asset) => (
                    <div
                        key={asset.key}
                        className={styles.sliderRow}
                        style={{ '--asset-color': `var(--${asset.key})` } as CSSProperties}
                    >
                        <label htmlFor={`mix-${asset.key}`} className={styles.sliderLabel}>
                            <AssetChip symbol={asset.symbol} />
                            <span className="sr-only"> {asset.name} weight</span>
                        </label>
                        <input
                            id={`mix-${asset.key}`}
                            className={styles.slider}
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={weights[asset.key]}
                            onChange={(event) => {
                                const value = Number(event.target.value);
                                setWeights((current) => rebalance(current, asset.key, value));
                            }}
                        />
                        <output htmlFor={`mix-${asset.key}`} className={`${styles.sliderValue} mono`}>
                            {weights[asset.key]}%
                        </output>
                    </div>
                ))}
            </div>

            <div className={styles.bars}>
                <div className={styles.barRow}>
                    <span className={styles.barLabel}>This mix</span>
                    <div
                        className={styles.bar}
                        role="img"
                        aria-label={`This mix: ${ALLOCATION.map((asset) => `${asset.symbol} ${weights[asset.key]} percent`).join(', ')}`}
                    >
                        {ALLOCATION.map((asset) => (
                            <span
                                key={asset.key}
                                className={styles.barSegment}
                                style={{ width: `${weights[asset.key]}%`, background: `var(--${asset.key})` }}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.barRow}>
                    <span className={styles.barLabel}>Target</span>
                    <div
                        className={styles.bar}
                        role="img"
                        aria-label={`Target: ${ALLOCATION.map((asset) => `${asset.symbol} ${asset.weight} percent`).join(', ')}`}
                    >
                        {ALLOCATION.map((asset) => (
                            <span
                                key={asset.key}
                                className={styles.barSegment}
                                style={{ width: `${asset.weight}%`, background: `var(--${asset.key})` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <dl className={styles.stats}>
                <div className={styles.stat}>
                    <dt className={styles.statLabel}>Largest single position</dt>
                    <dd className={`${styles.statValue} mono`}>
                        {weights[largest]}% <span className={styles.statUnit}>{largestSymbol}</span>
                    </dd>
                </div>
                <div className={styles.stat}>
                    <dt className={styles.statLabel}>Drift from target</dt>
                    <dd className={`${styles.statValue} mono`}>
                        {drift} <span className={styles.statUnit}>pts</span>
                    </dd>
                </div>
            </dl>

            <p className={styles.message} aria-live="polite">{describeMix(weights, largest)}</p>

            <Button
                variant="secondary"
                size="sm"
                className={styles.reset}
                onClick={() => setWeights(TARGET_WEIGHTS)}
                disabled={drift === 0}
            >
                Reset to 50 / 30 / 20
            </Button>

            <p className={styles.fine}>
                Hypothetical mixes for illustration of concentration only. The target mix is the thesis.
                Not investment advice.
            </p>
        </Card>
    );
}
