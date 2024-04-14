import express from 'express'
import bcrypt from 'bcrypt'
import 'dotenv/config';
import Profile from '../../schemas/profile.js';
import { handleLogin } from './login.js';

const router = express.Router()

router.post('/createAccount', express.json(), async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await Profile.findOne({ username }).exec();

        if (exists) {
            return res.status(409).json({ error: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Profile({ username, password: hashedPassword });
        await user.save();
        
        const login = await handleLogin(username, password, false);
        if (login.error) throw new Error(login.error);
        console.log('hi')
        const maxAge = 24 * 60 * 60 * 1000; 
        res.cookie('jwt', login.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: maxAge,
        });

        res.status(201).json({ message: 'Account created successfully', username});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
  
export default router;