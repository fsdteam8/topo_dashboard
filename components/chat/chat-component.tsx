"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Send,
  Search,
  User,
  Paperclip,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebSocketChat } from "@/hooks/use-websocket-chat";
import type React from "react";

// Sample chats data
const initialChatsData = [
  {
    id: "XXXXXX",
    customerName: "Sarah Johnson",
    preview: "Hi, I have a question...",
    timestamp: "10:15 AM",
    unread: true,
  },
  {
    id: "YYYYYY",
    customerName: "Michael Brown",
    preview: "When will my dress be ready?",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "ZZZZZZ",
    customerName: "Emma Wilson",
    preview: "Thanks for your help!",
    timestamp: "Mon",
    unread: false,
  },
];

// Sample messages for the active chat
const initialMessagesData: Record<string, Array<{
  id: number;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
  status: "read" | "sending" | "sent" | "delivered" | "error";
  chatId: string;
}>> = {
  XXXXXX: [
    {
      id: 1,
      sender: "user",
      text: "Hi, Mandy",
      timestamp: "09:41 AM",
      status: "read",
      chatId: "XXXXXX",
    },
    {
      id: 2,
      sender: "user",
      text: "I've tried the app",
      timestamp: "09:41 AM",
      status: "read",
      chatId: "XXXXXX",
    },
    {
      id: 3,
      sender: "admin",
      text: "Really?",
      timestamp: "09:41 AM",
      status: "read",
      chatId: "XXXXXX",
    },
  ],
  YYYYYY: [
    {
      id: 1,
      sender: "user",
      text: "When will my dress be ready for pickup?",
      timestamp: "Yesterday",
      status: "read",
      chatId: "YYYYYY",
    },
  ],
  ZZZZZZ: [
    {
      id: 1,
      sender: "user",
      text: "Thanks for your help with my booking!",
      timestamp: "Mon",
      status: "read",
      chatId: "ZZZZZZ",
    },
  ],
};

// Quick reply options
const quickReplyOptions = [
  "If you have any questions about care or fit, feel free to ask!",
  "Just confirming your booking — the dress will be ready for pickup from [time].",
  "Thanks for booking with me! Let me know what time works best for local pickup.",
];

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    allMessages,
    activeChat,
    setActiveChat,
    isTyping,
    isSending,
    connectionError,
    isConnected,
    sendChatMessage,
    sendTypingIndicator,
    reconnect,
    isWebSocketEnabled,
  } = useWebSocketChat(initialChatsData, initialMessagesData);

  // Get current messages for active chat
  const currentMessages = activeChat ? allMessages[activeChat] || [] : [];

  // Filter chats based on search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a message
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !activeChat) return;

    sendChatMessage(activeChat, message.trim());
    setMessage("");

    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
      sendTypingIndicator(activeChat, false);
    }
  }, [
    message,
    activeChat,
    sendChatMessage,
    sendTypingIndicator,
    typingTimeout,
  ]);

  // Handle quick reply selection
  const handleQuickReply = useCallback(
    (reply: string) => {
      if (!activeChat) return;
      setMessage(reply);
      messageInputRef.current?.focus();
    },
    [activeChat]
  );

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle typing indicator
  const handleTyping = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);

      if (!activeChat) return;

      // Send typing indicator
      if (!typingTimeout) {
        sendTypingIndicator(activeChat, true);
      } else {
        clearTimeout(typingTimeout);
      }

      // Clear typing indicator after 2 seconds of inactivity
      const timeout = setTimeout(() => {
        sendTypingIndicator(activeChat, false);
        setTypingTimeout(null);
      }, 2000);

      setTypingTimeout(timeout);
    },
    [activeChat, sendTypingIndicator, typingTimeout]
  );

  // Focus input when active chat changes
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [activeChat]);

  // Cleanup typing indicator on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold uppercase mb-8">Chats</h2>

      {/* Connection status indicator */}
      {isWebSocketEnabled && !isConnected && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-sm text-amber-700">
              {connectionError
                ? "Connection error. Chat will work in offline mode. You can try reconnecting when online."
                : "Connecting to chat server..."}
            </span>
          </div>
          <button
            onClick={reconnect}
            className="flex items-center text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Reconnect
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Chat search and list */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Message ......"
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33] focus:border-[#891d33]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredChats.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-gray-500">No chats found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex items-start p-4 cursor-pointer rounded-lg transition-colors",
                    activeChat === chat.id
                      ? "bg-[#f8e6ea]"
                      : "bg-white hover:bg-gray-50"
                  )}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#891d33]/10 flex items-center justify-center text-[#891d33] mr-3 flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium truncate">
                        {chat.customerName}
                      </p>
                      <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {chat.timestamp}
                      </p>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">
                      Booking ID: #{chat.id}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 truncate">
                        {chat.preview}
                      </p>
                      {chat.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#891d33] ml-2 flex-shrink-0"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Active conversation */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[700px]">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#891d33]/10 flex items-center justify-center text-[#891d33] mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {chats.find((c) => c.id === activeChat)?.customerName ||
                        "Customer"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Booking ID: #{activeChat}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {isWebSocketEnabled ? (
                    isConnected ? (
                      <span className="inline-flex items-center text-xs text-green-600">
                        <Wifi className="h-3 w-3 mr-1" />
                        Real-time
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-amber-600">
                        <WifiOff className="h-3 w-3 mr-1" />
                        Offline mode
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center text-xs text-gray-600">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Simulation mode
                    </span>
                  )}
                </div>
              </div>

              {/* Messages area */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-6 overflow-y-auto bg-gray-50"
              >
                {currentMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.sender === "admin"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        {msg.sender === "user" && (
                          <div className="max-w-[75%]">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-gray-500">
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        )}

                        {msg.sender === "admin" && (
                          <div className="max-w-[75%]">
                            <div className="bg-[#891d33] text-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <div className="flex items-center justify-end mt-1">
                              <p className="text-xs text-gray-500">
                                {msg.timestamp}
                              </p>
                              <span className="ml-1 text-xs">
                                {msg.status === "sending" && "●"}
                                {msg.status === "sent" && "✓"}
                                {msg.status === "delivered" && "✓✓"}
                                {msg.status === "read" && (
                                  <span className="text-blue-500">✓✓</span>
                                )}
                                {msg.status === "error" && (
                                  <span className="text-red-500">!</span>
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping[activeChat || ""] && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Quick replies */}
              <div className="p-4 border-t bg-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickReplyOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(option)}
                      disabled={isSending}
                      className={cn(
                        "px-3 py-2 text-xs rounded-lg transition-colors",
                        isSending
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Input area */}
                <div className="flex items-center">
                  <div className="flex-1 flex items-center border rounded-l-full overflow-hidden">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={message}
                      onChange={handleTyping}
                      onKeyDown={handleKeyPress}
                      placeholder={
                        isSending ? "Sending..." : "Type your message"
                      }
                      disabled={isSending}
                      className={cn(
                        "flex-1 px-4 py-3 focus:outline-none",
                        isSending ? "bg-gray-50 text-gray-400" : "bg-white"
                      )}
                    />
                    <button
                      className={cn(
                        "p-2 text-gray-500",
                        isSending && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isSending}
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    className={cn(
                      "p-3 bg-white border border-l-0 border-gray-200",
                      isSending && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isSending}
                  >
                    <Mic className="h-5 w-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isSending}
                    className={cn(
                      "p-3 rounded-r-full transition-colors",
                      !message.trim() || isSending
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#891d33] text-white hover:bg-[#691527]"
                    )}
                  >
                    {isSending ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-16 h-16 rounded-full bg-[#891d33]/10 flex items-center justify-center text-[#891d33] mb-4">
                <User className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium mb-2">
                No conversation selected
              </p>
              <p className="text-sm">
                Select a chat from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
