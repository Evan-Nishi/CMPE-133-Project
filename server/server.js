import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import login from './routes/login.js'
import createAccount from './routes/createUser.js'
import userSession from './routes/userSession.js'
import logout from './routes/logout.js'
import profile from './routes/profile.js';

import Profile from './schemas/profile.js';


const app = express();
const port = process.env.DEFAULT_PORT; 

const mongoURI = process.env.ATLAS_URI;

// connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// express tools
app.use(cors({
    origin: process.env.DEPLOYMENT_URL, 
    credentials: true,
}));
app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
    res.send('Home URL')
})
app.get('/users', async (req, res) => {
  try {
    const profiles = await Profile.find({});
    res.json(profiles);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.delete('/users', async (req, res) => {
  try {
    await Profile.deleteMany({});
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});
app.use(login);
app.use(createAccount)
app.use(userSession);
app.use(logout);
app.use(profile);

app.listen(port, () => {
    console.log(`Express server listening on port: ${port}`);
});