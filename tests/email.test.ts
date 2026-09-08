import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sendMock = vi.fn();
const batchMock = vi.fn();
const constructedKeys: string[] = [];

vi.mock('resend', () => ({
    Resend: class {
        emails = { send: sendMock };
        batch = { send: batchMock };
        constructor(key: string) {
            constructedKeys.push(key);
        }
    },
}));

const CTO = 'mitchelcarson@ariintegratedholdings.com';
const ENV_KEYS = [
    'RESEND_API_KEY',
    'EMAIL_DRY_RUN',
    'CORRESPONDENCE_EMAIL',
    'RESEND_FROM_EMAIL',
    'RESEND_FROM_NAME',
    'VERCEL_ENV',
];

const inquiry = {
    name: 'Mitchel Carson',
    email: 'mitchel.carson@gmail.com',
    company: 'Ari <QA>',
    investorType: 'Other',
    message: 'Controlled test <script>alert(1)</script> & "quotes"',
    reference: 'ARI-20260908-TEST01',
};

/** Fresh module instance so `CORRESPONDENCE_EMAIL` and the cached client see the stubbed env. */
async function loadEmail() {
    vi.resetModules();
    return import('@/lib/email');
}

function providerAccepts(id = 'em_test_123') {
    sendMock.mockResolvedValue({ data: { id }, error: null, headers: null });
}

function providerRejects(message: string, statusCode = 403) {
    return { data: null, error: { name: 'validation_error', statusCode, message }, headers: null };
}

beforeEach(() => {
    sendMock.mockReset();
    batchMock.mockReset();
    constructedKeys.length = 0;
    for (const key of ENV_KEYS) {
        vi.stubEnv(key, undefined);
    }
    vi.stubEnv('NODE_ENV', 'test');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe('missing configuration fails explicitly', () => {
    it('reports not_configured and sends nothing when RESEND_API_KEY is missing', async () => {
        const { emailService, getEmailConfigStatus } = await loadEmail();

        const outcome = await emailService.sendContactInquiry(inquiry);

        expect(outcome).toEqual({
            status: 'failed',
            reason: 'not_configured',
            message: expect.stringContaining('RESEND_API_KEY'),
        });
        expect(constructedKeys).toEqual([]);
        expect(sendMock).not.toHaveBeenCalled();
        expect(getEmailConfigStatus()).toMatchObject({
            apiKeyConfigured: false,
            dryRun: false,
            correspondenceEmail: CTO,
            correspondenceOverridden: false,
        });
    });

    it('honours EMAIL_DRY_RUN outside production and reports it as not delivered', async () => {
        vi.stubEnv('EMAIL_DRY_RUN', '1');
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        const { emailService, isEmailDryRun } = await loadEmail();

        expect(isEmailDryRun()).toBe(true);
        const outcome = await emailService.sendContactInquiry(inquiry);

        expect(outcome).toEqual({ status: 'dry-run' });
        expect(sendMock).not.toHaveBeenCalled();

        // The dry-run log names the sender kind and reference but never user content.
        const logged = vi.mocked(console.warn).mock.calls.map((call) => call.join(' ')).join('\n');
        expect(logged).toContain('dry-run kind=contact_inquiry');
        expect(logged).not.toContain(inquiry.name);
        expect(logged).not.toContain(inquiry.email);
    });

    it('ignores EMAIL_DRY_RUN in production builds', async () => {
        vi.stubEnv('EMAIL_DRY_RUN', '1');
        vi.stubEnv('NODE_ENV', 'production');
        const { emailService, isEmailDryRun } = await loadEmail();

        expect(isEmailDryRun()).toBe(false);
        const outcome = await emailService.sendContactInquiry(inquiry);

        expect(outcome).toMatchObject({ status: 'failed', reason: 'not_configured' });
    });

    it('ignores EMAIL_DRY_RUN on a Vercel production deployment', async () => {
        vi.stubEnv('EMAIL_DRY_RUN', 'true');
        vi.stubEnv('VERCEL_ENV', 'production');
        const { isEmailDryRun } = await loadEmail();

        expect(isEmailDryRun()).toBe(false);
    });
});

describe('successful provider hand-off', () => {
    it('sends to the CTO from the site address with the submitter as Reply-To and an escaped body', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        providerAccepts('em_abc');
        const { emailService } = await loadEmail();

        const outcome = await emailService.sendContactInquiry(inquiry);

        expect(outcome).toEqual({ status: 'accepted', id: 'em_abc' });
        expect(constructedKeys).toEqual(['re_test_key']);
        expect(sendMock).toHaveBeenCalledTimes(1);

        const payload = sendMock.mock.calls[0][0];
        expect(payload.from).toBe('Ari Integrated Holdings Inc. <no-reply@ariintegratedholdings.com>');
        expect(payload.to).toEqual([CTO]);
        expect(payload.replyTo).toBe(inquiry.email);
        expect(payload.subject).toBe(`Website inquiry — Mitchel Carson (Ari <QA>) [${inquiry.reference}]`);
        expect(payload.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot;');
        expect(payload.html).not.toContain('<script>');
        expect(payload.html).toContain('Ari &lt;QA&gt;');
        expect(payload.html).toContain(inquiry.reference);
        expect(payload.tags).toEqual(
            expect.arrayContaining([
                { name: 'kind', value: 'contact_inquiry' },
                { name: 'reference', value: inquiry.reference },
            ]),
        );
        expect(payload.headers).toEqual({ 'X-Entity-Ref-ID': inquiry.reference });
    });

    it('applies RESEND_FROM_* and CORRESPONDENCE_EMAIL overrides', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        vi.stubEnv('RESEND_FROM_EMAIL', 'site@example.com');
        vi.stubEnv('RESEND_FROM_NAME', 'Example');
        vi.stubEnv('CORRESPONDENCE_EMAIL', 'staging@example.com');
        providerAccepts();
        const { emailService, getEmailConfigStatus } = await loadEmail();

        await emailService.sendContactInquiry(inquiry);

        const payload = sendMock.mock.calls[0][0];
        expect(payload.from).toBe('Example <site@example.com>');
        expect(payload.to).toEqual(['staging@example.com']);
        expect(getEmailConfigStatus()).toMatchObject({
            apiKeyConfigured: true,
            from: 'Example <site@example.com>',
            correspondenceEmail: 'staging@example.com',
            correspondenceOverridden: true,
        });
    });

    it('omits Reply-To when the submitter address is not usable', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        providerAccepts();
        const { emailService } = await loadEmail();

        await emailService.sendContactInquiry({ ...inquiry, email: 'not an address' });

        expect(sendMock.mock.calls[0][0].replyTo).toBeUndefined();
    });
});

describe('provider failures are never reported as sent', () => {
    it('reports a provider rejection', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        sendMock.mockResolvedValue(providerRejects('The ariintegratedholdings.com domain is not verified.'));
        const { emailService } = await loadEmail();

        const outcome = await emailService.sendContactInquiry(inquiry);

        expect(outcome).toEqual({
            status: 'failed',
            reason: 'rejected',
            message: 'The ariintegratedholdings.com domain is not verified.',
        });
    });

    it('reports a transport failure when the provider call throws', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        sendMock.mockRejectedValue(new TypeError('fetch failed'));
        const { emailService } = await loadEmail();

        const outcome = await emailService.sendContactInquiry(inquiry);

        expect(outcome).toEqual({ status: 'failed', reason: 'transport', message: 'fetch failed' });
    });
});

describe('bulk sends never count unsent mail', () => {
    it('reports every recipient as failed when RESEND_API_KEY is missing', async () => {
        const { emailService } = await loadEmail();

        const result = await emailService.sendTreasuryUpdateAlert(
            ['a@example.com', 'B@example.com', 'a@example.com'],
            'Update',
            'Body',
        );

        expect(result).toEqual({ sent: 0, failed: 2, dryRun: false, reason: 'not_configured' });
        expect(batchMock).not.toHaveBeenCalled();
    });

    it('flags a dry run instead of reporting sends', async () => {
        vi.stubEnv('EMAIL_DRY_RUN', 'true');
        const { emailService } = await loadEmail();

        const result = await emailService.sendTreasuryUpdateAlert(['a@example.com'], 'Update', 'Body');

        expect(result).toEqual({ sent: 0, failed: 0, dryRun: true });
        expect(batchMock).not.toHaveBeenCalled();
    });

    it('counts a whole accepted batch', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        batchMock.mockResolvedValue({ data: { data: [{ id: 'em_1' }, { id: 'em_2' }] }, error: null, headers: null });
        const { emailService } = await loadEmail();

        const result = await emailService.sendTreasuryUpdateAlert(['a@example.com', 'b@example.com'], 'Update', 'Body');

        expect(result).toEqual({ sent: 2, failed: 0, dryRun: false });
        const payload = batchMock.mock.calls[0][0];
        expect(payload).toHaveLength(2);
        expect(payload[0].to).toEqual(['a@example.com']);
        expect(payload[0].replyTo).toBe(CTO);
    });

    it('falls back to individual sends when a batch is rejected and counts only acceptances', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        batchMock.mockResolvedValue(providerRejects('batch unavailable', 500));
        sendMock
            .mockResolvedValueOnce({ data: { id: 'em_1' }, error: null, headers: null })
            .mockResolvedValueOnce(providerRejects('bad address', 422));
        const { emailService } = await loadEmail();

        const result = await emailService.sendTreasuryUpdateAlert(['a@example.com', 'b@example.com'], 'Update', 'Body');

        expect(result).toEqual({ sent: 1, failed: 1, dryRun: false });
        expect(sendMock).toHaveBeenCalledTimes(2);
    });
});
