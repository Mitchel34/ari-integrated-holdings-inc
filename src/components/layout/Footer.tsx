import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Logo } from '../brand/Logo';
import { AssetChip } from '../brand/AssetChip';
import { ALLOCATION, CONTACT, SITE } from '@/lib/site';
import styles from './Footer.module.css';

const COMPANY_LINKS = [
    { href: '/thesis', label: 'Investment Thesis' },
    { href: '/harmony', label: 'Harmony Trading' },
    { href: '/team', label: 'Leadership' },
    { href: '/contact', label: 'Contact' },
];

const INVESTOR_LINKS = [
    { href: '/investors', label: 'Investor Relations' },
    { href: '/disclosures', label: 'Disclosures' },
    { href: '/investors#alerts', label: 'Investor Alerts' },
    { href: '/login', label: 'Investor Portal' },
];

const LEGAL_LINKS = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
];

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.hairline} aria-hidden="true" />
            <Container>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Logo size={44} />
                        <p className={styles.tagline}>{SITE.tagline}.</p>
                        <p className={styles.blurb}>
                            A disciplined, long-horizon digital-asset treasury built around a 50 / 30 / 20
                            allocation to Bitcoin, Ethereum, and Solana.
                        </p>
                        <ul className={styles.chips} aria-label="Target allocation">
                            {ALLOCATION.map((asset) => (
                                <li key={asset.symbol}>
                                    <AssetChip symbol={asset.symbol}>
                                        {asset.symbol} {asset.weight}%
                                    </AssetChip>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <nav className={styles.column} aria-labelledby="footer-company">
                        <h2 id="footer-company" className={styles.heading}>Company</h2>
                        <ul className={styles.list}>
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav className={styles.column} aria-labelledby="footer-investors">
                        <h2 id="footer-investors" className={styles.heading}>Investors</h2>
                        <ul className={styles.list}>
                            {INVESTOR_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.column}>
                        <h2 className={styles.heading}>Correspondence</h2>
                        <p className={styles.contactName}>{CONTACT.name}</p>
                        <p className={styles.contactTitle}>{CONTACT.title}</p>
                        <a href={CONTACT.mailto} className={styles.contactEmail}>
                            <Mail aria-hidden="true" />
                            <span>
                                {CONTACT.email.split('@')[0]}@<wbr />{CONTACT.email.split('@')[1]}
                            </span>
                        </a>
                        <p className={styles.contactNote}>
                            All investor, partnership, and press inquiries are routed to the CTO.
                        </p>
                        <Link href="/contact" className={styles.contactCta}>
                            Send an inquiry
                            <ArrowUpRight aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        &copy; {year} {SITE.legalName} All rights reserved.
                    </p>
                    <ul className={styles.legal}>
                        {LEGAL_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={styles.legalLink}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className={styles.disclaimer}>
                    Nothing on this website is an offer to sell, or a solicitation of an offer to buy, any security.
                    Digital assets are volatile and may lose value. Past performance is not indicative of future results.
                </p>
            </Container>
        </footer>
    );
}
