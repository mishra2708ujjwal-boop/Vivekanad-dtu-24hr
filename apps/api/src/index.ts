import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import authRouter from './routes/auth.router';
import profileRouter from './routes/profile.router';
import needRouter from './routes/need.router';
import sevaRouter from './routes/seva.router';
import matchingRouter from './routes/matching.router';
import circleRouter from './routes/circle.router';
import momentRouter from './routes/moment.router';
import moderationRouter from './routes/moderation.router';

import { errorHandler } from './middleware/error.middleware';
import { setupCircleSocket } from './sockets/circle.socket';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
});

setupCircleSocket(io);

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Technology as Seva API', timestamp: new Date().toISOString() });
});

// API Routes prefix /api/v1
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(API_PREFIX, profileRouter);
app.use(API_PREFIX, needRouter);
app.use(API_PREFIX, sevaRouter);
app.use(API_PREFIX, matchingRouter);
app.use(API_PREFIX, circleRouter);
app.use(API_PREFIX, momentRouter);
app.use(API_PREFIX, moderationRouter);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Technology as Seva Backend API listening on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO Gateway active on ws://localhost:${PORT}/circles`);
});
