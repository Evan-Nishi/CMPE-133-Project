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
      schedule[day] && Array.isArray(schedule[day].slots) &&
      schedule[day].slots.every(slot => typeof slot === 'number' && slot >= 0 && slot < 96)
  );

  if (!isValid) {
      return res.status(400).json({ error: 'Invalid schedule format. Ensure all slots are integers within the range 0-95.' });
  }

  next();
}

// set one's own schedule
router.post('/schedule', authenticate, validateSchedule, async (req, res) => {
  try {
    const { id } = req.user;
    const { schedule } = req.body;

    let updateOps = {};
    for (const day of Object.keys(schedule)) {
      schedule[day].slots.forEach(slotIndex => {
        updateOps[`schedule.${day}.slots.${slotIndex}`] = 1;
      });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { $inc: updateOps },
        { new: true }
    );

    if (!updatedProfile) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Schedule updated successfully', schedule: updatedProfile.schedule });
  } catch (error) {
    console.error('Error updating schedule: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/schedule/clear', authenticate, async (req, res) => {
  try {
      const { id } = req.user;

      const resetOps = {};
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      days.forEach(day => {
          for (let i = 0; i < 96; i++) { 
              resetOps[`schedule.${day}.slots.${i}`] = 0;
          }
      });

      const updatedProfile = await Profile.findByIdAndUpdate(
          id,
          { $set: resetOps }, 
          { new: true }
      );

      if (!updatedProfile) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Schedule cleared successfully', schedule: updatedProfile.schedule });
  } catch (error) {
      console.error('Error clearing schedule: ', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/schedule/clearAll', authenticate, async (req, res) => {
  if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to perform this action' });
  }

  try {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const resetOps = {};
      days.forEach(day => {
          resetOps[`schedule.${day}.slots`] = Array(96).fill(0);  
      });

      const result = await Profile.updateMany(
          {}, 
          { $set: resetOps }
      );

      if (result.nModified === 0) {
          return res.status(404).json({ error: 'No profiles found or no changes made' });
      }

      res.json({ message: `Schedules wiped successfully for ${result.nModified} users` });
  } catch (error) {
      console.error('Error wiping all schedules: ', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;