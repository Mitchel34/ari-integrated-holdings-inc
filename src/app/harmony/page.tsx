import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import styles from '../page.module.css';

export default function HarmonyPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Harmony Trading App</h1>
                <p>Our Operating Subsidiary</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '4rem' }}>
                <p>
                    Harmony Trading App is the Company’s operating subsidiary. Its primary purpose
                    is to generate modest, steady revenue to cover Ari Integrated Holdings Inc.’s operating expenses,
                    avoiding the need to liquidate core treasury assets.
                </p>
            </div>

            <div className={styles.grid}>
                <Card>
                    <h3>Proprietary Platform</h3>
                    <p>
                        An internal tool employing algorithmic and AI-driven trading strategies.
                        Not customer-facing, but a powerhouse for our internal capital efficiency.
                    </p>
                </Card>
                <Card>
                    <h3>Limited Scope</h3>
                    <p>
                        Only a small portion of assets is allocated to trading. The mandate is capital
                        preservation while earning moderate returns to &ldquo;keep the lights on.&rdquo;
                    </p>
                </Card>
                <Card>
                    <h3>AI Sandbox</h3>
                    <p>
                        Harmony serves as a sandbox for our AI development. Insights from trading algorithms
                        feed back into our broader treasury allocation strategies.
                    </p>
                </Card>
            </div>
        </Container>
    );
}
