import express from 'express';

const router = express.Router();
router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.json({ message: 'Logout successful' });
});

export default router;
