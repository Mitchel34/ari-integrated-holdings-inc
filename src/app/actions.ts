"use server";

import { zoomService } from "../lib/zoom";
import { emailService } from "../lib/email";

export async function scheduleMeetingAction(topic: string, startTime: string) {
    const meeting = await zoomService.createMeeting(topic, new Date(startTime));
    return meeting;
}

export async function endMeetingAndSendSummaryAction(meetingId: string, topic: string) {
    const summary = await zoomService.getMeetingSummary(meetingId);
    await emailService.sendEmail(
        "executives@ari.com",
        `Meeting Summary: ${topic}`,
        summary
    );
    return { success: true, summary };
}
