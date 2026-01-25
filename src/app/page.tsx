import Link from 'next/link';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1>Building the Strategic Reserve<br />of the Digital Age</h1>
          <p>
            Ari Integrated Holdings Inc. aims to bridge traditional equity markets
            with the high-growth potential of premier digital assets.
          </p>
          <div className={styles.heroActions}>
            <Link href="/thesis">
              <Button size="lg">Read Our Thesis</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Contact Us</Button>
            </Link>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>Strategic Pillars</h2>
            <p>Our business model rests on three core tenets.</p>
          </div>
          <div className={styles.grid}>
            <Card variant="glass">
              <h3 className={styles.cardTitle}>Digital Treasury</h3>
              <p className={styles.cardText}>
                Accumulating high-conviction assets: Bitcoin (BTC), Ethereum (ETH), and Solana (SOL).
                We view these as foundational assets for the future digital economy.
              </p>
            </Card>
            <Card variant="glass">
              <h3 className={styles.cardTitle}>AI-Driven Decisions</h3>
              <p className={styles.cardText}>
                Leveraging proprietary AI to inform capital allocation and risk management.
                Our &ldquo;Copilot&rdquo; analyzes on-chain data to support decision-making (not guarantee results).
              </p>
            </Card>
            <Card variant="glass">
              <h3 className={styles.cardTitle}>Regulated Exposure</h3>
              <p className={styles.cardText}>
                Aiming to provide investors with secure, equity-based exposure to crypto assets
                without the complexities of self-custody or regulatory hurdles.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
