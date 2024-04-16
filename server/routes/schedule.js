// endpoint to CRUD a user's own schedule
import express from 'express';

import Profile from '../schemas/profile.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// middleware validating schedule structure 
function validateSchedule(req, res, next) {
  const { schedule } = req.body;
  if (!schedule) {
      return res.status(400).json({ error: 'Schedule data is required.' });
  }

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const isValid = days.every(day => 
      schedule[day] && schedule[day].slots && schedule[day].slots.length === 96 &&
      schedule[day].slots.every(slot => slot === 0 || slot === 1)
  );

  if (!isValid) {
      return res.status(400).json({ error: 'Invalid schedule format.' });
  }

  next();
}

// set one's own schedule
router.post('/schedule', authenticate, validateSchedule, async (req, res) => {
  try {
    const { id } = req.user;
    const { schedule } = req.body;

    const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { $set: { 'schedule': schedule } },
        { new: true }
    )

    if (!updatedProfile) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Schedule updated successfully', schedule: updatedProfile.schedule });
  } catch (error) {
    console.error('Error updating schedule: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;