import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import login from './routes/login.js'
import createAccount from './routes/createUser.js'

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
app.use(login);
app.use(createAccount)

app.listen(port, () => {
    console.log(`Express server listening on port: ${port}`);
});