'use client';

import { useState } from 'react';
import { DashboardPanel } from '@/components/dashboard/Dashboard';
import BroadcastTool from './BroadcastTool';
import BroadcastHistory from './BroadcastHistory';

export default function BroadcastCenter({ subscriberCount }: { subscriberCount: number }) {
    const [historyVersion, setHistoryVersion] = useState(0);

    return (
        <>
            <DashboardPanel
                eyebrow="Communications"
                title="Send investor alert"
                description="Broadcast a treasury update or announcement to all active alert subscribers. Replies are routed to the CTO."
            >
                <BroadcastTool subscriberCount={subscriberCount} onSent={() => setHistoryVersion((version) => version + 1)} />
            </DashboardPanel>

            <DashboardPanel
                eyebrow="Communications"
                title="Recent broadcasts"
                description="History of alerts sent to subscribers."
            >
                <BroadcastHistory refreshKey={historyVersion} />
            </DashboardPanel>
        </>
    );
}
