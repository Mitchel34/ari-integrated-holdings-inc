import Link from 'next/link';
import type { CompanyUpdate, UpdateCategory } from '@/lib/investor/updates';
import { AssetChip, type ChipTone } from '@/components/brand/AssetChip';
import { Card } from '@/components/ui/Card';
import { formatDateIso } from '@/lib/format';
import styles from './HomeSections.module.css';

interface LatestUpdatesProps {
    items: CompanyUpdate[];
}

function toneForCategory(category: UpdateCategory): ChipTone {
    return category === 'Governance' ? 'gold' : 'neutral';
}

export function LatestUpdates({ items }: LatestUpdatesProps) {
    return (
        <Card variant="subtle" className={styles.transparencyCard}>
            <ul className={styles.discList} aria-label="Latest company updates">
                {items.map((item) => (
                    <li key={item.id} className={styles.discRow}>
                        <AssetChip tone={toneForCategory(item.category)}>{item.category}</AssetChip>
                        <time dateTime={item.publishedAtIso} className={`${styles.discDate} mono`}>
                            {formatDateIso(item.publishedAtIso)}
                        </time>
                        <span className={styles.discTitle}>
                            <Link href={`/updates#${item.id}`}>{item.title}</Link>
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
