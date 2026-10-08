import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.util';
import { CircleService } from '../services/circle.service';

const circleService = new CircleService();

export function setupCircleSocket(io: Server) {
  const circleNamespace = io.of('/circles');

  circleNamespace.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const payload = verifyAccessToken(token);
      (socket as any).user = payload;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  circleNamespace.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`🔌 User ${user.displayName || user.userId} connected to Socket.IO /circles`);

    socket.on('circle:join', async ({ circleId }) => {
      try {
        await circleService.getCircleDetails(circleId, user.userId);
        socket.join(circleId);
        console.log(`👤 User ${user.userId} joined circle room ${circleId}`);
      } catch (err) {
        socket.emit('error', { message: 'Failed to join circle room.' });
      }
    });

    socket.on('message:send', async ({ circleId, body, kind }) => {
      try {
        const message = await circleService.sendMessage(circleId, user.userId, body, kind);
        circleNamespace.to(circleId).emit('message:new', message);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User ${user.userId} disconnected from /circles`);
    });
  });
}
