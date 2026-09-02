import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CONTACT } from '@/lib/site';
import styles from './not-found.module.css';

export const metadata: Metadata = {
    title: 'Page not found',
};

export default function NotFound() {
    return (
        <Container className={styles.wrap}>
            <div className={styles.card}>
                <p className="eyebrow">Error 404</p>
                <h1 className={styles.title}>This page is not on the ledger.</h1>
                <p className={styles.lead}>
                    The address may have changed or never existed. Head back to the overview, or reach the
                    executive team directly.
                </p>
                <div className={styles.actions}>
                    <Button asChild size="lg">
                        <Link href="/">Back to home</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                        <a href={CONTACT.mailto}>Email {CONTACT.name}</a>
                    </Button>
                </div>
            </div>
        </Container>
    );
}
