// endpoint to get logged in user's own data
import express from 'express';
import 'dotenv/config';
import Profile from '../schemas/profile.js';
import Event from '../schemas/event.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/profile/:username', authenticate, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await Profile.findOne({ username }).exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let userData = {
      id: user._id,
      username: user.username,
      friends: user.friends,
    };

    const isFriend = user.friends.some(f => f.friend.toString() === req.user.id && f.status === "accepted");

    if (req.user.id === user._id.toString() || isFriend) {
      const events = await Event.find({ 'participants.participant_id': user._id }).exec();
      userData.events = events.map(event => ({
        eventId: event._id,
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        status: event.participants.find(p => p.participant_id.toString() === user._id.toString()).status
      }));
    }

    res.json(userData);
  } catch (err) {
    console.error("Server error on fetching profile:", err);
    res.status(500).json({ error: 'Error', details: err.message });
  }
});

router.post('/profile', authenticate, async (req, res) => {
  try {
    const _id = req.body.id;
    const user = await Profile.findOne({ _id }).exec();
    if (!user) { return res.status(404).json({ error: 'User not found' }) }

    const events = await Event.find({
      'participants.participant_id': user._id,
    }).exec();
    if (req.user.id === user._id.toString()) {
      res.json({ 
        id: user._id,
        username: user.username,
        schedule: user.schedule,
        friends: user.friends,
        events: user.events
      });
    } else {
      res.json({ 
        id: user._id,
        username: user.username,
        friends: user.friends
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error', details: err.message });
  }
});

export default router;