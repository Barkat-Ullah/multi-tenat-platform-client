"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppSelector } from "@/redux/store";
import { toast } from "sonner";

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
  isEdited?: boolean;
  isDeleted?: boolean;
  editedAt?: string;
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
  roomId?: string;
  userId?: string;
  user?: ConversationUser;
  receiverId?: string;
  receiver?: ConversationUser;
  senderId?: string;
  sender?: ConversationUser;
  lastMessage?: string | ChatMessage;
  lastMessageAt?: string;
  unreadCount?: number;
  updatedAt?: string;
}

function getConversationKey(c: ConversationItem): string {
  return (
    (c as any).roomId ||
    c.id ||
    c.userId ||
    c.receiverId ||
    c.senderId ||
    JSON.stringify(c)
  );
}

// Merge a freshly-paged conversation list with what is already loaded.
// - Append mode (infinite scroll): just dedupe-append the older page.
// - Refresh mode (initial load / 15s poll / focus): the server returns the
//   newest page; keep it first and retain any older conversations we have
//   already loaded so paginated data survives the periodic refresh.
function mergeConversations(
  prev: ConversationItem[],
  incoming: ConversationItem[],
  isAppend: boolean
): ConversationItem[] {
  if (isAppend) {
    const seen = new Set(prev.map(getConversationKey));
    const merged = [...prev];
    for (const c of incoming) {
      const k = getConversationKey(c);
      if (!seen.has(k)) {
        merged.push(c);
        seen.add(k);
      }
    }
    return merged;
  }

  const seen = new Set(incoming.map(getConversationKey));
  const older = prev.filter((c) => !seen.has(getConversationKey(c)));
  return [...incoming, ...older];
}

export interface UseWebSocketChatReturn {
  isConnected: boolean;
  isLoadingConversations: boolean;
  isLoadingChats: boolean;
  isLoadingOlderChats: boolean;
  chatHasMore: boolean;
  conversations: ConversationItem[];
  currentMessages: ChatMessage[];
  onlineUsers: any;
  selectedReceiverId: string | null;
  setSelectedReceiverId: (id: string | null) => void;
  sendMessage: (payload: { receiverId: string; message: string; fileUrl?: string; fileName?: string }) => void;
  editMessage: (payload: { messageId: string; message: string; original?: ChatMessage }) => void;
  deleteMessage: (payload: { messageId: string; original?: ChatMessage }) => void;
  fetchChats: (receiverId: string) => void;
  loadOlderChats: (receiverId: string) => void;
  fetchMessageList: () => void;
  fetchMoreConversations: () => void;
  hasMoreConversations: boolean;
  isLoadingMoreConversations: boolean;
  fetchOnlineUsers: () => void;
  fetchUnreadMessages: (receiverId: string) => void;
}

export function useWebSocketChat(): UseWebSocketChatReturn {
  const tokenFromRedux = useAppSelector((state) => state.auth?.accessToken);
  const currentUser = useAppSelector((state) => state.auth?.user);

  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingOlderChats, setIsLoadingOlderChats] = useState(false);
  const [chatHasMore, setChatHasMore] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedReceiverIdRef = useRef<string | null>(selectedReceiverId);
  selectedReceiverIdRef.current = selectedReceiverId;

  // Snapshots for optimistic edit/delete so an `error` event (which carries no
  // message id) can revert the last pending action back to its original text.
  const editPendingRef = useRef<{ messageId: string; original: ChatMessage | null } | null>(null);
  const deletePendingRef = useRef<{ messageId: string; original: ChatMessage | null } | null>(null);

  // Per-room chat pagination: source of truth is chatPaginationRef; the
  // selected room's hasMore is mirrored to state for the UI.
  const chatPaginationRef = useRef<Record<string, { hasMore: boolean; nextCursor: string | null }>>({});
  const chatRequestModeRef = useRef<Record<string, "initial" | "older">>({});
  const isLoadingOlderChatsRef = useRef(false);

  // Conversation sidebar pagination.
  const conversationPaginationRef = useRef<{ hasMore: boolean; nextCursor: string | null }>({
    hasMore: false,
    nextCursor: null,
  });
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [isLoadingMoreConversations, setIsLoadingMoreConversations] = useState(false);
  const isLoadingMoreConversationsRef = useRef(false);
  // Tracks an in-flight messageList request so the response handler knows
  // whether it was a refresh (null) or an append for older pages (cursor).
  const messageListRequestCursorRef = useRef<string | null | undefined>(undefined);

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
    chatRequestModeRef.current[receiverId] = "initial";
    sendEvent({
      event: "fetchChats",
      receiverId,
      limit: 50,
    });
  }, [sendEvent]);

  const loadOlderChats = useCallback(
    (receiverId: string) => {
      const pagination = chatPaginationRef.current[receiverId];
      if (!receiverId || !pagination?.hasMore || !pagination.nextCursor) return;
      if (isLoadingOlderChatsRef.current) return;
      isLoadingOlderChatsRef.current = true;
      setIsLoadingOlderChats(true);
      chatRequestModeRef.current[receiverId] = "older";
      sendEvent({
        event: "fetchChats",
        receiverId,
        cursor: pagination.nextCursor,
        limit: 50,
      });
    },
    [sendEvent]
  );

  const fetchMessageList = useCallback(() => {
    // Don't let a periodic refresh race an in-flight append request; the
    // refresh would overwrite the request-mode ref and confuse the handler.
    if (isLoadingMoreConversationsRef.current) return;
    messageListRequestCursorRef.current = null;
    sendEvent({
      event: "messageList",
    });
  }, [sendEvent]);

  const fetchMoreConversations = useCallback(() => {
    const { hasMore, nextCursor } = conversationPaginationRef.current;
    if (!hasMore || !nextCursor) return;
    if (isLoadingMoreConversationsRef.current) return;
    isLoadingMoreConversationsRef.current = true;
    setIsLoadingMoreConversations(true);
    messageListRequestCursorRef.current = nextCursor;
    sendEvent({
      event: "messageList",
      cursor: nextCursor,
      limit: 50,
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

  const editMessage = useCallback(
    ({ messageId, message, original }: { messageId: string; message: string; original?: ChatMessage }) => {
      sendEvent({
        event: "editMessage",
        messageId,
        message,
      });

      // Snapshot the original so an error response can revert the bubble.
      if (original) {
        editPendingRef.current = { messageId, original };
      }

      // Optimistically update message in local state
      setMessagesMap((prev) => {
        const updated: Record<string, ChatMessage[]> = {};
        for (const [key, list] of Object.entries(prev)) {
          updated[key] = list.map((m) =>
            m.id === messageId || (m as any)._id === messageId
              ? {
                  ...m,
                  message,
                  isEdited: true,
                  editedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : m
          );
        }
        return updated;
      });

      // Keep the sidebar "last message" preview in sync if this is the
      // room's latest message.
      setConversations((prev) =>
        prev.map((c) => {
          const lastMsgId = (c.lastMessage as any)?.id || (c.lastMessage as any)?._id;
          if (lastMsgId && String(lastMsgId) === String(messageId)) {
            const existing =
              c.lastMessage && typeof c.lastMessage === "object" ? (c.lastMessage as any) : {};
            return {
              ...c,
              lastMessage: { ...existing, id: lastMsgId, message, isEdited: true },
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    },
    [sendEvent]
  );

  const deleteMessage = useCallback(
    ({ messageId, original }: { messageId: string; original?: ChatMessage }) => {
      sendEvent({
        event: "deleteMessage",
        messageId,
      });

      // Snapshot the original so an error response can restore the bubble.
      if (original) {
        deletePendingRef.current = { messageId, original };
      }

      // Optimistically soft-delete: keep the record but clear its content.
      setMessagesMap((prev) => {
        const updated: Record<string, ChatMessage[]> = {};
        for (const [key, list] of Object.entries(prev)) {
          updated[key] = list.map((m) =>
            m.id === messageId || (m as any)._id === messageId
              ? { ...m, isDeleted: true, message: "", fileUrl: undefined, fileName: undefined }
              : m
          );
        }
        return updated;
      });

      // Keep the sidebar "last message" preview in sync if this is the
      // room's latest message.
      setConversations((prev) =>
        prev.map((c) => {
          const lastMsgId = (c.lastMessage as any)?.id || (c.lastMessage as any)?._id;
          if (lastMsgId && String(lastMsgId) === String(messageId)) {
            const existing =
              c.lastMessage && typeof c.lastMessage === "object" ? (c.lastMessage as any) : {};
            return {
              ...c,
              lastMessage: { ...existing, id: lastMsgId, message: "", isDeleted: true },
            };
          }
          return c;
        })
      );
    },
    [sendEvent]
  );

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
          fetchMessageList();
          socket.send(JSON.stringify({ event: "onlineUsers" }));
        }
      }, 200);

      // 3. Keep-alive ping and periodic messageList & onlineUsers refresh interval
      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ event: "ping" }));
          fetchMessageList();
          socket.send(JSON.stringify({ event: "onlineUsers" }));
        }
      }, 15000);
    };

    const handleFocus = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        fetchMessageList();
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
            (Array.isArray(data.data) ? data.data : []);
          const isAppend = typeof messageListRequestCursorRef.current === "string";

          setConversations((prev) =>
            mergeConversations(prev, Array.isArray(list) ? list : [], isAppend)
          );

          // Only advance pagination state on append requests; refresh
          // responses keep the existing hasMore/nextCursor so loaded older
          // pages are never dropped by the periodic poll.
          if (isAppend) {
            conversationPaginationRef.current = {
              hasMore: Boolean(data.data?.hasMore),
              nextCursor: data.data?.nextCursor || null,
            };
            setHasMoreConversations(Boolean(data.data?.hasMore));
          }

          setIsLoadingMoreConversations(false);
          isLoadingMoreConversationsRef.current = false;
          setIsLoadingConversations(false);
          messageListRequestCursorRef.current = undefined;
        } else if (eventType === "fetchChats" || eventType === "chatHistory" || data.chats || data.messages) {
          const dataObj = data.data && typeof data.data === "object" && !Array.isArray(data.data) ? data.data : data;
          const chatList =
            dataObj.messages ||
            dataObj.chats ||
            data.messages ||
            data.chats ||
            (Array.isArray(data.data) ? data.data : []);
          const receiverId = data.receiverId || selectedReceiverIdRef.current;
          if (receiverId && Array.isArray(chatList)) {
            const mode = chatRequestModeRef.current[receiverId] || "initial";
            if (mode === "older") {
              // Prepend the older page, deduping by message id in case the
              // server's strict "< cursor" filter ever overlaps.
              setMessagesMap((prev) => {
                const existing = prev[receiverId] || [];
                const seen = new Set(
                  existing
                    .map((m) => m.id || (m as any)._id)
                    .filter(Boolean) as string[]
                );
                const fresh = chatList.filter((m: any) => !seen.has(m.id || (m as any)._id));
                return { ...prev, [receiverId]: [...fresh, ...existing] };
              });
            } else {
              setMessagesMap((prev) => ({
                ...prev,
                [receiverId]: chatList,
              }));
            }

            chatPaginationRef.current[receiverId] = {
              hasMore: Boolean(dataObj.hasMore),
              nextCursor: dataObj.nextCursor || null,
            };
            if (receiverId === selectedReceiverIdRef.current) {
              setChatHasMore(Boolean(dataObj.hasMore));
            }
          }
          chatRequestModeRef.current[receiverId || ""] = "initial";
          isLoadingOlderChatsRef.current = false;
          setIsLoadingOlderChats(false);
          setIsLoadingChats(false);
        } else if (
          eventType === "editMessage" ||
          eventType === "messageEdited" ||
          data.event === "editMessage" ||
          data.editedMessage ||
          data.action === "editMessage"
        ) {
          const editedData = data.data && typeof data.data === "object" && !Array.isArray(data.data) ? data.data : data;
          const targetId =
            editedData.id ||
            editedData._id ||
            editedData.messageId ||
            data.messageId ||
            data.id ||
            data._id;
          let newMsg = editedData.message || editedData.text || data.message || data.updatedMessage;
          if (typeof newMsg === "object" && newMsg !== null) {
            newMsg = newMsg.message || newMsg.text || newMsg.content || "";
          }
          const editedAt = editedData.editedAt || null;

          if (targetId) {
            setMessagesMap((prev) => {
              const updated: Record<string, ChatMessage[]> = {};
              for (const [key, list] of Object.entries(prev)) {
                updated[key] = list.map((m) => {
                  const mId = m.id || (m as any)._id;
                  if (mId && (mId === targetId || mId.toString() === targetId.toString())) {
                    return {
                      ...m,
                      message: newMsg || m.message,
                      isEdited: true,
                      editedAt: editedAt || m.editedAt || new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                  }
                  return m;
                });
              }
              return updated;
            });

            // Clear the pending-edit snapshot once the server confirms.
            if (editPendingRef.current && String(editPendingRef.current.messageId) === String(targetId)) {
              editPendingRef.current = null;
            }

            setConversations((prev) =>
              prev.map((c) => {
                const lastMsgId = (c.lastMessage as any)?.id || (c.lastMessage as any)?._id;
                if (lastMsgId && (lastMsgId === targetId || lastMsgId.toString() === targetId.toString())) {
                  const existing =
                    c.lastMessage && typeof c.lastMessage === "object" ? (c.lastMessage as any) : {};
                  return {
                    ...c,
                    lastMessage: {
                      ...existing,
                      id: lastMsgId,
                      message: newMsg || "",
                      isEdited: true,
                      editedAt: editedAt || undefined,
                    },
                    updatedAt: new Date().toISOString(),
                  };
                }
                return c;
              })
            );
          }
        } else if (
          eventType === "deleteMessage" ||
          eventType === "messageDeleted" ||
          data.event === "deleteMessage" ||
          data.deletedMessage ||
          data.action === "deleteMessage"
        ) {
          const deletedData = data.data && typeof data.data === "object" && !Array.isArray(data.data) ? data.data : data;
          const targetId = deletedData.messageId || data.messageId || deletedData.id || data.id || data._id;
          if (targetId) {
            // Soft delete: mark the message and clear its content instead of
            // removing it, so the layout doesn't jump.
            setMessagesMap((prev) => {
              const updated: Record<string, ChatMessage[]> = {};
              for (const [key, list] of Object.entries(prev)) {
                updated[key] = list.map((m) => {
                  const mId = m.id || (m as any)._id;
                  if (mId && (mId === targetId || mId.toString() === targetId.toString())) {
                    return { ...m, isDeleted: true, message: "", fileUrl: undefined, fileName: undefined };
                  }
                  return m;
                });
              }
              return updated;
            });

            // Clear the pending-unsend snapshot once the server confirms.
            if (deletePendingRef.current && String(deletePendingRef.current.messageId) === String(targetId)) {
              deletePendingRef.current = null;
            }

            // Sync the sidebar "last message" preview if the deleted message
            // is the room's latest one.
            const roomId = deletedData.roomId || data.data?.roomId || data.roomId;
            setConversations((prev) =>
              prev.map((c) => {
                const lastMsgId = (c.lastMessage as any)?.id || (c.lastMessage as any)?._id;
                const matchesRoom = roomId && c.roomId && String(c.roomId) === String(roomId);
                if (matchesRoom || (lastMsgId && String(lastMsgId) === String(targetId))) {
                  const existing =
                    c.lastMessage && typeof c.lastMessage === "object" ? (c.lastMessage as any) : {};
                  return {
                    ...c,
                    lastMessage: { ...existing, id: lastMsgId || targetId, message: "", isDeleted: true },
                  };
                }
                return c;
              })
            );
          }
        } else if (
          eventType === "message" ||
          eventType === "newMessage" ||
          data.messageObj ||
          (data.message && typeof data.message === "object") ||
          data.data?.messageObj
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

            // Keep the sidebar conversation's last message in sync and move it
            // to the top (most recently active first).
            setConversations((prev) => {
              const idx = prev.findIndex(
                (c) =>
                  c.userId === otherUserId ||
                  c.receiverId === otherUserId ||
                  c.senderId === otherUserId ||
                  c.user?.id === otherUserId ||
                  c.receiver?.id === otherUserId ||
                  c.sender?.id === otherUserId
              );
              if (idx === -1) return prev;
              const conv = {
                ...prev[idx],
                lastMessage: msgObj,
                updatedAt: new Date().toISOString(),
              };
              const next = [...prev];
              next.splice(idx, 1);
              next.unshift(conv);
              return next;
            });
          }
        } else if (eventType === "error" || data.error) {
          const errMsg =
            data.data?.message ||
            data.message ||
            (typeof data.error === "string" ? data.error : data.error?.message) ||
            "Something went wrong";
          toast.error(errMsg);

          // Revert the last optimistic edit/unsend back to its original
          // content — the error event carries no message id.
          const revertPending = (pending: { messageId: string; original: ChatMessage | null } | null) => {
            if (!pending) return;
            const { messageId, original } = pending;
            if (original) {
              setMessagesMap((prev) => {
                const updated: Record<string, ChatMessage[]> = {};
                for (const [key, list] of Object.entries(prev)) {
                  updated[key] = list.map((m) => {
                    const mId = m.id || (m as any)._id;
                    if (mId && String(mId) === String(messageId)) return { ...m, ...original };
                    return m;
                  });
                }
                return updated;
              });

              setConversations((prev) =>
                prev.map((c) => {
                  const lastMsgId = (c.lastMessage as any)?.id || (c.lastMessage as any)?._id;
                  if (lastMsgId && String(lastMsgId) === String(messageId)) {
                    return { ...c, lastMessage: original, updatedAt: original.updatedAt || c.updatedAt };
                  }
                  return c;
                })
              );
            }
          };
          if (editPendingRef.current) {
            revertPending(editPendingRef.current);
            editPendingRef.current = null;
          }
          if (deletePendingRef.current) {
            revertPending(deletePendingRef.current);
            deletePendingRef.current = null;
          }
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
      setChatHasMore(false);
      fetchChats(selectedReceiverId);
    }
  }, [selectedReceiverId, fetchChats]);

  const currentMessages = selectedReceiverId ? messagesMap[selectedReceiverId] || [] : [];

  return {
    isConnected,
    isLoadingConversations,
    isLoadingChats,
    isLoadingOlderChats,
    chatHasMore,
    conversations,
    currentMessages,
    onlineUsers,
    selectedReceiverId,
    setSelectedReceiverId,
    sendMessage,
    editMessage,
    deleteMessage,
    fetchChats,
    loadOlderChats,
    fetchMessageList,
    fetchMoreConversations,
    hasMoreConversations,
    isLoadingMoreConversations,
    fetchOnlineUsers,
    fetchUnreadMessages,
  };
}
