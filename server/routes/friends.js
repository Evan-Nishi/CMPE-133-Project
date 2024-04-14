// endpoints for adding, removing, and getting friends
import express from 'express';
import 'dotenv/config';
import Profile from '../schemas/profile.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/friends', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;
  try {
    const user = await Profile.findById(userId);
    const friend = await Profile.findById(friendId);

    if (!user || !friend) {
        return res.status(404).send('User or friend not found');
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
        return res.status(400).send('Already friends');
    }

    // Add friendId to the user's friends array
    user.friends.push(friendId);
    await user.save();

    res.send('Friend added successfully');
} catch (error) {
    res.status(500).send('Server error');
}

});


export default router;