import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';
import { getCompanyUpdates } from '@/lib/investor/updates';

/** Effective date of the legal documents (see the DocumentPage `updated` props). */
const LEGAL_UPDATED = new Date('2026-09-02T00:00:00.000Z');
/** Last substantive revision of the evergreen company pages. */
const SITE_UPDATED = new Date('2026-09-02T00:00:00.000Z');

type Frequency = MetadataRoute.Sitemap[number]['changeFrequency'];

export default function sitemap(): MetadataRoute.Sitemap {
    const base = getSiteUrl();
    const latestUpdate = getCompanyUpdates()[0];
    const updateDate = latestUpdate ? new Date(latestUpdate.publishedAtIso) : SITE_UPDATED;
    const newest = (...dates: Date[]) => new Date(Math.max(...dates.map((d) => d.getTime())));

    const routes: Array<{ path: string; priority: number; changeFrequency: Frequency; lastModified: Date }> = [
        { path: '/', priority: 1, changeFrequency: 'weekly', lastModified: newest(SITE_UPDATED, updateDate) },
        { path: '/thesis', priority: 0.9, changeFrequency: 'monthly', lastModified: SITE_UPDATED },
        { path: '/investors', priority: 0.9, changeFrequency: 'weekly', lastModified: newest(SITE_UPDATED, updateDate) },
        { path: '/updates', priority: 0.8, changeFrequency: 'weekly', lastModified: newest(SITE_UPDATED, updateDate) },
        { path: '/harmony', priority: 0.7, changeFrequency: 'monthly', lastModified: SITE_UPDATED },
        { path: '/team', priority: 0.7, changeFrequency: 'monthly', lastModified: SITE_UPDATED },
        { path: '/contact', priority: 0.8, changeFrequency: 'monthly', lastModified: SITE_UPDATED },
        { path: '/privacy', priority: 0.3, changeFrequency: 'yearly', lastModified: LEGAL_UPDATED },
        { path: '/terms', priority: 0.3, changeFrequency: 'yearly', lastModified: LEGAL_UPDATED },
        { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly', lastModified: LEGAL_UPDATED },
    ];

    return routes.map((route) => ({
        url: `${base}${route.path}`,
        lastModified: route.lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
