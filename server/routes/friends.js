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
            status: 'invited',
        });
        friend.friends.push({
            friend: userId,
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
    const { friendId } = req.body;
    try {
        const user = await Profile.findById(userId);
        const friend = await Profile.findById(friendId);

        if (!user || !friend) {
            return res.status(404).send('User or friend not found');
        }

        // Check if there is a friend request to accept
        const friendRequest = user.friends.find(f => f.friend.equals(friendId) && f.status === 'pending');
        if (!friendRequest) {
            return res.status(404).send('Friend request not found');
        }

        // Update the status of the friend request
        friendRequest.status = 'accepted';
        await friend.save();

        // Also update the current user's friends list
        const currentUserFriendEntry = user.friends.find(f => f.friend.equals(friendId));
        if (!currentUserFriendEntry) {
            // If no entry, create a new one
            user.friends.push({
                friend: friendId,
                status: 'accepted',
            });
        } else {
            // If entry exists, just update the status
            currentUserFriendEntry.status = 'accepted';
        }
        await user.save();

        res.send('Friend request accepted');
    } catch (error) {
        console.error('Failed to accept friend:', error);
        res.status(500).send('Server error');
    }
});


export default router;