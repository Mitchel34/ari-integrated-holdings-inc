import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock('resend', () => ({
    Resend: class {
        emails = { send: sendMock };
        batch = { send: vi.fn() };
    },
}));

const CTO = 'mitchelcarson@ariintegratedholdings.com';
const REFERENCE = /^ARI-\d{8}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

const legit = {
    name: '  Mitchel Carson ',
    email: 'Mitchel.Carson@gmail.com',
    company: 'Ari QA',
    investorType: 'Other',
    message: 'Controlled test <b>ARI-FORM</b>',
    website: '',
};

// The rate limiter is keyed by client IP and shared across tests, so each test gets its own address.
let ipCounter = 0;
function nextIp() {
    ipCounter += 1;
    return `203.0.113.${ipCounter}`;
}

function post(body: unknown, ip = nextIp()) {
    return POST(
        new NextRequest('http://localhost/api/contact', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
            body: typeof body === 'string' ? body : JSON.stringify(body),
        }),
    );
}

function providerAccepts(id = 'em_route_1') {
    sendMock.mockResolvedValue({ data: { id }, error: null, headers: null });
}

beforeEach(() => {
    sendMock.mockReset();
    vi.stubEnv('RESEND_API_KEY', undefined);
    vi.stubEnv('EMAIL_DRY_RUN', undefined);
    vi.stubEnv('NODE_ENV', 'test');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe('acceptance 1: missing API key', () => {
    it('returns a failure response with a reference and never ok:true', async () => {
        const res = await post(legit);
        const body = await res.json();

        expect(res.status).toBe(503);
        expect(body.ok).toBe(false);
        expect(body.delivery).toBe('failed');
        expect(body.reference).toMatch(REFERENCE);
        expect(body.error).toContain(CTO);
        expect(body.error).toContain(body.reference);
        expect(sendMock).not.toHaveBeenCalled();
    });
});

describe('acceptance 2: provider rejection or network failure', () => {
    it('returns 502 with the reference when the provider rejects the message', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        sendMock.mockResolvedValue({
            data: null,
            error: { name: 'validation_error', statusCode: 403, message: 'domain is not verified' },
            headers: null,
        });

        const res = await post(legit);
        const body = await res.json();

        expect(res.status).toBe(502);
        expect(body).toMatchObject({ ok: false, delivery: 'failed' });
        expect(body.reference).toMatch(REFERENCE);
    });

    it('returns 502 when the provider call throws', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        sendMock.mockRejectedValue(new TypeError('fetch failed'));

        const res = await post(legit);

        expect(res.status).toBe(502);
        expect((await res.json()).ok).toBe(false);
    });
});

describe('acceptance 3: successful send', () => {
    it('hands the inquiry to the provider with the intended recipient, sender, escaped body, and Reply-To', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        providerAccepts();

        const res = await post(legit);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.ok).toBe(true);
        expect(body.delivery).toBe('accepted');
        expect(body.reference).toMatch(REFERENCE);

        expect(sendMock).toHaveBeenCalledTimes(1);
        const payload = sendMock.mock.calls[0][0];
        expect(payload.to).toEqual([CTO]);
        expect(payload.from).toBe('Ari Integrated Holdings Inc. <no-reply@ariintegratedholdings.com>');
        expect(payload.replyTo).toBe('mitchel.carson@gmail.com');
        expect(payload.subject).toBe(`Website inquiry — Mitchel Carson (Ari QA) [${body.reference}]`);
        expect(payload.html).toContain('&lt;b&gt;ARI-FORM&lt;/b&gt;');
        expect(payload.html).not.toContain('<b>ARI-FORM</b>');
        expect(payload.html).toContain(body.reference);
    });

    it('reports a local dry run distinctly and sends nothing', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        vi.stubEnv('EMAIL_DRY_RUN', '1');

        const res = await post(legit);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body).toMatchObject({ ok: true, delivery: 'dry-run' });
        expect(sendMock).not.toHaveBeenCalled();
    });
});

describe('acceptance 4: validation, honeypot, and rate limit', () => {
    it('gives bots a bare fake success and sends nothing, even when delivery is unconfigured', async () => {
        const res = await post({ ...legit, website: 'https://spam.example' });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ ok: true });
        expect(sendMock).not.toHaveBeenCalled();
    });

    it('rejects missing fields', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        const res = await post({ ...legit, message: '   ' });

        expect(res.status).toBe(400);
        expect((await res.json()).error).toBe('Name, email, and message are required.');
        expect(sendMock).not.toHaveBeenCalled();
    });

    it('rejects an invalid email address', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        const res = await post({ ...legit, email: 'not-an-address' });

        expect(res.status).toBe(400);
        expect((await res.json()).error).toBe('Enter a valid email address.');
    });

    it('rejects over-long fields', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        const res = await post({ ...legit, name: 'x'.repeat(121) });

        expect(res.status).toBe(400);
        expect((await res.json()).error).toBe('The name field is too long.');
    });

    it('rejects a malformed body', async () => {
        const res = await post('{not json');

        expect(res.status).toBe(400);
    });

    it('limits one client to five inquiries per hour', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        providerAccepts();
        const ip = nextIp();

        for (let i = 0; i < 5; i += 1) {
            expect((await post(legit, ip)).status).toBe(200);
        }
        const blocked = await post(legit, ip);

        expect(blocked.status).toBe(429);
        expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0);
        expect(sendMock).toHaveBeenCalledTimes(5);
    });
});
