export interface ZoomMeeting {
    id: string;
    topic: string;
    start_time: string;
    join_url: string;
}

export const zoomService = {
    async createMeeting(topic: string, startTime: Date): Promise<ZoomMeeting> {
        // Mock Zoom API call
        console.log(`[Mock Zoom API] Creating meeting: ${topic} at ${startTime}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        return {
            id: Math.random().toString(36).substr(2, 9),
            topic,
            start_time: startTime.toISOString(),
            join_url: `https://zoom.us/j/mock-${Math.random().toString(36).substr(2, 9)}`
        };
    },

    async getMeetingSummary(meetingId: string): Promise<string> {
        // Mock AI Summary generation
        console.log(`[Mock Zoom API] Generating summary for meeting ${meetingId}`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        return `
            **Meeting Summary**
            - **Date**: ${new Date().toLocaleDateString()}
            - **Attendees**: Executive Team
            - **Key Decisions**:
                1. Approved Q3 Budget.
                2. Greenlit the new marketing campaign.
            - **Action Items**:
                - CTO to finalize vendor contracts.
                - CFO to prepare financial report.
        `;
    }
};
