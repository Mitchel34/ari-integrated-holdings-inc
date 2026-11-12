"use client";

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Container } from '../ui/Container';
import { Sheet } from '../ui/Sheet';
import { AriLogo } from '../brand/AriLogo';
import { NAV_ITEMS } from './nav-items';
import styles from './Navbar.module.css';

function isActivePath(pathname: string | null, href: string) {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="10" y1="17" x2="20" y2="17" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
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

function SignOutIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9,6 15,12 9,18" />
        </svg>
    );
}

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

// The header firms up once the page has moved under it. Read from the scroll
// position directly, so there is no state to keep in step with it.
const SCROLLED_AFTER_PX = 8;

function subscribeToScroll(onChange: () => void) {
    window.addEventListener('scroll', onChange, { passive: true });
    return () => window.removeEventListener('scroll', onChange);
}

function getIsScrolled() {
    return window.scrollY > SCROLLED_AFTER_PX;
}

function getIsScrolledOnServer() {
    return false;
}

export function SiteHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuPathname, setMenuPathname] = useState(pathname);
    const { data: session, status } = useSession();
    const user = session?.user as SessionUser | undefined;
    const scrolled = useSyncExternalStore(subscribeToScroll, getIsScrolled, getIsScrolledOnServer);

    const isExecutive = user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';
    const dashboardHref = isExecutive ? '/executive/dashboard' : '/investor/dashboard';

    // Close the mobile menu on any navigation, including ones its own links do
    // not trigger (browser back/forward, redirects). Resetting during render
    // means the new route never commits with the menu still open.
    if (menuPathname !== pathname) {
        setMenuPathname(pathname);
        setMobileMenuOpen(false);
    }

    return (
        <>
            <header className={styles.navbar} data-scrolled={scrolled ? 'true' : undefined}>
                <Container className={styles.container}>
                    <div className={styles.bar}>
                        <Link href="/" className={styles.brand} aria-label="Ari Integrated Holdings Inc. home">
                            <AriLogo variant="full" className={styles.brandLogo} />
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
                                <div className={styles.loadingPill} role="status" aria-label="Loading account" />
                            ) : session ? (
                                <div className={styles.userMenu}>
                                    <Link href={dashboardHref} className={styles.dashboardLink}>
                                        <span className={styles.userAvatar} aria-hidden="true">
                                            {user?.name?.charAt(0) || 'U'}
                                        </span>
                                        <span className={styles.userName}>
                                            {user?.name?.split(' ')[0] || 'Dashboard'}
                                        </span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className={styles.signOutBtn}
                                        aria-label="Sign out"
                                    >
                                        <SignOutIcon />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className={styles.loginBtn}>
                                    <LockIcon />
                                    <span>Investor Portal</span>
                                </Link>
                            )}
                        </div>

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
                    </div>
                </Container>
            </header>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} title="Primary navigation">
                <div id="mobile-nav" className={styles.sheetContent}>
                    <div className={styles.sheetHeader}>
                        <Link
                            href="/"
                            className={styles.sheetBrand}
                            aria-label="Ari Integrated Holdings Inc. home"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <AriLogo variant="full" size={40} />
                        </Link>
                        <button
                            type="button"
                            className={styles.sheetCloseButton}
                            aria-label="Close navigation menu"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <CloseIcon />
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
                                        <span>{item.label}</span>
                                    )}
                                    <span className={styles.sheetLinkChevron}>
                                        <ChevronIcon />
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {status === 'loading' ? (
                        <div className={styles.sheetAccount}>
                            <div className={styles.loadingPill} role="status" aria-label="Loading account" />
                        </div>
                    ) : session ? (
                        <div className={styles.sheetAccount}>
                            <Link
                                href={dashboardHref}
                                className={styles.dashboardLink}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className={styles.userAvatar} aria-hidden="true">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                                <span className={styles.userName}>Dashboard</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    void signOut({ callbackUrl: '/' });
                                }}
                                className={styles.signOutBtn}
                                aria-label="Sign out"
                            >
                                <SignOutIcon />
                            </button>
                        </div>
                    ) : (
                        <div className={styles.sheetAccount}>
                            <Link
                                href="/login"
                                className={`${styles.loginBtn} ${styles.loginBtnBlock}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <LockIcon />
                                <span>Investor Portal</span>
                            </Link>
                        </div>
                    )}
                </div>
            </Sheet>
        </>
    );
}

export { SiteHeader as Navbar };
