"use client";

import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from './ui/Button';
import { scheduleMeetingAction, endMeetingAndSendSummaryAction } from '../app/actions';

const localizer = momentLocalizer(moment);

interface Event {
    id: string | number;
    title: string;
    start: Date;
    end: Date;
    desc?: string;
    meetingId?: string;
    joinUrl?: string;
    isZoom?: boolean;
}

export default function CalendarView() {
    const [events, setEvents] = useState<Event[]>([
        {
            id: 0,
            title: 'Board Meeting',
            start: new Date(new Date().setHours(10, 0, 0, 0)),
            end: new Date(new Date().setHours(12, 0, 0, 0)),
            desc: 'Quarterly board meeting',
        },
    ]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
        const title = window.prompt('Scheule New Zoom Meeting - Enter Topic:');
        if (title) {
            // Optimistic update
            const tempId = Math.random();
            const newEvent: Event = {
                id: tempId,
                title: `🎥 ${title}`,
                start,
                end,
                isZoom: true,
            };
            setEvents(prev => [...prev, newEvent]);

            try {
                const meeting = await scheduleMeetingAction(title, start.toISOString());
                // Update with real details
                setEvents(prev => prev.map(e => e.id === tempId ? {
                    ...e,
                    id: meeting.id,
                    meetingId: meeting.id,
                    joinUrl: meeting.join_url,
                    desc: `Zoom Meeting ID: ${meeting.id}`
                } : e));
            } catch (error) {
                console.error("Failed to schedule meeting", error);
                alert("Failed to schedule zoom meeting");
                setEvents(prev => prev.filter(e => e.id !== tempId));
            }
        }
    };

    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
    };

    const handleSimulateEndMeeting = async () => {
        if (!selectedEvent || !selectedEvent.meetingId) return;

        const confirm = window.confirm("End meeting and email summary to executives?");
        if (confirm) {
            try {
                await endMeetingAndSendSummaryAction(selectedEvent.meetingId, selectedEvent.title);
                alert(`Summary sent for ${selectedEvent.title}! Check server console.`);
                setSelectedEvent(null);
            } catch (error) {
                console.error(error);
                alert("Failed to send summary");
            }
        }
    };

    return (
        <div style={{ height: '700px', position: 'relative' }}>
            {selectedEvent && (
                <div style={{
                    position: 'absolute',
                    zIndex: 10,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    border: '1px solid #ddd',
                    minWidth: '300px'
                }}>
                    <h3>{selectedEvent.title}</h3>
                    <p>{selectedEvent.start.toLocaleString()} - {selectedEvent.end.toLocaleString()}</p>
                    {selectedEvent.desc && <p>{selectedEvent.desc}</p>}
                    {selectedEvent.joinUrl && (
                        <p><a href={selectedEvent.joinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>Join Zoom Meeting</a></p>
                    )}

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                        <Button onClick={() => setSelectedEvent(null)}>Close</Button>
                        {selectedEvent.isZoom && (
                            <Button onClick={handleSimulateEndMeeting}>End & Send Summary</Button>
                        )}
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Schedule</h2>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Click and drag on calendar to schedule a Zoom meeting. Click an event to manage it.
                </div>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                defaultView={Views.WEEK}
            />
        </div>
    );
}

