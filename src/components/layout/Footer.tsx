import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../ui/Container';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.content}>
                    <div className={styles.column}>
                        <Link href="/">
                            <Image
                                src="/logo.jpeg"
                                alt="Ari Integrated Holdings Inc."
                                width={90}
                                height={90}
                                className={styles.footerLogo}
                            />
                        </Link>
                        <p>Building the Strategic Reserve of the Digital Age.</p>
                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <span>contact@ariholdings.com</span>
                            </li>
                            <li className={styles.contactItem}>
                                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="2" y1="12" x2="22" y2="12"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                                <span>www.ariholdings.com</span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>Company</h4>
                        <Link href="/thesis">Investment Thesis</Link>
                        <Link href="/harmony">Harmony Trading</Link>
                        <Link href="/disclosures">Disclosures</Link>
                        <Link href="/investors">Investor Relations</Link>
                        <Link href="/team">Team</Link>
                    </div>
                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/disclaimer">Disclaimer</Link>
                    </div>
                    <div className={styles.column}>
                        <h4>Contact</h4>
                        <Link href="/contact">Contact Us</Link>
                        <span className={styles.contactItem}>contact@ariholdings.com</span>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Ari Integrated Holdings Inc. All rights reserved.
                </div>
            </Container>
        </footer>
    );
}
