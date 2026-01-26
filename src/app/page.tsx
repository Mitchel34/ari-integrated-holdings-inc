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
          <div className={styles.heroContent}>
            <h1>Building the Strategic Reserve<br />of the Digital Age</h1>
            <p className={styles.heroLead}>
              Ari Integrated Holdings Inc. aims to bridge traditional equity markets
              with the high-growth potential of premier digital assets.
            </p>
            <p className={styles.heroSubtext}>
              Ari Integrated Holdings Inc. is an AI-enabled crypto treasury company focused on long-term
              capital appreciation through buy-and-hold exposure to BTC, ETH, and SOL. The company is
              structured as a balance-sheet-driven treasury vehicle with human oversight, not a speculative
              trading firm.
            </p>
            <div className={styles.heroActions}>
              <Link href="/thesis">
                <Button size="lg">Read Our Thesis</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>Investment Thesis</h2>
            <p>Why these assets anchor the long-term strategy.</p>
          </div>
          <div className={styles.textBlock}>
            <ul>
              <li><strong>Bitcoin (BTC):</strong> Scarcity-driven asset with long-term appreciation potential.</li>
              <li><strong>Ethereum (ETH):</strong> Utility layer for programmable finance and decentralized applications.</li>
              <li><strong>Solana (SOL):</strong> High-performance infrastructure for scalable blockchain adoption.</li>
            </ul>
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
                A buy-and-hold balance-sheet strategy focused on Bitcoin (BTC), Ethereum (ETH), and Solana (SOL),
                held as long-term treasury assets rather than speculative trading positions.
              </p>
            </Card>
            <Card variant="glass">
              <h3 className={styles.cardTitle}>AI-Driven Decisions</h3>
              <p className={styles.cardText}>
                AI serves as a decision-support layer for risk analysis, capital allocation timing,
                and scenario stress testing. Human oversight remains central to all portfolio decisions.
              </p>
            </Card>
            <Card variant="glass">
              <h3 className={styles.cardTitle}>Regulated Exposure</h3>
              <p className={styles.cardText}>
                Aiming to provide investors with secure, equity-based exposure to crypto assets
                without the complexities of self-custody, with a long-term path toward public-market access.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>Harmony Trading Subsidiary</h2>
            <p>Operational support that protects the core treasury.</p>
          </div>
          <div className={styles.textBlock}>
            <p>
              Harmony Trading operates as a supporting subsidiary intended to generate modest revenue,
              offset operating costs, and reduce the need to liquidate core treasury assets. It is not
              a speculative trading business.
            </p>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>Objectives</h2>
            <p>What Ari Integrated Holdings Inc. is built to achieve.</p>
          </div>
          <div className={styles.textBlock}>
            <ul>
              <li>Build a strategic digital asset reserve.</li>
              <li>Provide regulated, equity-based exposure to crypto markets.</li>
              <li>Maintain low operating overhead and long-term focus.</li>
              <li>Prepare for eventual public-market access through an IPO or SPAC.</li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
