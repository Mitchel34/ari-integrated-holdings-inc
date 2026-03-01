'use client';

import { useEffect } from 'react';

interface CalendlyEmbedProps {
    url: string;
    minHeight?: string;
}

export function CalendlyEmbed({ url, minHeight }: CalendlyEmbedProps) {
    const responsiveHeight = minHeight || 'clamp(400px, 65vh, 700px)';
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
            style={{ minWidth: '100%', minHeight: responsiveHeight, width: '100%' }}
        />
    );
}
