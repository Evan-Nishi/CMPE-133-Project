import express from 'express';

const router = express.Router();
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.json({ message: 'Logout successful' });
});

export default router;
