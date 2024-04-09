import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = express.Router();

router.get('/session', (req, res) => {
    try{
        const token = req.cookies.jwt;
        if (!token) {
            return res.json({ user: null });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json({ user: null });
            }
            res.json({ user: decoded });
        });   
    } catch (error) {
        res.json({ user: null });
    }
});

export default router;
