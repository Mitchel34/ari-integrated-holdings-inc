'use client';

import { useEffect } from 'react';

interface CalendlyEmbedProps {
    url: string;
    minHeight?: string;
}

/** Calendly theme parameters matched to the site palette (navy ground, light text, gold primary). */
const CALENDLY_THEME = 'hide_gdpr_banner=1&background_color=0A1324&text_color=F4F7FB&primary_color=C29B4E';

export function CalendlyEmbed({ url, minHeight }: CalendlyEmbedProps) {
    const height = minHeight || '100%';
    useEffect(() => {
        const existing = document.getElementById('calendly-widget-script');
        if (!existing) {
            const script = document.createElement('script');
            script.id = 'calendly-widget-script';
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    const separator = url.includes('?') ? '&' : '?';

    return (
        <div
            className="calendly-inline-widget"
            data-url={`${url}${separator}${CALENDLY_THEME}`}
            style={{ width: '100%', height }}
        />
    );
}
