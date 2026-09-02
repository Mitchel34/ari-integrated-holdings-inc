import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

const PUBLIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/thesis', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/investors', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/disclosures', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/harmony', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/team', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const base = getSiteUrl();
    const lastModified = new Date();
    return PUBLIC_ROUTES.map((route) => ({
        url: `${base}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
