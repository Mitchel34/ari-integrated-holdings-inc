"use server";

import { zoomService } from "../lib/zoom";
import { emailService } from "../lib/email";

export async function scheduleMeetingAction(topic: string, startTime: string) {
    const meeting = await zoomService.createMeeting(topic, new Date(startTime));
    return meeting;
}

export async function endMeetingAndSendSummaryAction(meetingId: string, topic: string) {
    const summary = await zoomService.getMeetingSummary(meetingId);
    // Goes to the correspondence inbox; report honestly whether the provider took it.
    const outcome = await emailService.sendMeetingSummary(topic, summary);
    return { success: outcome.status === "accepted", summary };
}
