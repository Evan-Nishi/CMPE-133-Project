import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            console.log('No token found');
            return res.json({ user: null });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        res.locals.user = decoded; 
        req.user = decoded;
        next(); 
    } catch (error) {
        res.json({ user: null });
    }
};