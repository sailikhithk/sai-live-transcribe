import { useState, useEffect, useCallback } from 'react';

export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(url);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setSocketError('WebSocket connection error. Please try again later.');
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      newSocket.close();
    };
  }, [url]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      setLastMessage(event.data);
    };
  }, [socket]);

  const sendMessage = useCallback((message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      setSocketError('WebSocket is not connected. Please try again later.');
    }
  }, [socket]);

  return { sendMessage, lastMessage, socketError };
};