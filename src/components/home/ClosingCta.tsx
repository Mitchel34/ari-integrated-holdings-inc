import Link from 'next/link';
import { CONTACT } from '@/lib/site';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './HomeSections.module.css';

export function ClosingCta() {
    const [emailLocal, emailDomain] = CONTACT.email.split('@');

    return (
        <Card variant="elevated" className={styles.cta} aria-labelledby="cta-title">
            <p className="eyebrow">Contact</p>
            <h2 id="cta-title" className={styles.ctaTitle}>
                Speak with the executive team
            </h2>
            <p className={styles.ctaLead}>
                Accredited investors, family offices, and partners can request a conversation or write to us
                directly. We reply {CONTACT.responseWindow}.
            </p>
            <div className={styles.ctaActions}>
                <Button asChild size="lg">
                    <Link href="/contact">Contact us</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                    <a href={CONTACT.mailto} className={styles.ctaEmail}>
                        {emailLocal}@<wbr />
                        {emailDomain}
                    </a>
                </Button>
            </div>
            <p className={styles.ctaNote}>
                All correspondence is routed to {CONTACT.name}, {CONTACT.title}.
            </p>
        </Card>
    );
}
