// create event object, and add the event to the user's profile
import express from 'express';
import 'dotenv/config';
import Profile from '../schemas/profile.js';
import Event from '../schemas/event.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

async function hasTimeConflicts(userId, isoDate, startSlot, endSlot) {
    const profile = await Profile.findById(userId);
    if (!profile) {
        console.log("Profile not found for user:", userId);
        return false;
    }

    const dateOfEvent = new Date(isoDate).setHours(0, 0, 0, 0); // Normalize the date

    console.log(`Checking conflicts for user ${userId} on date ${isoDate} from slot ${startSlot} to ${endSlot}`);
    const conflicts = profile.events.some(event => {
        const existingEventDate = new Date(event.date).setHours(0, 0, 0, 0);

        if (dateOfEvent === existingEventDate) {
            const conflictExists = startSlot < event.end && endSlot > event.start;
            if (conflictExists) {
                console.log(`Conflict found with event: ${event._id} from slot ${event.start} to ${event.end}`);
            }
            return conflictExists;
        }
        return false;
    });

    if (!conflicts) {
        console.log("No conflicts found for user:", userId);
    }

    return conflicts;
}


router.post('/event', authenticate, async (req, res) => {
    const { id, username } = req.user; // id is the creator's profile ID
    const { title, description, participants, date, start, end } = req.body;

    try {
        const participantProfiles = await Promise.all(participants.map(async ({ username }) => {
            const profile = await Profile.findOne({ username }).exec();
            if (!profile) {
                throw new Error(`No profile found for username: ${username}`);
            }
            if (await hasTimeConflicts(profile._id, date, start, end)) {
                throw new Error(`Time conflict for user ${username}`);
            }
            return profile._id;
        }));

        if (await hasTimeConflicts(id, date, start, end)) {
            return res.status(409).send('Time conflict for event creator');
        }

        const uniqueParticipantIds = new Set(participantProfiles);
        uniqueParticipantIds.add(id);

        const participantsData = Array.from(uniqueParticipantIds).map(participantId => ({
            participant_id: participantId,
            status: participantId.toString() === id.toString() ? 'accepted' : 'pending'
        }));

        // Create the new event with the creator listed as a participant
        const newEvent = new Event({
            title,
            description,
            participants: participantsData,
            date,
            start,
            end,
            creator: {
                creatorId: id,
                creatorName: username
            },
        });

        const savedEvent = await newEvent.save();

        // Update each participant's profile including the creator
        await Promise.all(participantsData.map(async ({ participant_id, status }) => {
            await Profile.findByIdAndUpdate(participant_id, {
                $push: {
                    events: {
                        eventId: savedEvent._id,
                        status: status
                    }
                }
            });
        }));

        res.status(201).json({
            message: `Event successfully created by ${username} for ${participantsData.length} participants.`,
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
const { id } = req.user;  
const { title, description, participants, date, start, end } = req.body;
const { eventId } = req.params;

try {
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).send('Event not found');
    }
    if (event.creator.creatorId.toString() !== id) {
        return res.status(403).send('Not authorized to edit this event');
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.start = start || event.start;
    event.end = end || event.end;

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

    await event.save();

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