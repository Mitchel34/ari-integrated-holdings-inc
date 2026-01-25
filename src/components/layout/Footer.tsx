import Link from 'next/link';
import { Container } from '../ui/Container';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.content}>
                    <div className={styles.column}>
                        <h3>Ari Integrated</h3>
                        <p>Building the Strategic Reserve of the Digital Age.</p>
                    </div>
                    <div className={styles.column}>
                        <h4>Company</h4>
                        <Link href="/thesis">Investment Thesis</Link>
                        <Link href="/harmony">Harmony Trading</Link>
                        <Link href="/team">Team</Link>
                    </div>
                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/disclaimer">Disclaimer</Link>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Ari Integrated Holdings Inc. All rights reserved.
                </div>
            </Container>
        </footer>
    );
}
