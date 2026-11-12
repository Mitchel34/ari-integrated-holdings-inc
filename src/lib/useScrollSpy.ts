'use client';

import { useEffect, useState } from 'react';

interface ScrollSpyState {
    /** Index of the section currently crossing the reading line. */
    active: number;
    /** 0 to 1: how far the reading line has travelled through all sections. */
    progress: number;
}

/**
 * Tracks which of the given section ids the visitor is reading.
 * The "reading line" sits `anchorRatio` of the way down the viewport.
 * Pass a stable `ids` array (module constant or memoized).
 */
export function useScrollSpy(ids: readonly string[], anchorRatio = 0.35): ScrollSpyState {
    const [state, setState] = useState<ScrollSpyState>({ active: 0, progress: 0 });

    useEffect(() => {
        let frame = 0;

        const measure = () => {
            frame = 0;
            const sections = ids
                .map((id) => document.getElementById(id))
                .filter((element): element is HTMLElement => element !== null);
            if (sections.length === 0) return;

            const line = window.innerHeight * anchorRatio;
            let active = 0;
            sections.forEach((section, index) => {
                if (section.getBoundingClientRect().top <= line) active = index;
            });

            const start = sections[0].getBoundingClientRect().top;
            const end = sections[sections.length - 1].getBoundingClientRect().bottom;
            const progress = Math.min(1, Math.max(0, (line - start) / Math.max(1, end - start)));

            setState((previous) => (
                previous.active === active && Math.abs(previous.progress - progress) < 0.004
                    ? previous
                    : { active, progress }
            ));
        };

        const schedule = () => {
            if (!frame) frame = window.requestAnimationFrame(measure);
        };

        schedule();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);

        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [ids, anchorRatio]);

    return state;
}

/** Scroll a section into view, honoring reduced motion, and record it in the URL hash. */
export function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
}
