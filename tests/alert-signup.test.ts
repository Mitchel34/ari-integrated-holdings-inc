import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { countMock, createManyMock, findUniqueMock, confirmMock, notifyMock, headersMock } = vi.hoisted(() => ({
    countMock: vi.fn(),
    createManyMock: vi.fn(),
    findUniqueMock: vi.fn(),
    confirmMock: vi.fn(),
    notifyMock: vi.fn(),
    headersMock: vi.fn(),
}));

vi.mock('next/headers', () => ({ headers: headersMock }));
vi.mock('@/lib/prisma', () => ({
    prisma: { investorAlert: { count: countMock, createMany: createManyMock, findUnique: findUniqueMock } },
}));
vi.mock('@/lib/email', () => ({
    emailService: { sendAlertConfirmation: confirmMock, sendSubscriberNotification: notifyMock },
}));

import { subscribeInvestorAlertsAction } from '@/app/investors/actions';
import { INITIAL_ALERT_SIGNUP_STATE } from '@/components/investor/alert-state';

const CTO = 'mitchelcarson@ariintegratedholdings.com';

// The in-memory limiter is keyed by client IP and shared across tests, so each test gets its own address.
let ipCounter = 0;
function useFreshClient() {
    ipCounter += 1;
    const ip = `198.51.100.${ipCounter}`;
    headersMock.mockResolvedValue(new Headers({ 'x-forwarded-for': ip }));
}

function submit(fields: Record<string, string>) {
    const data = new FormData();
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return subscribeInvestorAlertsAction(INITIAL_ALERT_SIGNUP_STATE, data);
}

beforeEach(() => {
    useFreshClient();
    countMock.mockResolvedValue(0);
    createManyMock.mockResolvedValue({ count: 1 });
    findUniqueMock.mockResolvedValue(null);
    confirmMock.mockResolvedValue({ status: 'accepted', id: 'em_1' });
    notifyMock.mockResolvedValue({ status: 'accepted', id: 'em_2' });
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('subscribeInvestorAlertsAction', () => {
    it('records a new address once and emails the subscriber and the CTO', async () => {
        const result = await submit({ email: ' Investor@Example.com ', source: 'investors-page' });

        expect(result.status).toBe('success');
        expect(createManyMock).toHaveBeenCalledWith({
            data: [{ email: 'investor@example.com', source: 'investors-page', isActive: true }],
            skipDuplicates: true,
        });
        expect(confirmMock).toHaveBeenCalledWith('investor@example.com');
        expect(notifyMock).toHaveBeenCalledWith('investor@example.com', 'investors-page');
    });

    it('does not re-send a confirmation to an address that is already subscribed', async () => {
        createManyMock.mockResolvedValue({ count: 0 });
        findUniqueMock.mockResolvedValue({ email: 'investor@example.com', isActive: true });

        const result = await submit({ email: 'investor@example.com' });

        expect(result.status).toBe('success');
        expect(confirmMock).not.toHaveBeenCalled();
        expect(notifyMock).not.toHaveBeenCalled();
    });

    it('never silently re-enables an address an executive deactivated', async () => {
        createManyMock.mockResolvedValue({ count: 0 });
        findUniqueMock.mockResolvedValue({ email: 'investor@example.com', isActive: false });

        const result = await submit({ email: 'investor@example.com' });

        expect(result.status).toBe('error');
        expect(result.message).toContain(CTO);
        expect(confirmMock).not.toHaveBeenCalled();
    });

    it('stops when the site-wide hourly cap is reached, before touching the address', async () => {
        countMock.mockResolvedValue(30);

        const result = await submit({ email: 'investor@example.com' });

        expect(result.status).toBe('error');
        expect(createManyMock).not.toHaveBeenCalled();
        expect(findUniqueMock).not.toHaveBeenCalled();
    });

    it('limits one client to five valid signups per window', async () => {
        for (let i = 0; i < 5; i += 1) {
            const ok = await submit({ email: `investor${i}@example.com` });
            expect(ok.status).toBe('success');
        }
        const blocked = await submit({ email: 'investor5@example.com' });
        expect(blocked.status).toBe('error');
        expect(createManyMock).toHaveBeenCalledTimes(5);
    });

    it('rejects an invalid address without counting it against the client', async () => {
        const result = await submit({ email: 'not-an-address' });
        expect(result.status).toBe('error');
        expect(createManyMock).not.toHaveBeenCalled();
        for (let i = 0; i < 5; i += 1) {
            expect((await submit({ email: `ok${i}@example.com` })).status).toBe('success');
        }
    });

    it('answers a bot that filled the honeypot without recording anything', async () => {
        const result = await submit({ email: 'bot@example.com', website: 'http://spam.example' });
        expect(result.status).toBe('success');
        expect(createManyMock).not.toHaveBeenCalled();
        expect(confirmMock).not.toHaveBeenCalled();
    });

    it('records an unknown source as "website"', async () => {
        await submit({ email: 'investor@example.com', source: 'evil<script>' });
        expect(createManyMock).toHaveBeenCalledWith(
            expect.objectContaining({ data: [{ email: 'investor@example.com', source: 'website', isActive: true }] }),
        );
    });

    it('says so when the confirmation could not be sent', async () => {
        confirmMock.mockResolvedValue({ status: 'failed', reason: 'not_configured', message: 'no key' });
        const result = await submit({ email: 'investor@example.com' });
        expect(result.status).toBe('success');
        expect(result.message).toMatch(/could not send a confirmation/i);
    });
});
