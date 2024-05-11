import express from 'express';
import Event from '../schemas/event.js';    

const router = express.Router();

router.get('/events/:eventId', async (req, res) => {
    const eventId = req.params.eventId.trim();


    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
