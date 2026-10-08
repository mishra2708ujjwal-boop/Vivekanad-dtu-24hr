import { useEffect, useState, useCallback } from 'react';
import { getCircleSocket } from '@/lib/socket';
import { apiClient } from '@/lib/api-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export function useCircles() {
  return useQuery({
    queryKey: ['circles'],
    queryFn: async () => {
      const { data } = await apiClient.get('/circles');
      return data;
    },
  });
}

export function useCircleChat(circleId: string) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial history
  useQuery({
    queryKey: ['circles', circleId, 'messages'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/circles/${circleId}/messages`);
      setMessages(data);
      return data;
    },
    enabled: !!circleId,
  });

  useEffect(() => {
    if (!circleId) return;

    const socket = getCircleSocket();
    
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('circle:join', circleId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message:new', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('circle:leave', circleId);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message:new');
      socket.disconnect();
    };
  }, [circleId]);

  const sendMessage = useCallback((content: string) => {
    const socket = getCircleSocket();
    if (socket.connected) {
      socket.emit('message:send', { circleId, content });
    }
  }, [circleId]);

  return {
    messages,
    isConnected,
    sendMessage
  };
}
