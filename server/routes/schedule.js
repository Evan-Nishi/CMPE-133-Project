// endpoint to get logged in user's own data
import express from 'express';
import 'dotenv/config';
import Profile from '../schemas/profile.js';

const router = express.Router();

router.get('/schedule/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await Profile.findOne({ username }).exec();
    
    if (!user) { return res.status(404).json({ error: 'User not found' }) }

    res.json({ 
      username: user.username,
      schedule: user.schedule,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error', details: err.message });
  }

});


export default router;