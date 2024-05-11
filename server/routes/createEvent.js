// create event object, and add the event to the user's profile
import express from 'express';
import 'dotenv/config';
import Profile from '../schemas/profile.js';
import Event from '../schemas/event.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/event', authenticate, async (req, res) => {
const { id, username } = req.user;
const { title, description, participants, date, start, end } = req.body;

try {
    const participantIds = await Promise.all(participants.map(async ({ username }) => {
        const profile = await Profile.findOne({ username }).exec();
        if (!profile) {
            throw new Error(`No profile found for username: ${username}`);
        }
        return {
            participant_id: profile._id,
            status: 'pending'
        };
    }));

    const newEvent = new Event({
        title,
        description,
        participants: participantIds,
        date,
        start,
        end,
        creator: {
            creatorId: id, 
            creatorName: username 
        },
    });

    const savedEvent = await newEvent.save();

    await Promise.all(participantIds.map(async ({ participant_id }) => {
        await Profile.findByIdAndUpdate(participant_id, {
            $push: {
                events: {
                    eventId: savedEvent._id,
                    status: 'pending'
                }
            }
        });
    }));

    await Profile.findByIdAndUpdate(id, {
        $push: {
            events: {
                eventId: savedEvent._id,
                status: 'accepted'
            }
        }
    });

    res.status(201).json({
        message: `Event successfully created by ${username} for ${participantIds.length} participants.`,
        event: savedEvent
    });
} catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send('Internal server error');
}
});

router.put('/event/respond', authenticate, async (req, res) => {
const userId = req.user.id;
const { eventId, status } = req.body;

if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).send('Invalid status. Must be "accepted" or "rejected".');
}

try {
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).send('Event not found');
    }

    const participantIndex = event.participants.findIndex(p => p.participant_id.equals(userId) && p.status === 'pending');
    if (participantIndex === -1) {
        return res.status(400).send('No pending invitation found');
    }

    const user = await Profile.findById(userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    const userEventIndex = user.events.findIndex(e => e.eventId.equals(eventId) && e.status === 'pending');
    if (userEventIndex === -1) {
        return res.status(400).send('No pending invitation found in user profile');
    }

    if (status === 'accepted') {
        event.participants[participantIndex].status = 'accepted';
        user.events[userEventIndex].status = 'accepted';

        const eventDay = event.date.toISOString().split('T')[0]; 
        const dayOfWeek = new Date(eventDay).getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        // Update schedule slots
        for (let slot = event.start; slot <= event.end; slot++) {
            user.schedule[dayNames[dayOfWeek]].slots[slot]++;
        }
    } else if (status === 'rejected') {
        event.participants.splice(participantIndex, 1);
        user.events.splice(userEventIndex, 1);
    }

    await event.save();
    await user.save();

    res.send(`Event invitation ${status}`);
} catch (error) {
    console.error(`Error responding to event invitation:`, error);
    res.status(500).send('Internal server error');
}
});

router.put('/event/:eventId', authenticate, async (req, res) => {
const { id } = req.user;  // Creator's ID from the authenticated user
const { title, description, participants, date, start, end } = req.body; // Data from the request body
const { eventId } = req.params; // Event ID from the URL

try {
    // Fetch the existing event
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).send('Event not found');
    }
    if (event.creator.creatorId.toString() !== id) {
        return res.status(403).send('Not authorized to edit this event');
    }

    // Update the event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.start = start || event.start;
    event.end = end || event.end;

    // Determine the new and removed participants
    const currentParticipantIds = event.participants.map(p => p.participant_id.toString());
    const newParticipants = participants.filter(p => !currentParticipantIds.includes(p));
    const existingParticipants = event.participants.filter(p => participants.includes(p.participant_id.toString()));

    // Update participants in the event
    event.participants = [
        ...existingParticipants,
        ...newParticipants.map(participant => ({
            participant_id: participant,
            status: 'pending'
        }))
    ];

    // Save the updated event
    await event.save();

    // Add the event to new participants' profiles
    await Promise.all(newParticipants.map(participant => {
        return Profile.findByIdAndUpdate(participant, {
            $push: {
                events: {
                    eventId,
                    status: 'pending'
                }
            }
        });
    }));

    // Remove the event from profiles of participants who are no longer part of the event
    const removedParticipants = currentParticipantIds.filter(p => !participants.includes(p));
    await Promise.all(removedParticipants.map(participant => {
        return Profile.findByIdAndUpdate(participant, {
            $pull: {
                events: { event: eventId }
            }
        });
    }));

    res.status(200).json({
        message: 'Event updated successfully.',
        event: event
    });
} catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('Internal server error');
}
});

export default router;