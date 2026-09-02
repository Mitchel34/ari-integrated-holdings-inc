import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE.name,
        short_name: 'Ari Holdings',
        description: SITE.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#0A1324',
        theme_color: '#0A1324',
        icons: [
            { src: '/brand/ari-mark-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/brand/ari-mark-512.png', sizes: '512x512', type: 'image/png' },
        ],
    };
}
