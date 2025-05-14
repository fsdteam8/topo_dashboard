"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

// Define the shape of our context
interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => boolean;
  lastMessage: any | null;
  connectionError: Error | null;
  reconnect: () => void;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

// Default context value for SSR
const defaultContextValue: WebSocketContextType = {
  socket: null,
  isConnected: false,
  sendMessage: () => false,
  lastMessage: null,
  connectionError: null,
  reconnect: () => {},
  isEnabled: false,
  setIsEnabled: () => {},
};

// Create the context with a default value
const WebSocketContext =
  createContext<WebSocketContextType>(defaultContextValue);

// Socket configuration
const SOCKET_URL = "wss://echo.websocket.org"; // Fallback to a test WebSocket server
const RECONNECT_INTERVAL = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

interface WebSocketProviderProps {
  children: ReactNode;
  url?: string;
}

export function WebSocketProvider({
  children,
  url = SOCKET_URL,
}: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [isEnabled, setIsEnabled] = useState(false); // Disabled by default until explicitly enabled

  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false);
  const isClient = typeof window !== "undefined";

  // Function to create a new WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!isClient || !isEnabled) {
      return null;
    }

    try {
      console.log(`Attempting to connect to WebSocket at ${url}`);
      const newSocket = new WebSocket(url);

      newSocket.onopen = () => {
        if (!isMounted.current) return;
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      newSocket.onmessage = (event) => {
        if (!isMounted.current) return;
        try {
          const data =
            typeof event.data === "string"
              ? JSON.parse(event.data)
              : event.data;
          setLastMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setLastMessage(event.data);
        }
      };

      newSocket.onclose = (event) => {
        if (!isMounted.current) return;
        console.log("WebSocket disconnected", event.code, event.reason);
        setIsConnected(false);
        setSocket(null);

        // Attempt to reconnect if the connection was closed unexpectedly
        if (event.code !== 1000 && isEnabled) {
          // 1000 is normal closure
          handleReconnect();
        }
      };

      newSocket.onerror = (error) => {
        if (!isMounted.current) return;
        console.error("WebSocket error:", error);

        // Create a more descriptive error
        const errorMessage =
          "Failed to connect to chat server. Please check your connection and try again.";
        setConnectionError(new Error(errorMessage));
        setIsConnected(false);

        // Close the socket on error to trigger the onclose handler
        try {
          newSocket.close();
        } catch (closeError) {
          console.error("Error closing WebSocket after error:", closeError);
        }
      };

      setSocket(newSocket);
      return newSocket;
    } catch (error) {
      if (!isMounted.current) return null;
      console.error("Failed to create WebSocket:", error);
      setConnectionError(
        error instanceof Error ? error : new Error("Failed to create WebSocket")
      );
      handleReconnect();
      return null;
    }
  }, [url, isEnabled, isClient]);

  // Function to handle reconnection
  const handleReconnect = useCallback(() => {
    if (!isClient || !isEnabled) return;

    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.log("Max reconnection attempts reached");
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      console.log(
        `Attempting to reconnect... (${
          reconnectAttempts.current + 1
        }/${MAX_RECONNECT_ATTEMPTS})`
      );
      reconnectAttempts.current += 1;
      connectWebSocket();
    }, RECONNECT_INTERVAL * Math.pow(1.5, reconnectAttempts.current)); // Exponential backoff
  }, [connectWebSocket, isEnabled, isClient]);

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    if (!isClient || !isEnabled) return;

    if (socket) {
      try {
        socket.close();
      } catch (error) {
        console.error("Error closing socket during reconnect:", error);
      }
    }

    reconnectAttempts.current = 0;
    setSocket(null);
    connectWebSocket();
  }, [socket, connectWebSocket, isEnabled, isClient]);

  // Function to send a message through the WebSocket
  const sendMessage = useCallback(
    (message: any) => {
      if (!isClient) return false;

      if (socket && isConnected) {
        try {
          const messageString =
            typeof message === "string" ? message : JSON.stringify(message);
          socket.send(messageString);
          return true;
        } catch (error) {
          console.error("Error sending message:", error);
          return false;
        }
      }
      return false;
    },
    [socket, isConnected, isClient]
  );

  // Initialize WebSocket connection when enabled changes
  useEffect(() => {
    if (!isClient) return;

    isMounted.current = true;

    if (isEnabled) {
      const newSocket = connectWebSocket();

      // Cleanup function
      return () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        if (newSocket) {
          try {
            newSocket.close();
          } catch (error) {
            console.error("Error closing WebSocket during cleanup:", error);
          }
        }
      };
    }

    return () => {
      isMounted.current = false;
    };
  }, [connectWebSocket, isEnabled, isClient]);

  // Cleanup on unmount
  useEffect(() => {
    if (!isClient) return;

    return () => {
      isMounted.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socket) {
        try {
          socket.close();
        } catch (error) {
          console.error("Error closing WebSocket during unmount:", error);
        }
      }
    };
  }, [socket, isClient]);

  // Context value
  const value = {
    socket,
    isConnected,
    sendMessage,
    lastMessage,
    connectionError,
    reconnect,
    isEnabled,
    setIsEnabled,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Custom hook to use the WebSocket context
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  return context;
}
