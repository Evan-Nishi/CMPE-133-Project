import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/session', authenticate, (req, res) => {
    const { user } = res.locals;
    res.json({ user });
});

export default router;
