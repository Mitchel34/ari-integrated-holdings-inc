"use client";

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Menu, X } from 'lucide-react';
import { Container } from '../ui/Container';
import { Sheet } from '../ui/Sheet';
import { Logo } from '../brand/Logo';
import { NAV_ITEMS } from './nav-items';
import { CONTACT } from '@/lib/site';
import styles from './Navbar.module.css';

function isActivePath(pathname: string | null, href: string) {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeToScroll(callback: () => void) {
    window.addEventListener('scroll', callback, { passive: true });
    return () => window.removeEventListener('scroll', callback);
}

function getScrolledSnapshot() {
    return window.scrollY > 16;
}

function getServerScrolledSnapshot() {
    return false;
}

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

export function SiteHeader() {
    const pathname = usePathname();
    const scrolled = useSyncExternalStore(subscribeToScroll, getScrolledSnapshot, getServerScrolledSnapshot);
    // The menu is only "open" for the path it was opened on, so navigation
    // implicitly closes it without an effect.
    const [menu, setMenu] = useState<{ open: boolean; path: string | null }>({ open: false, path: null });
    const mobileMenuOpen = menu.open && menu.path === pathname;
    const openMenu = () => setMenu({ open: true, path: pathname });
    const closeMenu = () => setMenu({ open: false, path: null });

    const { data: session, status } = useSession();
    const user = session?.user as SessionUser | undefined;
    const isExecutive = user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';
    const dashboardHref = isExecutive ? '/executive/dashboard' : '/investor/dashboard';
    const isAuthPage = pathname === '/login';

    return (
        <>
            <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`.trim()}>
                <Container className={styles.container}>
                    <div className={styles.bar}>
                        <Logo size={38} priority />

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
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className={styles.actions}>
                            {status === 'loading' ? (
                                <span className={styles.loadingPill} aria-live="polite">Loading…</span>
                            ) : session ? (
                                <div className={styles.userMenu}>
                                    <Link href={dashboardHref} className={styles.dashboardLink}>
                                        <span className={styles.userAvatar} aria-hidden="true">
                                            {user?.name?.charAt(0) || 'U'}
                                        </span>
                                        <span className={styles.userName}>{user?.name?.split(' ')[0] || 'Dashboard'}</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className={styles.iconButton}
                                        aria-label="Sign out"
                                    >
                                        <LogOut aria-hidden="true" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {!isAuthPage ? (
                                        <Link href="/login" className={styles.ghostLink}>Investor Portal</Link>
                                    ) : null}
                                    <Link href="/contact" className={styles.primaryLink}>Book a Meeting</Link>
                                </>
                            )}

                            <button
                                className={`${styles.iconButton} ${styles.menuButton}`}
                                type="button"
                                aria-label="Open navigation menu"
                                aria-expanded={mobileMenuOpen}
                                aria-controls={mobileMenuOpen ? 'mobile-nav' : undefined}
                                onClick={openMenu}
                            >
                                <Menu aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </Container>
            </header>

            <Sheet open={mobileMenuOpen} onOpenChange={(open) => (open ? openMenu() : closeMenu())} title="Primary navigation">
                <div id="mobile-nav" className={styles.sheetContent}>
                    <div className={styles.sheetHeader}>
                        <Logo size={34} href={null} />
                        <button
                            type="button"
                            className={styles.iconButton}
                            aria-label="Close navigation menu"
                            onClick={closeMenu}
                        >
                            <X aria-hidden="true" />
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
                                    onClick={closeMenu}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className={styles.sheetAccount}>
                        {status === 'loading' ? (
                            <span className={styles.loadingPill}>Loading…</span>
                        ) : session ? (
                            <>
                                <Link href={dashboardHref} className={styles.dashboardLink} onClick={closeMenu}>
                                    <span className={styles.userAvatar} aria-hidden="true">
                                        {user?.name?.charAt(0) || 'U'}
                                    </span>
                                    <span className={styles.userName}>Dashboard</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeMenu();
                                        void signOut({ callbackUrl: '/' });
                                    }}
                                    className={styles.iconButton}
                                    aria-label="Sign out"
                                >
                                    <LogOut aria-hidden="true" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/contact" className={`${styles.primaryLink} ${styles.sheetPrimary}`} onClick={closeMenu}>
                                    Book a Meeting
                                </Link>
                                <Link href="/login" className={`${styles.ghostLink} ${styles.sheetGhost}`} onClick={closeMenu}>
                                    Investor Portal
                                </Link>
                            </>
                        )}
                        <p className={styles.sheetContact}>
                            Correspondence:{' '}
                            <a href={CONTACT.mailto}>{CONTACT.email}</a>
                        </p>
                    </div>
                </div>
            </Sheet>
        </>
    );
}

export { SiteHeader as Navbar };
