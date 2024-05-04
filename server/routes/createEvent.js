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
      const newEvent = new Event({
          title,
          description,
          participants: participants.map(participant => ({
              participant_id: participant,
              status: 'pending' 
          })),
          date,
          start,
          end,
          creator: {
              creatorId: id, 
              creatorName: username 
          },
      });

      const savedEvent = await newEvent.save();

      // add event to each participant's profile
      await Promise.all(participants.map(async participant => {
          await Profile.findByIdAndUpdate(participant, {
              $push: {
                  events: {
                      eventId: savedEvent._id,
                      status: 'invited' 
                  }
              }
          });
      }));

      await Profile.findByIdAndUpdate(id, {
        $push: {
          events: {
            event: savedEvent._id,
            status: 'accepted'
          }
        }
      });

      res.status(201).json({
          message: `Event successfully created by ${username} for ${participants.length} participants.`,
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
      const userEventIndex = user.events.findIndex(e => e.eventId.equals(eventId) && e.status === 'invited');
      if (userEventIndex === -1) {
          return res.status(400).send('No pending invitation found in user profile');
      }

      if (status === 'accepted') {
          event.participants[participantIndex].status = 'accepted';
          user.events[userEventIndex].status = 'accepted';
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

export default router;