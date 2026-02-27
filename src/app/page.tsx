import Link from 'next/link';
import Image from 'next/image';
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
            <Image
              src="/logo.jpeg"
              alt="Ari Integrated Holdings Inc."
              width={220}
              height={220}
              className={styles.heroLogo}
              priority
            />
            <p className={styles.heroEyebrow}>Leadership &amp; Strength</p>
            <h1>Building the Strategic Reserve<br />of the Digital Age</h1>
            <p className={styles.heroLead}>
              Ari Integrated Holdings Inc. follows a disciplined long-term treasury strategy centered on
              BTC, ETH, and SOL with a target allocation of 50% / 30% / 20%.
            </p>
            <ul className={styles.heroBullets}>
              <li>50% BTC as the monetary core and digital collateral anchor</li>
              <li>30% ETH for programmable settlement and institutional finance rails</li>
              <li>20% SOL for high-throughput, AI-adjacent growth optionality</li>
            </ul>
            <div className={styles.heroActions}>
              <Button asChild size="lg">
                <Link href="/thesis">Read Our Thesis</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <section className={styles.section}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>Allocation Framework</h2>
            <p>Designed around volatility hierarchy, correlation structure, and asymmetric payoffs.</p>
          </div>
          <div className={styles.textBlock}>
            <ul>
              <li><strong>BTC:</strong> Monetary asset and digital collateral layer with the strongest liquidity profile.</li>
              <li><strong>ETH:</strong> Settlement and programmable finance layer with moderate risk and upside.</li>
              <li><strong>SOL:</strong> High-throughput execution layer with higher beta and growth convexity.</li>
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
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#cardGold1)" strokeWidth="1.5"/>
                  <defs><linearGradient id="cardGold1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Disciplined Treasury</h3>
              <p className={styles.cardText}>
                A long-duration balance-sheet approach with explicit BTC/ETH/SOL target weights and
                ongoing risk monitoring rather than short-term trading.
              </p>
            </Card>
            <Card variant="glass">
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#cardGold2)" strokeWidth="1.5"/>
                  <defs><linearGradient id="cardGold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>AI-Assisted Oversight</h3>
              <p className={styles.cardText}>
                AI supports scenario analysis, volatility mapping, and allocation discipline while
                human governance remains responsible for final decisions.
              </p>
            </Card>
            <Card variant="glass">
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="url(#cardGold3)" strokeWidth="1.5"/>
                  <defs><linearGradient id="cardGold3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C87A"/><stop offset="100%" stopColor="#9E7B36"/></linearGradient></defs>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Asymmetric Exposure</h3>
              <p className={styles.cardText}>
                The mix seeks strong upside capture across cycles while avoiding concentration into
                a single high-beta crypto position.
              </p>
            </Card>
          </div>
          <p className={styles.sectionNote}>Digital assets remain volatile; interim drawdowns can be substantial.</p>
        </Container>
      </section>
    </>
  );
}
