import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/session', authenticate, (req, res) => {
    res.json({ user: { id: req.id } });
});

export default router;
