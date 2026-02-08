"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Container } from '../ui/Container';
import { Sheet } from '../ui/Sheet';
import { NAV_ITEMS } from './nav-items';
import styles from './Navbar.module.css';

function isActivePath(pathname: string | null, href: string) {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

export function SiteHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const user = session?.user as SessionUser | undefined;

    const isExecutive = user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header className={styles.navbar}>
            <Container className={styles.container}>
                <div className={styles.mobileBar}>
                    <button
                        className={styles.menuButton}
                        type="button"
                        aria-label="Open navigation menu"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-nav"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <MenuIcon />
                    </button>
                    <Link href="/" className={styles.mobileBrand}>
                        <span className={styles.brandText}>Ari Integrated Holdings Inc.</span>
                        <span className={styles.brandMarks} aria-hidden="true">₿ Ξ ◎</span>
                    </Link>
                    <span className={styles.mobileSpacer} aria-hidden="true" />
                </div>

                <div className={styles.desktopBar}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.brandText}>Ari Integrated Holdings Inc.</span>
                        <span className={styles.brandMarks} aria-hidden="true">₿ Ξ ◎</span>
                    </Link>

                    <nav className={styles.links} aria-label="Primary">
                        {NAV_ITEMS.map((item) => {
                            const isActive = isActivePath(pathname, item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`.trim()}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.gated ? (
                                        <span className={styles.gatedLabel}>
                                            <LockIcon />
                                            {item.label}
                                        </span>
                                    ) : (
                                        item.label
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

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
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16,17 21,12 16,7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </Container>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} title="Primary navigation">
                <div id="mobile-nav" className={styles.sheetContent}>
                    <div className={styles.sheetHeader}>
                        <p className={styles.sheetBrand}>Ari Integrated Holdings Inc.</p>
                        <button
                            type="button"
                            className={styles.sheetCloseButton}
                            aria-label="Close navigation menu"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Close
                        </button>
                    </div>

                    <nav className={styles.sheetLinks} aria-label="Mobile primary">
                        {NAV_ITEMS.map((item) => {
                            const isActive = isActivePath(pathname, item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.sheetLink} ${isActive ? styles.sheetLinkActive : ''}`.trim()}
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.gated ? (
                                        <span className={styles.gatedLabel}>
                                            <LockIcon />
                                            {item.label}
                                        </span>
                                    ) : (
                                        item.label
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {status === 'loading' ? (
                        <div className={styles.loadingPill}>Loading...</div>
                    ) : session ? (
                        <div className={styles.sheetAccount}>
                            <Link
                                href={isExecutive ? '/executive/dashboard' : '/investor/dashboard'}
                                className={styles.dashboardLink}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className={styles.userAvatar}>
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                                <span className={styles.userName}>Dashboard</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    void signOut({ callbackUrl: '/' });
                                }}
                                className={styles.signOutBtn}
                                aria-label="Sign out"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16,17 21,12 16,7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    ) : null}
                </div>
            </Sheet>
        </header>
    );
}

export { SiteHeader as Navbar };
