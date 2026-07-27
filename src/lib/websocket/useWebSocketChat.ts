"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppSelector } from "@/redux/store";

export interface ChatMessage {
  id?: string;
  _id?: string;
  senderId?: string;
  receiverId?: string;
  message?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt?: string;
  updatedAt?: string;
  sender?: {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
  receiver?: {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

export interface ConversationUser {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

export interface ConversationItem {
  id?: string;
  userId?: string;
  user?: ConversationUser;
  receiverId?: string;
  receiver?: ConversationUser;
  senderId?: string;
  sender?: ConversationUser;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  updatedAt?: string;
}

export interface UseWebSocketChatReturn {
  isConnected: boolean;
  isLoadingConversations: boolean;
  isLoadingChats: boolean;
  conversations: ConversationItem[];
  currentMessages: ChatMessage[];
  onlineUsers: any;
  selectedReceiverId: string | null;
  setSelectedReceiverId: (id: string | null) => void;
  sendMessage: (payload: { receiverId: string; message: string; fileUrl?: string; fileName?: string }) => void;
  fetchChats: (receiverId: string) => void;
  fetchMessageList: () => void;
  fetchOnlineUsers: () => void;
  fetchUnreadMessages: (receiverId: string) => void;
}

export function useWebSocketChat(): UseWebSocketChatReturn {
  const tokenFromRedux = useAppSelector((state) => state.auth?.accessToken);
  const currentUser = useAppSelector((state) => state.auth?.user);

  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedReceiverIdRef = useRef<string | null>(selectedReceiverId);
  selectedReceiverIdRef.current = selectedReceiverId;

  // Retrieve token from Redux or Cookies fallback
  const getAuthToken = useCallback(() => {
    if (tokenFromRedux) return tokenFromRedux;
    if (typeof window !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
      if (match) return match[2];
    }
    return null;
  }, [tokenFromRedux]);

  const sendEvent = useCallback((eventObj: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(eventObj));
    }
  }, []);

  const fetchChats = useCallback((receiverId: string) => {
    setIsLoadingChats(true);
    sendEvent({
      event: "fetchChats",
      receiverId,
    });
  }, [sendEvent]);

  const fetchMessageList = useCallback(() => {
    sendEvent({
      event: "messageList",
    });
  }, [sendEvent]);

  const fetchOnlineUsers = useCallback(() => {
    sendEvent({
      event: "onlineUsers",
    });
  }, [sendEvent]);

  const fetchUnreadMessages = useCallback((receiverId: string) => {
    sendEvent({
      event: "unReadMessages",
      receiverId,
    });
  }, [sendEvent]);

  const sendMessage = useCallback(({ receiverId, message, fileUrl, fileName }: {
    receiverId: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
  }) => {
    const payload: Record<string, any> = {
      event: "message",
      receiverId,
      message,
    };
    if (fileUrl) payload.fileUrl = fileUrl;
    if (fileName) payload.fileName = fileName;

    sendEvent(payload);

    // Optimistically add message to current chat view if sending to selected user
    const tempMsg: ChatMessage = {
      id: "temp-" + Date.now(),
      senderId: currentUser?.id,
      receiverId,
      message,
      fileUrl,
      fileName,
      createdAt: new Date().toISOString(),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), tempMsg],
    }));

    // Update conversation sidebar last message
    setConversations((prev) => {
      const index = prev.findIndex(
        (c) => c.userId === receiverId || c.receiverId === receiverId || c.user?.id === receiverId || c.receiver?.id === receiverId
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          lastMessage: message || (fileName ? `[File] ${fileName}` : ""),
          lastMessageAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }
      return prev;
    });
  }, [sendEvent, currentUser?.id]);

  useEffect(() => {
    const token = getAuthToken();
    let wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://multitinent.barkatullah.dev";
    if (typeof window !== "undefined" && window.location.protocol === "https:" && wsUrl.startsWith("ws://")) {
      wsUrl = wsUrl.replace("ws://", "wss://");
    }

    if (!token) {
      return;
    }

    let socket: WebSocket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;
    } catch {
      setIsConnected(false);
      return;
    }

    socket.onopen = () => {
      setIsConnected(true);

      // 1. Authenticate token
      socket.send(
        JSON.stringify({
          event: "authenticate",
          token: token.startsWith("Bearer ") ? token.split(" ")[1] : token,
        })
      );

      // 2. Initial Data Request (after small delay to allow token registration)
      setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ event: "messageList" }));
          socket.send(JSON.stringify({ event: "onlineUsers" }));
        }
      }, 200);

      // 3. Keep-alive ping and periodic messageList & onlineUsers refresh interval
      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ event: "ping" }));
          socket.send(JSON.stringify({ event: "messageList" }));
          socket.send(JSON.stringify({ event: "onlineUsers" }));
        }
      }, 15000);
    };

    const handleFocus = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ event: "messageList" }));
        wsRef.current.send(JSON.stringify({ event: "onlineUsers" }));
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleFocus);
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle various backend event formats
        const eventType = data.event || data.type || data.action;

        if (
          eventType === "messageList" ||
          eventType === "conversations" ||
          data.conversations ||
          data.messageList ||
          Array.isArray(data.data?.conversations) ||
          Array.isArray(data.data?.messageList)
        ) {
          const list =
            data.data?.conversations ||
            data.data?.messageList ||
            data.conversations ||
            data.messageList ||
            data.data ||
            (Array.isArray(data) ? data : []);
          setConversations(Array.isArray(list) ? list : []);
          setIsLoadingConversations(false);
        } else if (eventType === "fetchChats" || eventType === "chatHistory" || data.chats || data.messages) {
          const chatList = data.data?.chats || data.chats || data.messages || data.data || [];
          const receiverId = data.receiverId || selectedReceiverIdRef.current;
          if (receiverId && Array.isArray(chatList)) {
            setMessagesMap((prev) => ({
              ...prev,
              [receiverId]: chatList,
            }));
          }
          setIsLoadingChats(false);
        } else if (
          eventType === "message" ||
          eventType === "newMessage" ||
          data.messageObj ||
          data.message ||
          data.data?.message
        ) {
          const msgObj: any = data.data || data.messageObj || data;
          
          const getMsgSenderId = (m: any): string | undefined => {
            if (!m) return undefined;
            if (typeof m.senderId === "string") return m.senderId;
            if (typeof m.sender === "string") return m.sender;
            if (m.sender && typeof m.sender === "object") return m.sender.id || m.sender._id;
            if (typeof m.userId === "string") return m.userId;
            if (m.user && typeof m.user === "object") return m.user.id || m.user._id;
            return undefined;
          };

          const getMsgReceiverId = (m: any): string | undefined => {
            if (!m) return undefined;
            if (typeof m.receiverId === "string") return m.receiverId;
            if (typeof m.receiver === "string") return m.receiver;
            if (m.receiver && typeof m.receiver === "object") return m.receiver.id || m.receiver._id;
            return undefined;
          };

          const sId = getMsgSenderId(msgObj);
          const rId = getMsgReceiverId(msgObj);
          const currentUserId = currentUser?.id || (currentUser as any)?._id;
          const otherUserId = sId === currentUserId ? rId : sId;

          if (otherUserId) {
            setMessagesMap((prev) => {
              const existing = prev[otherUserId] || [];
              const exists = existing.some((m) => m.id && msgObj.id && m.id === msgObj.id);
              if (exists) return prev;

              // If an optimistic temp message exists, replace it cleanly with official server message
              const tempIndex = existing.findIndex((m) => m.id && typeof m.id === "string" && m.id.startsWith("temp-"));
              if (tempIndex !== -1) {
                const updated = [...existing];
                updated[tempIndex] = msgObj;
                return {
                  ...prev,
                  [otherUserId]: updated,
                };
              }

              return {
                ...prev,
                [otherUserId]: [...existing, msgObj],
              };
            });
          }

          // Refresh sidebar conversation list
          fetchMessageList();
        } else if (eventType === "onlineUsers" || data.onlineUsers || data.users) {
          const users = data.onlineUsers || data.data?.onlineUsers || data.data || data.users;
          setOnlineUsers(users || []);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };

    socket.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleFocus);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [getAuthToken, fetchMessageList, currentUser?.id]);

  // When selected receiver changes, fetch chats if not loaded
  useEffect(() => {
    if (selectedReceiverId) {
      fetchChats(selectedReceiverId);
    }
  }, [selectedReceiverId, fetchChats]);

  const currentMessages = selectedReceiverId ? messagesMap[selectedReceiverId] || [] : [];

  return {
    isConnected,
    isLoadingConversations,
    isLoadingChats,
    conversations,
    currentMessages,
    onlineUsers,
    selectedReceiverId,
    setSelectedReceiverId,
    sendMessage,
    fetchChats,
    fetchMessageList,
    fetchOnlineUsers,
    fetchUnreadMessages,
  };
}
