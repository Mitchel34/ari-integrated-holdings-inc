import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import styles from '../page.module.css';

export default function InvestorsPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Investor Relations</h1>
                <p>Transparency, Growth, and Security</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.textBlock}>
                    <h2>Shareholder Structure</h2>
                    <p>
                        Ari Integrated Holdings Inc. is currently a closely held private company. Our structure
                        allows us to take a long-term view aligned with a disciplined digital asset strategy.
                    </p>
                </div>

                <div className={styles.textBlock}>
                    <h2>Transparency & Reporting</h2>
                    <p>
                        We are committed to institutional-grade disclosure practices, including regular updates
                        on treasury composition and net asset value. Financial reporting will follow applicable
                        accounting standards as the Company scales.
                    </p>
                </div>

                <div className={styles.textBlock}>
                    <h2>Exit Pathways</h2>
                    <p>
                        The Company is building toward a significant liquidity event, which could take the form
                        of an IPO, a SPAC merger, or other strategic opportunities to unlock value for shareholders.
                    </p>
                </div>
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '12px' }}>
                <h2>Contact Us</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                    For inquiries regarding investment opportunities or partnerships.
                </p>
                <Button size="lg">Get in Touch</Button>
            </div>
        </Container>
    );
}
