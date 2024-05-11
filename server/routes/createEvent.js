// create event object, and add the event to the user's profile
import express from 'express';
import 'dotenv/config';
import Profile from '../schemas/profile.js';
import Event from '../schemas/event.js';
import { authenticate } from '../middleware/authenticate.js';
import mongoose from 'mongoose';


const router = express.Router();

async function hasTimeConflicts(userId, isoDate, startSlot, endSlot) {
    const profile = await Profile.findById(userId);
    if (!profile) {
        console.log("Profile not found for user:", userId);
        return false; // No profile found
    }

    const dateOfEvent = new Date(isoDate);
    dateOfEvent.setHours(0, 0, 0, 0); // Normalize the date

    const conflicts = profile.events.some(event => {
        const existingEventDate = new Date(event.date);
        existingEventDate.setHours(0, 0, 0, 0);

        // Correct date comparison using getTime
        if (dateOfEvent.getTime() === existingEventDate.getTime()) {
            // Check for overlapping time slots
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
        let participantProfiles = [];

        if (participants && participants.length > 0) {
            // Ensure each participant has a non-empty username before attempting to find their profile
            participantProfiles = await Promise.all(participants.filter(p => p.username.trim() !== '').map(async (p) => {
                const profile = await Profile.findOne({ username: p.username.trim() }).exec();
                if (!profile) {
                    throw new Error(`No profile found for username: ${p.username}`);
                }
                if (await hasTimeConflicts(profile._id, date, start, end)) {
                    throw new Error(`Time conflict for user ${p.username}`);
                }
                return {
                    participant_id: profile._id,
                    status: 'pending'
                };
            }));
        }

        // Include the creator as a participant with 'accepted' status
        participantProfiles.push({
            participant_id: id,
            status: 'accepted'
        });

        if (await hasTimeConflicts(id, date, start, end)) {
            return res.status(409).send('Time conflict');
        }

        const newEvent = new Event({
            title,
            description,
            participants: participantProfiles,
            date,
            start,
            end,
            creator: {
                creatorId: id,
                creatorName: username
            },
        });

        const savedEvent = await newEvent.save();

        await Promise.all(participantProfiles.map(async (participant) => {
            if (participant.participant_id !== id) { // Avoid adding the event to the creator's profile again
                await Profile.findByIdAndUpdate(participant.participant_id, {
                    $push: {
                        events: {
                            eventId: savedEvent._id,
                            status: participant.status
                        }
                    }
                });
            }
        }));

        // Optionally, update the creator's profile to include this event (if profiles track events)
        await Profile.findByIdAndUpdate(id, {
            $push: {
                events: {
                    eventId: savedEvent._id,
                    status: 'accepted'
                }
            }
        });

        res.status(201).json({
            message: `Event successfully created by ${username}.`,
            event: savedEvent
        });
    } catch ( error) {
        let errorMessage = 'Internal server error';
        if (error.message.includes('Time conflict')) {
            errorMessage = 'Time conflict';
        } else if (error.message.includes('No profile found')) {
            errorMessage = 'Profile not found';
        }
        console.error('Error creating event:', error);
        res.status(400).send(errorMessage);
    }
});







router.put('/event/respond', authenticate, async (req, res) => {
const userId = req.user.id;
const { eventId, status } = req.body;
const eventIdObject = new mongoose.Types.ObjectId(eventId);


console.log('Event ID:', eventIdObject);
console.log('status:', status);

if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).send('Invalid status. Must be "accepted" or "rejected".');
}

try {
    const event = await Event.findById(eventIdObject);
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