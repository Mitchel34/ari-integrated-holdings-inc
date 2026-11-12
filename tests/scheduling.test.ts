import { afterEach, describe, expect, it, vi } from 'vitest';

const ZOOM_ENV = 'NEXT_PUBLIC_CALENDLY_ZOOM_MEETING_URL';
const TYPE_ENVS = [
    'NEXT_PUBLIC_CALENDLY_EXEC_INTRO_URL',
    'NEXT_PUBLIC_CALENDLY_INVESTOR_BRIEFING_URL',
    'NEXT_PUBLIC_CALENDLY_PARTNERSHIP_URL',
];

/** The module reads its configuration when it loads, so each case loads a fresh copy. */
async function loadScheduling(env: Record<string, string | undefined> = {}) {
    vi.resetModules();
    for (const name of [ZOOM_ENV, ...TYPE_ENVS]) {
        vi.stubEnv(name, env[name] as string);
    }
    return import('@/lib/scheduling');
}

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('public meeting scheduling', () => {
    it('books the default Zoom event when nothing is configured', async () => {
        const scheduling = await loadScheduling();

        expect(scheduling.ZOOM_MEETING_URL).toBe('https://calendly.com/mitchel-carson/30min');
        expect(scheduling.HAS_ZOOM_BOOKING).toBe(true);
        expect(scheduling.HAS_PUBLIC_BOOKING).toBe(true);
        expect(scheduling.PRIMARY_CTA).toEqual({ label: 'Book a Meeting', href: '/contact#schedule' });
    });

    it('records the chosen topic on the booking link', async () => {
        const scheduling = await loadScheduling({ [ZOOM_ENV]: 'https://calendly.com/example/zoom?month=2027-01' });
        const url = new URL(scheduling.zoomMeetingUrlForTopic('briefing'));

        expect(url.origin + url.pathname).toBe('https://calendly.com/example/zoom');
        expect(url.searchParams.get('month')).toBe('2027-01');
        expect(url.searchParams.get('utm_source')).toBe('ari-website');
        expect(url.searchParams.get('utm_medium')).toBe('contact-page');
        expect(url.searchParams.get('utm_campaign')).toBe('briefing');
    });

    it('turns public booking off when the Zoom event is set to an empty string', async () => {
        const scheduling = await loadScheduling({ [ZOOM_ENV]: '   ' });

        expect(scheduling.HAS_ZOOM_BOOKING).toBe(false);
        expect(scheduling.HAS_PUBLIC_BOOKING).toBe(false);
        expect(scheduling.zoomMeetingUrlForTopic('intro')).toBe('');
        expect(scheduling.PRIMARY_CTA).toEqual({ label: 'Contact Us', href: '/contact' });
    });

    it.each(['calendly.com/example/zoom', 'http://calendly.com/example/zoom', 'not a url'])(
        'treats the unusable link %j as not configured instead of throwing',
        async (value) => {
            const scheduling = await loadScheduling({ [ZOOM_ENV]: value });

            expect(scheduling.HAS_ZOOM_BOOKING).toBe(false);
            expect(() => scheduling.zoomMeetingUrlForTopic('intro')).not.toThrow();
            expect(scheduling.PRIMARY_CTA.label).toBe('Contact Us');
        },
    );

    it('offers only the dashboard meeting types that have a usable link', async () => {
        const scheduling = await loadScheduling({
            [ZOOM_ENV]: '',
            NEXT_PUBLIC_CALENDLY_EXEC_INTRO_URL: 'https://calendly.com/example/intro',
            NEXT_PUBLIC_CALENDLY_INVESTOR_BRIEFING_URL: 'calendly.com/example/briefing',
        });

        expect(scheduling.getConfiguredMeetingTypes().map((type) => type.id)).toEqual(['intro']);
        expect(scheduling.HAS_PUBLIC_BOOKING).toBe(true);
        expect(scheduling.PRIMARY_CTA.label).toBe('Book a Meeting');
    });
});
