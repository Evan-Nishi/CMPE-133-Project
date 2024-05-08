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

        // Check if a pending or accepted friend request already exists
        if (user.friends.some(f => f.friend.equals(friendId))) {
            return res.status(400).send('Request already sent or already friends');
        }
        
        // Add a pending request to both user's and friend's friend lists
        user.friends.push({
            friend: friendId,
            name: friend.username,
            status: 'invited',
        });
        friend.friends.push({
            friend: userId,
            name: user.username,
            status: 'pending',
        });
        await user.save();
        await friend.save();

        res.send('Friend request sent to ' + friend.username);
    } catch (error) {
        console.error('Failed to save friend:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});


router.put('/friends', authenticate, async (req, res) => {
    const userId = req.user.id;
    const { friendId, status } = req.body;

    // Validate the status
    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).send('Invalid status. Must be "accepted" or "rejected".');
    }

    try {
        const user = await Profile.findById(userId);
        const friend = await Profile.findById(friendId);

        if (!user || !friend) {
            return res.status(404).send('User or friend not found');
        }

        // Find the friend request in both the user's and the friend's friend lists
        const userFriendRequestIndex = user.friends.findIndex(f => f.friend.equals(friendId) && f.status === 'pending');
        const friendRequestIndex = friend.friends.findIndex(f => f.friend.equals(userId) && f.status === 'invited');

        if (userFriendRequestIndex === -1 || friendRequestIndex === -1) {
            return res.status(404).send('Friend request not found');
        }

        if (status === 'accepted') {
            // Update both sides to 'accepted' if the request is accepted
            user.friends[userFriendRequestIndex].status = 'accepted';
            friend.friends[friendRequestIndex].status = 'accepted';
        } else if (status === 'rejected') {
            // Remove the friend request from both users if the request is rejected
            user.friends.splice(userFriendRequestIndex, 1);
            friend.friends.splice(friendRequestIndex, 1);
        }

        await user.save();
        await friend.save();
        res.send(`Friend request ${status}`);
    } catch (error) {
        console.error(`Failed to ${status} friend:`, error);
        res.status(500).send('Server error');
    }
});


export default router;