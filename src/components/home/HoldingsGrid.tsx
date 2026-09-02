import { ALLOCATION, type AssetSymbol } from '@/lib/site';
import { Card, type CardAccent } from '@/components/ui/Card';
import { AssetChip } from '@/components/brand/AssetChip';
import { Reveal } from '@/components/ui/Reveal';
import styles from './HomeSections.module.css';

const ACCENT: Record<AssetSymbol, CardAccent> = {
    BTC: 'btc',
    ETH: 'eth',
    SOL: 'sol',
};

export function HoldingsGrid() {
    return (
        <div className={styles.grid3}>
            {ALLOCATION.map((asset, index) => (
                <Reveal key={asset.symbol} delay={index * 80}>
                    <Card accent={ACCENT[asset.symbol]} className={styles.holdingCard}>
                        <div className={styles.holdingTop}>
                            <AssetChip symbol={asset.symbol} size="md" />
                            <span className={`${styles.holdingWeight} mono`}>{asset.weight}%</span>
                        </div>
                        <h3 className={styles.holdingName}>{asset.name}</h3>
                        <p className={styles.holdingRole}>{asset.role}</p>
                        <p className={styles.cardText}>{asset.summary}</p>
                        <p className={styles.etfLine}>
                            Held via <span className="mono">{asset.etf}</span> — {asset.etfName}
                        </p>
                    </Card>
                </Reveal>
            ))}
        </div>
    );
}
