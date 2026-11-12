'use client';

import { useState } from 'react';
import {
    ASSET_KEYS,
    TARGET_ASSETS,
    TARGET_WEIGHTS,
    blendedIllustrativeCagrPct,
    type AssetKey,
    type AssetWeights,
} from '@/lib/allocation';
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

export function BasketMixer() {
    const [weights, setWeights] = useState<AssetWeights>(TARGET_WEIGHTS);

    const largest = ASSET_KEYS.reduce<AssetKey>(
        (top, key) => (weights[key] > weights[top] ? key : top),
        'btc',
    );
    // Floor rather than round so the target mix reads "~70%", matching the figure stated above.
    const blended = Math.floor(blendedIllustrativeCagrPct(weights));

    return (
        <div className={styles.mixer}>
            <div className={styles.header}>
                <h3 className={styles.title}>Try a different mix</h3>
                <p className={styles.hint}>
                    Drag any slider. The other two rebalance so the total stays 100%.
                </p>
            </div>

            <div className={styles.sliders}>
                {TARGET_ASSETS.map((asset) => (
                    <div
                        key={asset.key}
                        className={styles.sliderRow}
                        style={{ '--asset-color': asset.color } as React.CSSProperties}
                    >
                        <label htmlFor={`mix-${asset.key}`}>{asset.symbol}</label>
                        <input
                            id={`mix-${asset.key}`}
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={weights[asset.key]}
                            onChange={(event) => {
                                setWeights((current) => rebalance(current, asset.key, Number(event.target.value)));
                            }}
                        />
                        <output htmlFor={`mix-${asset.key}`}>{weights[asset.key]}%</output>
                    </div>
                ))}
            </div>

            <div className={styles.bars}>
                <div className={styles.barRow}>
                    <span>This mix</span>
                    <div className={styles.bar}>
                        {TARGET_ASSETS.map((asset) => (
                            <i key={asset.key} style={{ width: `${weights[asset.key]}%`, background: asset.color }} />
                        ))}
                    </div>
                </div>
                <div className={styles.barRow}>
                    <span>Target</span>
                    <div className={styles.bar}>
                        {TARGET_ASSETS.map((asset) => (
                            <i key={asset.key} style={{ width: `${asset.targetPct}%`, background: asset.color }} />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <p className={styles.statValue}>~{blended}%</p>
                    <p className={styles.statLabel}>Illustrative blended CAGR, Apr 2020 to Mar 2025</p>
                </div>
                <div className={styles.stat}>
                    <p className={styles.statValue}>{weights[largest]}%</p>
                    <p className={styles.statLabel}>Largest single position ({largest.toUpperCase()})</p>
                </div>
            </div>

            <p className={styles.message} aria-live="polite">{describeMix(weights, largest)}</p>

            <button type="button" className={styles.reset} onClick={() => setWeights(TARGET_WEIGHTS)}>
                Reset to 50 / 30 / 20
            </button>

            <p className={styles.fine}>
                Weighted average of the approximate figures above. Hypothetical and for illustrative context
                only; not financial advice. Past performance is not indicative of future results.
            </p>
        </div>
    );
}
