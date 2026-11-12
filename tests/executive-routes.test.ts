import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { sendMock, batchMock, sessionMock, tokenMock, userFindManyMock, alertFindManyMock, logCreateMock } = vi.hoisted(() => ({
    sendMock: vi.fn(),
    batchMock: vi.fn(),
    sessionMock: vi.fn(),
    tokenMock: vi.fn(),
    userFindManyMock: vi.fn(),
    alertFindManyMock: vi.fn(),
    logCreateMock: vi.fn(),
}));

vi.mock('resend', () => ({
    Resend: class {
        emails = { send: sendMock };
        batch = { send: batchMock };
    },
}));
vi.mock('next-auth/next', () => ({ getServerSession: sessionMock }));
vi.mock('next-auth/jwt', () => ({ getToken: tokenMock }));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: { findMany: userFindManyMock },
        investorAlert: { findMany: alertFindManyMock },
        broadcastLog: { create: logCreateMock },
    },
}));

import { POST as notify } from '@/app/api/executive/meeting-notify/route';
import { POST as broadcast } from '@/app/api/executive/broadcast/route';

const INBOX = 'mitchelcarson@ariintegratedholdings.com';

function notifyRequest(body: unknown = { meetingType: 'Executive Zoom Meeting' }) {
    return new Request('http://localhost/api/executive/meeting-notify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    });
}

// The broadcast limiter is keyed by executive, so each test acts as a different one.
let executiveCounter = 0;
function asExecutive() {
    executiveCounter += 1;
    tokenMock.mockResolvedValue({ id: `exec_${executiveCounter}`, email: 'exec@example.com', role: 'EXECUTIVE' });
}

function broadcastRequest(body: unknown = { subject: 'Q4 update', message: 'Body text' }) {
    return new NextRequest('http://localhost/api/executive/broadcast', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    });
}

beforeEach(() => {
    for (const mock of [sendMock, batchMock, sessionMock, tokenMock, userFindManyMock, alertFindManyMock, logCreateMock]) {
        mock.mockReset();
    }
    vi.stubEnv('RESEND_API_KEY', 're_test_key');
    vi.stubEnv('EMAIL_DRY_RUN', undefined);
    vi.stubEnv('CORRESPONDENCE_EMAIL', undefined);
    vi.stubEnv('RESEND_IR_EMAIL', undefined);
    vi.stubEnv('NODE_ENV', 'test');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    sessionMock.mockResolvedValue({ user: { name: 'Curtis <Carson>', email: 'curtis@example.com', role: 'EXECUTIVE' } });
    userFindManyMock.mockResolvedValue([{ email: 'curtis@example.com' }, { email: 'Judy@Example.com' }]);
    sendMock.mockResolvedValue({ data: { id: 'em_1' }, error: null, headers: null });
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe('POST /api/executive/meeting-notify', () => {
    it('refuses anyone who is not an executive', async () => {
        sessionMock.mockResolvedValue({ user: { email: 'investor@example.com', role: 'INVESTOR' } });

        const res = await notify(notifyRequest());

        expect(res.status).toBe(403);
        expect(sendMock).not.toHaveBeenCalled();
    });

    it('sends one message to every executive plus the correspondence inbox, with user text escaped', async () => {
        const res = await notify(notifyRequest({ meetingType: 'Board <sync>', message: 'Agenda & <i>notes</i>' }));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body).toMatchObject({ ok: true, sent: 3, dryRun: false });
        const payload = sendMock.mock.calls[0][0];
        expect(payload.to).toEqual([INBOX, 'curtis@example.com', 'judy@example.com']);
        expect(payload.html).toContain('Board &lt;sync&gt;');
        expect(payload.html).toContain('Agenda &amp; &lt;i&gt;notes&lt;/i&gt;');
        expect(payload.html).toContain('Curtis &lt;Carson&gt;');
        expect(payload.html).not.toContain('<i>notes</i>');
    });

    it('sends nothing and says so when the executive list cannot be loaded', async () => {
        userFindManyMock.mockRejectedValue(new Error('connection refused'));

        const res = await notify(notifyRequest());
        const body = await res.json();

        expect(res.status).toBe(503);
        expect(body.ok).toBeUndefined();
        expect(body.error).toMatch(/executive list could not be loaded/i);
        expect(sendMock).not.toHaveBeenCalled();
    });

    it('reports a missing API key as 503 and a provider refusal as 502, never as sent', async () => {
        vi.stubEnv('RESEND_API_KEY', undefined);
        const unconfigured = await notify(notifyRequest());
        expect(unconfigured.status).toBe(503);
        expect((await unconfigured.json()).ok).toBeUndefined();

        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        sendMock.mockResolvedValue({
            data: null,
            error: { name: 'validation_error', statusCode: 403, message: 'domain not verified' },
            headers: null,
        });
        const refused = await notify(notifyRequest());
        expect(refused.status).toBe(502);
        expect((await refused.json()).ok).toBeUndefined();
    });

    it('flags a dry run instead of reporting recipients as notified', async () => {
        vi.stubEnv('EMAIL_DRY_RUN', '1');

        const res = await notify(notifyRequest());
        const body = await res.json();

        expect(body).toMatchObject({ ok: true, sent: 0, dryRun: true });
        expect(sendMock).not.toHaveBeenCalled();
    });
});

describe('POST /api/executive/broadcast', () => {
    beforeEach(() => {
        asExecutive();
        alertFindManyMock.mockResolvedValue([{ email: 'a@example.com' }, { email: 'b@example.com' }]);
        batchMock.mockResolvedValue({ data: { data: [{ id: 'em_1' }, { id: 'em_2' }] }, error: null, headers: null });
        logCreateMock.mockResolvedValue({});
    });

    it('refuses anyone who is not an executive', async () => {
        tokenMock.mockResolvedValue({ id: 'inv_1', role: 'INVESTOR' });

        const res = await broadcast(broadcastRequest());

        expect(res.status).toBe(403);
        expect(batchMock).not.toHaveBeenCalled();
    });

    it('reports and logs the number the provider accepted, not the size of the list', async () => {
        batchMock.mockResolvedValue({
            data: { data: [{ id: 'em_1' }], errors: [{ index: 1, message: 'Invalid `to` field.' }] },
            error: null,
            headers: null,
        });

        const res = await broadcast(broadcastRequest());
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body).toMatchObject({ ok: true, sent: 1, failed: 1, dryRun: false });
        expect(logCreateMock).toHaveBeenCalledWith({ data: expect.objectContaining({ recipientCount: 1 }) });
    });

    it('answers 503 and logs no broadcast when delivery is not configured', async () => {
        vi.stubEnv('RESEND_API_KEY', undefined);

        const res = await broadcast(broadcastRequest());

        expect(res.status).toBe(503);
        expect((await res.json()).ok).toBeUndefined();
        expect(logCreateMock).not.toHaveBeenCalled();
    });

    it('answers 502 and logs no broadcast when the provider takes nothing', async () => {
        batchMock.mockResolvedValue({
            data: null,
            error: { name: 'validation_error', statusCode: 403, message: 'domain not verified' },
            headers: null,
        });

        const res = await broadcast(broadcastRequest());

        expect(res.status).toBe(502);
        expect(logCreateMock).not.toHaveBeenCalled();
    });

    it('flags a dry run and logs no broadcast', async () => {
        vi.stubEnv('EMAIL_DRY_RUN', '1');

        const res = await broadcast(broadcastRequest());
        const body = await res.json();

        expect(body).toMatchObject({ ok: true, sent: 0, dryRun: true });
        expect(batchMock).not.toHaveBeenCalled();
        expect(logCreateMock).not.toHaveBeenCalled();
    });

    it('sends nothing when there are no active subscribers', async () => {
        alertFindManyMock.mockResolvedValue([]);

        const res = await broadcast(broadcastRequest());
        const body = await res.json();

        expect(body).toMatchObject({ ok: true, sent: 0 });
        expect(batchMock).not.toHaveBeenCalled();
        expect(logCreateMock).not.toHaveBeenCalled();
    });
});
