'use client';

import { useEffect } from 'react';

interface CalendlyEmbedProps {
    url: string;
    minHeight?: string;
}

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

    return (
        <div
            className="calendly-inline-widget"
            data-url={`${url}?hide_gdpr_banner=1&background_color=0A1324&text_color=e2e8f0&primary_color=E8C87A`}
            style={{ width: '100%', height }}
        />
    );
}
