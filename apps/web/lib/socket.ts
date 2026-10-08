import { io, Socket } from 'socket.io-client';

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';

let circleSocket: Socket | null = null;

export const getCircleSocket = () => {
  if (!circleSocket) {
    circleSocket = io(`${WS_URL}/circles`, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return circleSocket;
};
