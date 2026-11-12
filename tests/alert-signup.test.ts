import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { countMock, createManyMock, updateManyMock, confirmMock, notifyMock, headersMock } = vi.hoisted(() => ({
    countMock: vi.fn(),
    createManyMock: vi.fn(),
    updateManyMock: vi.fn(),
    confirmMock: vi.fn(),
    notifyMock: vi.fn(),
    headersMock: vi.fn(),
}));

vi.mock('next/headers', () => ({ headers: headersMock }));
vi.mock('@/lib/prisma', () => ({
    prisma: { investorAlert: { count: countMock, createMany: createManyMock, updateMany: updateManyMock } },
}));
vi.mock('@/lib/email', () => ({
    emailService: { sendAlertConfirmation: confirmMock, sendSubscriberNotification: notifyMock },
}));

import { subscribeInvestorAlertsAction } from '@/app/investors/actions';
import { INITIAL_ALERT_SIGNUP_STATE } from '@/app/investors/alert-signup-state';

// The in-memory limiter is keyed by client IP and shared across tests, so each test gets its own address.
let ipCounter = 0;
function useFreshClient() {
    ipCounter += 1;
    const ip = `198.51.100.${ipCounter}`;
    headersMock.mockResolvedValue(new Headers({ 'x-forwarded-for': ip }));
}

function submit(email: string, source?: string) {
    const data = new FormData();
    data.set('email', email);
    return subscribeInvestorAlertsAction(INITIAL_ALERT_SIGNUP_STATE, data, source);
}

beforeEach(() => {
    useFreshClient();
    countMock.mockResolvedValue(0);
    createManyMock.mockResolvedValue({ count: 1 });
    updateManyMock.mockResolvedValue({ count: 0 });
    confirmMock.mockResolvedValue({ status: 'accepted', id: 'em_1' });
    notifyMock.mockResolvedValue({ status: 'accepted', id: 'em_2' });
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('subscribeInvestorAlertsAction', () => {
    it('records a new address once, confirms to the subscriber and notifies the correspondence inbox', async () => {
        const result = await submit(' Investor@Example.com ');

        expect(result.status).toBe('success');
        expect(result.message).toMatch(/^Confirmed\./);
        expect(createManyMock).toHaveBeenCalledWith({
            data: [{ email: 'investor@example.com', source: 'investors-page', isActive: true }],
            skipDuplicates: true,
        });
        expect(updateManyMock).not.toHaveBeenCalled();
        expect(confirmMock).toHaveBeenCalledTimes(1);
        expect(confirmMock).toHaveBeenCalledWith('investor@example.com');
        expect(notifyMock).toHaveBeenCalledWith('investor@example.com', 'investors-page');
    });

    it('records where the signup came from when the caller says so', async () => {
        await submit('investor@example.com', 'thesis');

        expect(createManyMock).toHaveBeenCalledWith(
            expect.objectContaining({ data: [{ email: 'investor@example.com', source: 'thesis', isActive: true }] }),
        );
        expect(notifyMock).toHaveBeenCalledWith('investor@example.com', 'thesis');
    });

    it('does not re-send a confirmation to an address that is already subscribed', async () => {
        createManyMock.mockResolvedValue({ count: 0 });
        updateManyMock.mockResolvedValue({ count: 0 });

        const result = await submit('investor@example.com');

        expect(result.status).toBe('success');
        expect(confirmMock).not.toHaveBeenCalled();
        expect(notifyMock).not.toHaveBeenCalled();
    });

    it('confirms again when a signup reactivates a deactivated address', async () => {
        createManyMock.mockResolvedValue({ count: 0 });
        updateManyMock.mockResolvedValue({ count: 1 });

        const result = await submit('investor@example.com');

        expect(result.status).toBe('success');
        // Stamped as a new subscription so it counts toward the site-wide hourly cap.
        expect(updateManyMock).toHaveBeenCalledWith({
            where: { email: 'investor@example.com', isActive: false },
            data: { isActive: true, subscribedAt: expect.any(Date) },
        });
        expect(confirmMock).toHaveBeenCalledTimes(1);
        expect(notifyMock).toHaveBeenCalledTimes(1);
    });

    it('gives one answer whether the address is new, already listed, or the confirmation failed', async () => {
        const fresh = await submit('new@example.com');

        createManyMock.mockResolvedValue({ count: 0 });
        const existing = await submit('listed@example.com');

        createManyMock.mockResolvedValue({ count: 1 });
        confirmMock.mockResolvedValue({ status: 'failed', reason: 'not_configured', message: 'no key' });
        const unconfirmed = await submit('unconfirmed@example.com');

        confirmMock.mockResolvedValue({ status: 'dry-run' });
        const dryRun = await submit('dryrun@example.com');

        // A different answer per case would reveal who is on the list.
        expect(existing).toEqual(fresh);
        expect(unconfirmed).toEqual(fresh);
        expect(dryRun).toEqual(fresh);
        expect(fresh.status).toBe('success');
    });

    it('records an unknown source as the default instead of storing or mailing caller text', async () => {
        await submit('investor@example.com', 'click https://evil.example now');

        expect(createManyMock).toHaveBeenCalledWith(
            expect.objectContaining({ data: [{ email: 'investor@example.com', source: 'investors-page', isActive: true }] }),
        );
        expect(notifyMock).toHaveBeenCalledWith('investor@example.com', 'investors-page');
    });

    it('rejects an "address" that carries a second recipient or mailto fields', async () => {
        for (const value of ['a@example.com,b@example.com', 'a@example.com?bcc=x%40evil.example', 'a..b@example.com']) {
            const result = await submit(value);
            expect(result.status).toBe('error');
        }
        expect(createManyMock).not.toHaveBeenCalled();
    });

    it('hands the typed address back on an error so the form can keep it', async () => {
        const invalid = await submit('  not-an-address ');
        expect(invalid).toMatchObject({ status: 'error', email: 'not-an-address' });

        createManyMock.mockRejectedValue(new Error('connection refused'));
        const failed = await submit('Investor@Example.com');
        expect(failed).toMatchObject({ status: 'error', email: 'Investor@Example.com' });
    });

    it('stops when the site-wide hourly cap is reached, before touching the address', async () => {
        countMock.mockResolvedValue(30);

        const result = await submit('investor@example.com');

        expect(result.status).toBe('error');
        expect(createManyMock).not.toHaveBeenCalled();
        expect(updateManyMock).not.toHaveBeenCalled();
        expect(confirmMock).not.toHaveBeenCalled();
    });

    it('limits one client to five valid signups per window', async () => {
        for (let i = 0; i < 5; i += 1) {
            const ok = await submit(`investor${i}@example.com`);
            expect(ok.status).toBe('success');
        }

        const blocked = await submit('investor5@example.com');

        expect(blocked.status).toBe('error');
        expect(createManyMock).toHaveBeenCalledTimes(5);
    });

    it('rejects an invalid address without counting it against the client', async () => {
        const result = await submit('not-an-address');

        expect(result.status).toBe('error');
        expect(createManyMock).not.toHaveBeenCalled();
        for (let i = 0; i < 5; i += 1) {
            expect((await submit(`ok${i}@example.com`)).status).toBe('success');
        }
    });

    it('rejects an address longer than a mailbox can be', async () => {
        const result = await submit(`${'a'.repeat(250)}@example.com`);

        expect(result.status).toBe('error');
        expect(createManyMock).not.toHaveBeenCalled();
    });

    it('reports a database failure as an error and sends nothing', async () => {
        createManyMock.mockRejectedValue(new Error('connection refused'));

        const result = await submit('investor@example.com');

        expect(result.status).toBe('error');
        expect(confirmMock).not.toHaveBeenCalled();
        expect(notifyMock).not.toHaveBeenCalled();
    });
});
