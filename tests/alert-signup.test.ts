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
        expect(updateManyMock).toHaveBeenCalledWith({
            where: { email: 'investor@example.com', isActive: false },
            data: { isActive: true },
        });
        expect(confirmMock).toHaveBeenCalledTimes(1);
        expect(notifyMock).toHaveBeenCalledTimes(1);
    });

    it('says so when the confirmation email was not accepted, and still counts the signup', async () => {
        confirmMock.mockResolvedValue({ status: 'failed', reason: 'not_configured', message: 'no key' });

        const result = await submit('investor@example.com');

        expect(result.status).toBe('success');
        expect(result.message).toMatch(/could not send a confirmation/i);
        expect(result.message).not.toMatch(/^Confirmed\./);
    });

    it('does not claim a confirmation in a dry run either', async () => {
        confirmMock.mockResolvedValue({ status: 'dry-run' });

        const result = await submit('investor@example.com');

        expect(result.status).toBe('success');
        expect(result.message).toMatch(/could not send a confirmation/i);
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
