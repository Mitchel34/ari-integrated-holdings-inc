"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

export function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const user = session?.user as SessionUser | undefined;

    const isExecutive = user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';

    return (
        <nav className={styles.navbar} aria-label="Primary">
            <Container className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">Ari Integrated Holdings Inc.</Link>
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
                    {status === 'loading' ? (
                        <div className={styles.loadingPill}>Loading...</div>
                    ) : session ? (
                        <div className={styles.userMenu}>
                            <Link
                                href={isExecutive ? '/executive/dashboard' : '/investor/dashboard'}
                                className={styles.dashboardLink}
                            >
                                <span className={styles.userAvatar}>
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                                <span className={styles.userName}>
                                    {user?.name?.split(' ')[0] || 'Dashboard'}
                                </span>
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className={styles.signOutBtn}
                                aria-label="Sign out"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16,17 21,12 16,7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.sm} ${styles.actionLink}`}
                        >
                            Investor Login
                        </Link>
                    )}
                </div>
            </Container>
        </nav>
    );
}
