'use client';

import { useEffect, useRef } from 'react';

interface CalendlyEmbedProps {
    url: string;
    minHeight?: string;
    /** Accessible name for the scheduling region. */
    label?: string;
}

interface CalendlyApi {
    initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
}

type CalendlyWindow = Window & { Calendly?: CalendlyApi };

const SCRIPT_ID = 'calendly-widget-script';
const SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
/** Calendly theme parameters matched to the site palette (navy ground, light text, gold primary). */
const THEME_PARAMS = 'hide_gdpr_banner=1&background_color=0A1324&text_color=F4F7FB&primary_color=C29B4E';

function withTheme(url: string): string {
    return `${url}${url.includes('?') ? '&' : '?'}${THEME_PARAMS}`;
}

/**
 * Inline Calendly scheduler. The widget is created explicitly rather than by
 * Calendly's on-load scan, so it also works when the embed mounts after the
 * script has loaded (inside a modal, or when the URL changes).
 */
export function CalendlyEmbed({ url, minHeight, label = 'Schedule a meeting' }: CalendlyEmbedProps) {
    const height = minHeight || '100%';
    const widgetRef = useRef<HTMLDivElement>(null);
    const embedUrl = withTheme(url);

    useEffect(() => {
        const target = widgetRef.current;
        if (!target) return;

        let cancelled = false;

        const initialize = () => {
            const calendly = (window as CalendlyWindow).Calendly;
            if (cancelled || !calendly) return;
            target.replaceChildren();
            calendly.initInlineWidget({ url: embedUrl, parentElement: target });
        };

        let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

        if (script && (window as CalendlyWindow).Calendly) {
            initialize();
        } else {
            if (!script) {
                script = document.createElement('script');
                script.id = SCRIPT_ID;
                script.src = SCRIPT_SRC;
                script.async = true;
                document.head.appendChild(script);
            }
            script.addEventListener('load', initialize, { once: true });
        }

        return () => {
            cancelled = true;
            script?.removeEventListener('load', initialize);
            target.replaceChildren();
        };
    }, [embedUrl]);

    return (
        <div
            ref={widgetRef}
            role="region"
            aria-label={label}
            style={{ width: '100%', height }}
        />
    );
}
