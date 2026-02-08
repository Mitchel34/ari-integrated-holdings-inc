import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { getDisclosures } from '@/lib/investor/disclosures';
import styles from '../page.module.css';

function formatDate(dateIso: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(new Date(dateIso));
}

export default function DisclosuresPage() {
    const disclosures = getDisclosures();

    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Disclosures</h1>
                <p>Material updates, treasury actions, and financial communications.</p>
            </div>

            <div className={styles.grid}>
                {disclosures.map((item) => (
                    <article id={item.id} key={item.id} className={styles.textBlock}>
                        <p className={styles.listMeta}>
                            {item.category} | {formatDate(item.publishedAtIso)}
                        </p>
                        <h2>{item.title}</h2>
                        <p>{item.summary}</p>
                    </article>
                ))}
            </div>

            <section className={styles.contactPanel} aria-labelledby="disclosure-follow-heading">
                <div className={styles.textBlock}>
                    <h2 id="disclosure-follow-heading">Follow Disclosures</h2>
                    <p>
                        For direct delivery of material updates and investor communications, subscribe through
                        Investor Relations or access the disclosures feed endpoint.
                    </p>
                    <p className={styles.linkRow}>
                        <Link href="/investors">Go to Investor Relations</Link>
                        <Link href="/api/disclosures">View JSON feed</Link>
                    </p>
                </div>
            </section>
        </Container>
    );
}
