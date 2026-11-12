'use client';

import { useEffect, useRef, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const DURATION_MS = 640;
const EASING = 'cubic-bezier(0.22, 0.8, 0.2, 1)';
/** If the next page has not rendered by then, drop the animation and let it appear normally. */
const NAVIGATION_TIMEOUT_MS = 2500;

interface ViewTransitionHandle {
    ready: Promise<unknown>;
    skipTransition: () => void;
}

// Declared locally so the feature check below stays meaningful in browsers without the API.
interface ViewTransitionDocument {
    startViewTransition?: (update: () => Promise<void>) => ViewTransitionHandle;
}

/**
 * Page transitions: the next page opens through a gold-rimmed circle that grows
 * from wherever the visitor clicked, and the allocation ring morphs between pages
 * that both show it (see the `::view-transition-*` rules in globals.css).
 *
 * Internal link clicks are intercepted and replayed through `router.push`
 * inside `document.startViewTransition`. The browser snapshots the current
 * page, we resolve once React has committed the new route, and the new page is
 * revealed on top of the snapshot.
 *
 * Browsers without the View Transitions API, and visitors who prefer reduced
 * motion, get ordinary navigation: the click is left untouched.
 */
export function PageTransitions() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const finishRef = useRef<(() => void) | null>(null);
    const rimRef = useRef<SVGCircleElement>(null);

    // The navigation has committed: let the browser capture the new page.
    useEffect(() => {
        if (!isPending && finishRef.current) {
            finishRef.current();
            finishRef.current = null;
        }
    }, [isPending, pathname]);

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const startViewTransition = (document as ViewTransitionDocument).startViewTransition;
            if (typeof startViewTransition !== 'function') return;
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if (finishRef.current) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const target = event.target as Element | null;
            const anchor = target?.closest?.('a');
            if (!(anchor instanceof HTMLAnchorElement) || !anchor.href || anchor.hasAttribute('download')) return;
            if (anchor.target && anchor.target !== '_self') return;

            const url = new URL(anchor.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            // Same page (hash links) and non-page routes navigate normally.
            if (url.pathname === window.location.pathname) return;
            if (url.pathname.startsWith('/api/')) return;

            event.preventDefault();

            // Keyboard activation reports no pointer position, so open from the link itself.
            let x = event.clientX;
            let y = event.clientY;
            if (event.detail === 0) {
                const rect = anchor.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            }

            const transition: ViewTransitionHandle = startViewTransition.call(document, () => new Promise<void>((resolve) => {
                const timeout = window.setTimeout(() => {
                    finishRef.current = null;
                    transition.skipTransition();
                    resolve();
                }, NAVIGATION_TIMEOUT_MS);

                finishRef.current = () => {
                    window.clearTimeout(timeout);
                    resolve();
                };

                startTransition(() => {
                    router.push(`${url.pathname}${url.search}${url.hash}`);
                });
            }));

            transition.ready
                .then(() => {
                    const radius = Math.hypot(
                        Math.max(x, window.innerWidth - x),
                        Math.max(y, window.innerHeight - y),
                    );
                    const timing = { duration: DURATION_MS, easing: EASING };

                    document.documentElement.animate(
                        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                        { ...timing, pseudoElement: '::view-transition-new(root)' },
                    );
                    document.documentElement.animate(
                        { filter: ['brightness(1)', 'brightness(0.55)'] },
                        { ...timing, pseudoElement: '::view-transition-old(root)' },
                    );

                    // Gold rim that rides the edge of the opening circle.
                    const rim = rimRef.current;
                    if (rim) {
                        rim.setAttribute('cx', String(x));
                        rim.setAttribute('cy', String(y));
                        rim.animate(
                            { r: ['0px', `${radius}px`], opacity: [1, 1, 0] },
                            timing,
                        );
                    }
                })
                .catch(() => {
                    // Transition was skipped (timeout, hidden tab). The navigation itself still completes.
                });
        };

        // Capture on window so this runs before the link's own click handling.
        window.addEventListener('click', onClick, true);
        return () => window.removeEventListener('click', onClick, true);
    }, [router]);

    return (
        <svg className="page-transition-rim" aria-hidden="true">
            <circle ref={rimRef} cx="0" cy="0" r="0" />
        </svg>
    );
}
