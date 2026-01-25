"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '../ui/Container';
import buttonStyles from '../ui/Button.module.css';
import styles from './Navbar.module.css';

const navItems = [
    { href: '/thesis', label: 'Thesis' },
    { href: '/harmony', label: 'Harmony' },
    { href: '/team', label: 'Team' },
    { href: '/investors', label: 'Investors' },
];

function isActivePath(pathname: string | null, href: string) {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
    const pathname = usePathname();
    return (
        <nav className={styles.navbar} aria-label="Primary">
            <Container className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">Ari Integrated</Link>
                </div>
                <div className={styles.links}>
                    {navItems.map((item) => {
                        const isActive = isActivePath(pathname, item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
                <div className={styles.actions}>
                    <Link
                        href="/login"
                        className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.sm} ${styles.actionLink}`}
                    >
                        Investor Login
                    </Link>
                </div>
            </Container>
        </nav>
    );
}
