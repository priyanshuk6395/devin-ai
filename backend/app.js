import express from 'express';
import cors from 'cors'
import connect from './db/db.js';
import userRoute from './routes/user.routes.js'
import cookieParser from 'cookie-parser';
import projectRoute from './routes/project.routes.js'
import aiRoute from './routes/ai.routes.js'
connect();
const app = express();
app.use(cors({ origin: `${process.env.REACT_URL}`, credentials: true }));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log(req.body);
    console.log(req.headers.origin);
    next();
  });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/users',userRoute);
app.use('/projects',projectRoute);
app.use('/ai',aiRoute)

export default app;