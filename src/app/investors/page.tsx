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

            <div style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
                <h2>Shareholder Structure</h2>
                <p>
                    Ari Integrated Holdings Inc. is currently a closely held private company. Our structure allows us
                    to take a long-term view, aligned with a risk-aware approach to digital asset markets.
                    We are committed to robust disclosure practices and institutional-grade transparency.
                </p>
                <br />
                <h2>Exit Pathways</h2>
                <p>
                    We are building toward a significant liquidity event, which could take the form of an
                    IPO, a SPAC merger, or other strategic opportunities to unlock value for our shareholders.
                </p>
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
