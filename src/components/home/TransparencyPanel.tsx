import Link from 'next/link';
import type { DisclosureItem } from '@/lib/investor/disclosures';
import { AssetChip, type ChipTone } from '@/components/brand/AssetChip';
import { Card } from '@/components/ui/Card';
import { formatIsoDate } from './format';
import styles from './HomeSections.module.css';

interface TransparencyPanelProps {
    items: DisclosureItem[];
}

function toneForCategory(category: DisclosureItem['category']): ChipTone {
    return category === 'Treasury Update' ? 'gold' : 'neutral';
}

export function TransparencyPanel({ items }: TransparencyPanelProps) {
    return (
        <Card variant="subtle" className={styles.transparencyCard}>
            <ul className={styles.discList} aria-label="Latest disclosures">
                {items.map((item) => (
                    <li key={item.id} className={styles.discRow}>
                        <AssetChip tone={toneForCategory(item.category)}>{item.category}</AssetChip>
                        <time dateTime={item.publishedAtIso} className={`${styles.discDate} mono`}>
                            {formatIsoDate(item.publishedAtIso)}
                        </time>
                        <span className={styles.discTitle}>
                            <Link href={`/disclosures#${item.id}`}>{item.title}</Link>
                        </span>
                    </li>
                ))}
            </ul>
            <p className={styles.alertsLine}>
                Material updates are also sent by email to subscribers of{' '}
                <Link href="/investors#alerts" className={styles.inlineLink}>
                    investor alerts
                </Link>
                .
            </p>
        </Card>
    );
}
