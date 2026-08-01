"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWebSocketChat, ConversationItem, ConversationUser, ChatMessage } from "@/lib/websocket/useWebSocketChat";
import { useGetAllUsersQuery, User as APIUser } from "@/redux/service/admin/userApi";
import { useAppSelector } from "@/redux/store";
import { toast } from "sonner";
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  UserPlus,
  X,
  FileText,
  CheckCheck,
  Wifi,
  WifiOff,
  User as UserIcon,
  Pencil,
  MoreVertical,
  Check,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface MessagingViewProps {
  role?: string;
}

function formatMessageContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    if (content.isDeleted) return "This message was unsent";
    if (typeof content.message === "string") return content.message;
    if (typeof content.text === "string") return content.text;
    if (typeof content.content === "string") return content.content;
    if (content.fileName) return `[File] ${content.fileName}`;
    if (content.fileUrl) return "[File Attachment]";
  }
  return "";
}

// Single source of truth for "should this bubble render as unsent". Deleted
// messages can enter state in two ways: via the live messageDeleted event
// (isDeleted: true) or via fetchChats history, where some backend versions
// send isDeleted: true but older ones just clear the content (message: '',
// fileUrl: null, fileName: null). Treat a content-less message as deleted too,
// so a cleared message never renders as an empty bubble.
function isDeletedMessage(msg: any): boolean {
  if (!msg || typeof msg !== "object") return false;
  if (msg.isDeleted === true) return true;
  const hasText =
    (typeof msg.message === "string" && msg.message.trim() !== "") ||
    (typeof msg.text === "string" && msg.text.trim() !== "") ||
    (typeof msg.content === "string" && msg.content.trim() !== "");
  return !hasText && !msg.fileUrl && !msg.fileName;
}

// Sidebar "last message" preview: handles unsent placeholders and shows a
// muted "(edited)" marker when the last message was edited.
function formatSidebarPreview(content: any): string {
  const text = formatMessageContent(content);
  if (isDeletedMessage(content)) return "This message was unsent";
  if (!text) return "Click to open conversation";
  const isEdited = Boolean(
    content && typeof content === "object" && content.isEdited && !content.isDeleted
  );
  return isEdited ? `${text} (edited)` : text;
}

function getDisplayName(userObj: any): string {
  if (!userObj) return "User";
  if (typeof userObj === "string") return userObj;
  return userObj.fullName || userObj.name || userObj.email || "User";
}

function getRoleBadgeStyle(role?: string): string {
  if (!role) return "bg-gray-100 text-gray-600 border-gray-200";
  const r = role.toUpperCase();
  if (r.includes("ADMIN")) return "bg-purple-50 text-purple-700 border-purple-200/80";
  if (r.includes("DRIVER")) return "bg-amber-50 text-amber-700 border-amber-200/80";
  if (r.includes("CLINIC")) return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  if (r.includes("ORGANIZER")) return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
  return "bg-blue-50 text-blue-700 border-blue-200/80";
}

function getOtherUser(conv: ConversationItem, currentUserId?: string): ConversationUser | undefined {
  if (!conv) return undefined;
  if (conv.user && conv.user.id && conv.user.id !== currentUserId) return conv.user;
  if (conv.sender && conv.sender.id && conv.sender.id !== currentUserId) return conv.sender;
  if (conv.receiver && conv.receiver.id && conv.receiver.id !== currentUserId) return conv.receiver;
  return conv.user || conv.sender || conv.receiver;
}

function checkIsOnline(targetUser: any, targetId: string | null, onlineList: any): boolean {
  if (!onlineList || (!targetId && !targetUser)) return false;

  const idToMatch = targetId ? targetId.toLowerCase() : "";
  const userIdAttr = targetUser?.id ? targetUser.id.toLowerCase() : "";
  const userUnderscoreId = targetUser?._id ? targetUser._id.toLowerCase() : "";
  const userEmail = targetUser?.email ? targetUser.email.toLowerCase() : "";

  if (!Array.isArray(onlineList) && typeof onlineList === "object") {
    const keys = Object.keys(onlineList).map((k) => k.toLowerCase());
    return Boolean(
      (idToMatch && keys.includes(idToMatch)) ||
      (userIdAttr && keys.includes(userIdAttr)) ||
      (userUnderscoreId && keys.includes(userUnderscoreId)) ||
      (userEmail && keys.includes(userEmail))
    );
  }

  if (Array.isArray(onlineList)) {
    return onlineList.some((item: any) => {
      if (!item) return false;
      if (typeof item === "string") {
        const lowerItem = item.toLowerCase();
        return Boolean(
          (idToMatch && lowerItem === idToMatch) ||
          (userIdAttr && lowerItem === userIdAttr) ||
          (userUnderscoreId && lowerItem === userUnderscoreId) ||
          (userEmail && lowerItem === userEmail)
        );
      }
      if (typeof item === "object") {
        const itemId = (item.id || item._id || item.userId || item.email || "").toString().toLowerCase();
        return Boolean(
          (idToMatch && itemId === idToMatch) ||
          (userIdAttr && itemId === userIdAttr) ||
          (userUnderscoreId && itemId === userUnderscoreId) ||
          (userEmail && itemId === userEmail)
        );
      }
      return false;
    });
  }

  return false;
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const isImageFile = (url?: string, name?: string): boolean => {
  if (!url && !name) return false;
  if (url?.startsWith("data:image/")) return true;
  const matchStr = (name || url || "").toLowerCase();
  return (
    matchStr.endsWith(".png") ||
    matchStr.endsWith(".jpg") ||
    matchStr.endsWith(".jpeg") ||
    matchStr.endsWith(".gif") ||
    matchStr.endsWith(".webp") ||
    matchStr.endsWith(".svg")
  );
};

export default function MessagingView({ role }: MessagingViewProps) {
  const currentUser = useAppSelector((state) => state.auth?.user);
  const userRole = role || currentUser?.role || "USER";
  const isAdminOrSuperAdmin =
    userRole.toUpperCase() === "ADMIN" ||
    userRole.toUpperCase() === "SUPERADMIN" ||
    userRole.toUpperCase() === "SUPER_ADMIN";

  const {
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
    loadOlderChats,
    fetchMoreConversations,
    hasMoreConversations,
    isLoadingMoreConversations,
  } = useWebSocketChat();

  // Hydration & Mount state to prevent browser extension mismatch (e.g. Bitwarden bis_skin_checked)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Search, Filter & Editing states
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  // Which message's "⋮" menu is currently open (matches BookingsTable pattern).
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  // Message id awaiting an inline "Unsend?" confirmation.
  const [confirmUnsendId, setConfirmUnsendId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [openMenuId]);

  // New Chat Modal state (Admin/Super Admin only)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Fetch users for Admin "New Chat" modal
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery(
    { page: 1, limit: 100, search: userSearchTerm },
    { skip: !isModalOpen || !isAdminOrSuperAdmin }
  );

  const messageStreamRef = useRef<HTMLDivElement | null>(null);
  const conversationListRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll handling for the message stream. We must distinguish:
  //  - older messages prepended (preserve scroll offset, don't jump to bottom)
  //  - a room opened / initial history loaded (anchor to the bottom — even when
  //    the refetch returns the same number of messages, which previously left
  //    the view stranded mid-list)
  //  - a new message appended at the bottom (smooth scroll down)
  //  - nothing actually changed (leave scroll alone)
  const prevMessagesLengthRef = useRef(0);
  const prevReceiverRef = useRef<string | null>(null);
  const prevIsLoadingChatsRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const isAppendingOlderRef = useRef(false);
  // While true, any growth of the stream (images, lazy content, the skeleton →
  // real-list swap) re-pins the view to the bottom. Cleared the moment the user
  // scrolls up, and only re-armed when a conversation is (re)opened.
  const anchorToBottomRef = useRef(false);

  useEffect(() => {
    const len = currentMessages.length;
    const roomChanged = selectedReceiverId !== prevReceiverRef.current;
    const justFinishedInitialLoad =
      !isLoadingChats && prevIsLoadingChatsRef.current === true;
    prevIsLoadingChatsRef.current = isLoadingChats;
    const el = messageStreamRef.current;

    if (isAppendingOlderRef.current && len > prevMessagesLengthRef.current) {
      if (el) {
        el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
      }
      isAppendingOlderRef.current = false;
    } else if (roomChanged || justFinishedInitialLoad) {
      // Opening a conversation: anchor to the bottom. The ResizeObserver below
      // keeps us pinned as the real list renders taller than the loading
      // skeleton, so we land exactly at the newest message instead of mid-list.
      anchorToBottomRef.current = true;
      if (el) el.scrollTop = el.scrollHeight;
    } else if (len > prevMessagesLengthRef.current) {
      // New message appended while the user is (near) the bottom: glide down.
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }

    prevMessagesLengthRef.current = len;
    prevReceiverRef.current = selectedReceiverId;
  }, [currentMessages, selectedReceiverId, isLoadingChats]);

  // While anchored (a conversation was just opened), re-pin to the bottom
  // whenever the stream grows. Images and lazy content load after the effect
  // above runs, so a single scroll assignment leaves the view stranded mid-list.
  useEffect(() => {
    const el = messageStreamRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (anchorToBottomRef.current) {
        el.scrollTop = el.scrollHeight;
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // When the user scrolls to the top of the message stream and more history
  // exists, request the next (older) page and prepend it.
  const handleMessageStreamScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // The user has taken manual control of the scroll: stop auto-anchoring so
    // the stream doesn't yank them back down while they read older messages.
    if (el.scrollHeight - el.scrollTop - el.clientHeight > 120) {
      anchorToBottomRef.current = false;
    }
    if (!selectedReceiverId || el.scrollTop > 40) return;
    if (!chatHasMore || isLoadingOlderChats) return;

    prevScrollHeightRef.current = el.scrollHeight;
    isAppendingOlderRef.current = true;
    loadOlderChats(selectedReceiverId);
  };

  // Infinite scroll for the conversation sidebar: when the user scrolls to
  // the bottom and more older conversations exist, request the next page.
  // Disabled while searching, since appended pages wouldn't match the filter.
  const handleConversationListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (searchQuery) return;
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (!nearBottom || !hasMoreConversations || isLoadingMoreConversations) return;
    fetchMoreConversations();
  };

  // Edit & Delete handlers
  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setMessageInput(formatMessageContent(msg.message));
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessageInput("");
  };

  const handleConfirmUnsend = (msg: ChatMessage) => {
    const messageId = msg.id || (msg as any)._id;
    if (!messageId) {
      toast.error("Unable to unsend message.");
      return;
    }
    deleteMessage({ messageId, original: msg });
    setConfirmUnsendId(null);
    toast.success("Message unsent");
  };

  // Close any open message menu / unsend confirm when switching rooms.
  useEffect(() => {
    setOpenMenuId(null);
    setConfirmUnsendId(null);
  }, [selectedReceiverId]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceiverId) {
      toast.error("Please select a conversation first.");
      return;
    }

    if (!messageInput.trim() && !selectedFile) {
      return;
    }

    // Handle Editing existing message
    if (editingMessage) {
      const messageId = editingMessage.id || (editingMessage as any)._id;
      if (messageId) {
        editMessage({
          messageId,
          message: messageInput.trim(),
          original: editingMessage,
        });
        toast.success("Message updated");
      }
      setEditingMessage(null);
      setMessageInput("");
      return;
    }

    let fileUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;

    if (selectedFile) {
      fileName = selectedFile.name;
      try {
        fileUrl = await readFileAsDataURL(selectedFile);
      } catch {
        toast.error("Failed to process file attachment.");
        return;
      }
    }

    sendMessage({
      receiverId: selectedReceiverId,
      message: messageInput.trim(),
      fileUrl,
      fileName,
    });

    setMessageInput("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Extract selected recipient details
  const selectedConversation = conversations.find(
    (c) =>
      c.userId === selectedReceiverId ||
      c.receiverId === selectedReceiverId ||
      c.senderId === selectedReceiverId ||
      c.user?.id === selectedReceiverId ||
      c.receiver?.id === selectedReceiverId ||
      c.sender?.id === selectedReceiverId
  );

  const recipientUser = selectedConversation
    ? getOtherUser(selectedConversation, currentUser?.id)
    : undefined;

  // Filtered conversation sidebar list
  const filteredConversations = conversations.filter((item) => {
    const otherUser = getOtherUser(item, currentUser?.id);
    const name = getDisplayName(otherUser);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isSelectedUserOnline = checkIsOnline(recipientUser, selectedReceiverId, onlineUsers);

  return (
    <div suppressHydrationWarning className="flex flex-col h-[calc(100vh-120px)] max-h-[850px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Header / Connection Banner */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
          <div className="p-1.5 sm:p-2 bg-[#E6FAFF] text-[#00B2D6] rounded-lg shrink-0">
            <MessageSquare size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate leading-tight">Messages & Support Chat</h1>
            <p className="hidden sm:block text-xs text-gray-500">
              {isAdminOrSuperAdmin
                ? "Send direct messages to users, drivers, clinics, or organizers"
                : "View and reply to incoming messages"}
            </p>
          </div>
        </div>

        {/* Connection Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {isConnected ? (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <Wifi size={13} className="text-green-600 sm:w-3.5 sm:h-3.5" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <WifiOff size={13} className="text-amber-600 sm:w-3.5 sm:h-3.5" />
              Connecting...
            </span>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Conversation List */}
        <div className={`${selectedReceiverId ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 border-r border-gray-200 flex-col bg-white`}>
          {/* Action Header & Search */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            {isAdminOrSuperAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#00B2D6] hover:bg-[#009cb9] text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-cyan-100"
              >
                <UserPlus size={16} />
                <span>New Conversation</span>
              </button>
            )}

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B2D6] focus:border-[#00B2D6] bg-gray-50"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div
            ref={conversationListRef}
            onScroll={handleConversationListScroll}
            className="flex-1 overflow-y-auto divide-y divide-gray-100"
          >
            {isLoadingConversations ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="h-3.5 bg-gray-200 rounded w-28" />
                        <div className="h-2.5 bg-gray-200 rounded w-8" />
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-36" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {!isLoadingConversations && filteredConversations.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-700">No conversations</p>
                <p className="text-xs text-gray-400 mt-1">
                  {isAdminOrSuperAdmin
                    ? "Click 'New Conversation' to start messaging a user."
                    : "Messages sent to you will appear here so you can reply."}
                </p>
              </div>
            )}

            {!isLoadingConversations &&
              filteredConversations.length > 0 &&
              filteredConversations.map((conv, idx) => {
                const targetUser = getOtherUser(conv, currentUser?.id);
                const targetId =
                  (targetUser?.id !== currentUser?.id && targetUser?.id) ||
                  (conv.senderId !== currentUser?.id && conv.senderId) ||
                  (conv.receiverId !== currentUser?.id && conv.receiverId) ||
                  conv.userId ||
                  conv.id ||
                  `conv-${idx}`;
                const isSelected = selectedReceiverId === targetId;
                const isOnline = checkIsOnline(targetUser, targetId, onlineUsers);
                const roleText = targetUser?.role || (conv as any)?.role || (targetUser as any)?.userRole || (targetUser as any)?.type;

                return (
                  <button
                    key={targetId || idx}
                    onClick={() => setSelectedReceiverId(targetId)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-[#E6FAFF]/80 border-l-4 border-[#00B2D6]" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {targetUser?.image ? (
                        <img
                          src={targetUser.image}
                          alt={targetUser.fullName || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#E6FAFF] text-[#00B2D6] border border-[#B2ECF7] flex items-center justify-center font-semibold text-sm">
                          {getDisplayName(targetUser).charAt(0).toUpperCase()}
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0 pr-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate leading-none">
                            {getDisplayName(targetUser)}
                          </h3>
                          {roleText && (
                            <span className={`text-[9px] font-semibold px-1.5 mb-1 py-0.5 rounded-full border uppercase tracking-wider shrink-0 leading-none ${getRoleBadgeStyle(roleText)}`}>
                              {roleText}
                            </span>
                          )}
                        </div>
                        {conv.updatedAt && (
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {formatSidebarPreview(conv.lastMessage)}
                      </p>
                    </div>
                  </button>
                );
              })}

            {!isLoadingConversations &&
              !searchQuery &&
              hasMoreConversations && (
                <div className="p-3 flex flex-col items-center gap-1.5">
                  {isLoadingMoreConversations ? (
                    <Loader2 size={16} className="animate-spin text-[#00B2D6]" />
                  ) : (
                    <button
                      type="button"
                      onClick={fetchMoreConversations}
                      className="text-xs font-medium text-[#00B2D6] hover:underline"
                    >
                      Load more conversations
                    </button>
                  )}
                </div>
              )}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className={`${selectedReceiverId ? "flex" : "hidden md:flex"} flex-1 flex-col bg-slate-50/50`}>
          {selectedReceiverId ? (
            <>
              {/* Active Receiver Header */}
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedReceiverId(null)}
                    className="md:hidden p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Back to conversations"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div className="relative">
                    {recipientUser?.image ? (
                      <img
                        src={recipientUser.image}
                        alt={getDisplayName(recipientUser)}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#00B2D6] text-white flex items-center justify-center font-bold text-sm">
                        {getDisplayName(recipientUser).charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isSelectedUserOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-gray-900 leading-none">
                        {getDisplayName(recipientUser)}
                      </h2>
                      {(recipientUser?.role || (recipientUser as any)?.userRole || (selectedConversation as any)?.role) && (
                        <span className={`text-[9px] font-semibold px-1.5 mb-1 py-0.5 rounded-full border uppercase tracking-wider leading-none ${getRoleBadgeStyle(recipientUser?.role || (recipientUser as any)?.userRole || (selectedConversation as any)?.role)}`}>
                          {recipientUser?.role || (recipientUser as any)?.userRole || (selectedConversation as any)?.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{recipientUser?.email || ""}</span>
                      {isSelectedUserOnline ? (
                        <span className="text-green-600 font-medium">• Online</span>
                      ) : (
                        <span className="text-gray-400">• Offline</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Stream */}
              <div
                ref={messageStreamRef}
                onScroll={handleMessageStreamScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {isLoadingOlderChats && (
                  <div className="flex justify-center py-1" aria-live="polite">
                    <Loader2 size={16} className="animate-spin text-[#00B2D6]" />
                  </div>
                )}

                {isLoadingChats ? (
                  <div className="space-y-6 p-3 animate-pulse">
                    {/* Date Separator Skeleton */}
                    <div className="flex justify-center my-2">
                      <div className="h-5 w-24 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shadow-xs" />
                    </div>

                    {/* Received Message 1 */}
                    <div className="flex items-start gap-2.5 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                      <div className="space-y-1.5">
                        <div className="p-3.5 bg-white border border-gray-200/80 rounded-2xl rounded-tl-none shadow-xs space-y-2">
                          <div className="h-3 w-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-sm" />
                          <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-sm" />
                        </div>
                        <div className="h-2 w-10 bg-gray-200 rounded-full ml-1" />
                      </div>
                    </div>

                    {/* Sent Message 1 */}
                    <div className="flex flex-col items-end space-y-1.5 ml-auto max-w-[75%]">
                      <div className="p-3.5 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-2xl rounded-tr-none shadow-xs">
                        <div className="h-3 w-36 bg-blue-300/40 rounded-sm" />
                      </div>
                      <div className="h-2 w-10 bg-gray-200 rounded-full mr-1" />
                    </div>

                    {/* Received Message 2 (With File Attachment Skeleton) */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="p-3.5 bg-white border border-gray-200/80 rounded-2xl rounded-tl-none shadow-xs space-y-3">
                          <div className="h-3 w-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-sm" />
                          {/* File Card Placeholder */}
                          <div className="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-200/60 rounded-xl">
                            <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="space-y-1.5 flex-1">
                              <div className="h-3 w-32 bg-gray-200 rounded-sm" />
                              <div className="h-2 w-16 bg-gray-200 rounded-sm" />
                            </div>
                            <div className="w-14 h-6 bg-gray-200 rounded-md" />
                          </div>
                        </div>
                        <div className="h-2 w-10 bg-gray-200 rounded-full ml-1" />
                      </div>
                    </div>

                    {/* Sent Message 2 */}
                    <div className="flex flex-col items-end space-y-1.5 ml-auto max-w-[75%]">
                      <div className="p-3.5 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-2xl rounded-tr-none shadow-xs space-y-2">
                        <div className="h-3 w-52 bg-blue-300/40 rounded-sm" />
                        <div className="h-3 w-28 bg-blue-300/40 rounded-sm" />
                      </div>
                      <div className="h-2 w-10 bg-gray-200 rounded-full mr-1" />
                    </div>
                  </div>
                ) : null}

                {!isLoadingChats && currentMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={40} className="mb-2 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">No messages yet</p>
                    <p className="text-xs text-gray-400">Type a message below to start the conversation.</p>
                  </div>
                )}

                {!isLoadingChats &&
                  currentMessages.length > 0 &&
                  currentMessages.map((msg, index) => {
                    const getSenderId = (m: ChatMessage) => {
                      if (!m) return undefined;
                      if (typeof m.senderId === "string") return m.senderId;
                      if (typeof m.sender === "string") return m.sender;
                      if (m.sender && typeof m.sender === "object") return m.sender.id || (m.sender as any)._id;
                      return undefined;
                    };
                    const senderId = getSenderId(msg);
                    const isSelf = Boolean(
                      senderId &&
                        (senderId === currentUser?.id ||
                          ((currentUser as any)?._id && senderId === (currentUser as any)._id))
                    );
                    const msgId = msg.id || (msg as any)._id;

                    return (
                      <div
                        key={msg.id || index}
                        className={`group flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                      >
                        {confirmUnsendId === msgId && (
                          <div className="flex items-center gap-2 mt-1 mb-1 text-xs">
                            <span className="text-gray-500">Unsend this message?</span>
                            <button
                              type="button"
                              onClick={() => handleConfirmUnsend(msg)}
                              className="font-medium text-red-600 hover:underline"
                            >
                              Unsend
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmUnsendId(null)}
                              className="text-gray-400 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 max-w-full">
                          {isSelf && !isDeletedMessage(msg) && (
                            <div
                              ref={openMenuId === msgId ? menuRef : null}
                              className="relative opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-1"
                            >
                              <button
                                type="button"
                                onClick={() => setOpenMenuId((current) => (current === msgId ? null : msgId))}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                title="Message actions"
                                aria-label="Message actions"
                                aria-expanded={openMenuId === msgId}
                              >
                                <MoreVertical size={14} />
                              </button>

                              {openMenuId === msgId && (
                                <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-left shadow-lg">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleStartEdit(msg);
                                    }}
                                    className="block w-full px-3 py-2 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setConfirmUnsendId(msgId);
                                    }}
                                    className="block w-full px-3 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                                  >
                                    Unsend
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <div
                            className={`w-fit min-w-[4.5rem] max-w-[75%] rounded-2xl px-2 py-1.5 shadow-xs text-sm break-words ${
                              isSelf
                                ? "bg-[#00B2D6] text-white rounded-br-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-2xs"
                            }`}
                          >
                            {isDeletedMessage(msg) ? (
                              <p className="italic opacity-70">This message was unsent</p>
                            ) : (
                              <>
                            {Boolean(formatMessageContent(msg.message)) && (
                              <p className="leading-relaxed whitespace-pre-wrap break-words">{formatMessageContent(msg.message)}</p>
                            )}

                            {msg.fileUrl && (
                              <div className="mt-2 space-y-2">
                                {isImageFile(msg.fileUrl, msg.fileName) ? (
                                  <div className="overflow-hidden rounded-lg border border-black/10">
                                    <img
                                      src={msg.fileUrl}
                                      alt={msg.fileName || "Image attachment"}
                                      className="max-w-xs max-h-60 object-cover rounded-lg"
                                    />
                                    <div className="flex justify-end p-1">
                                      <a
                                        href={msg.fileUrl}
                                        download={msg.fileName || "image.png"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] underline font-semibold opacity-90 hover:opacity-100 px-1"
                                      >
                                        Download ({msg.fileName || "image"})
                                      </a>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                                      isSelf
                                        ? "bg-[#009cb9] border-[#008ba5] text-white"
                                        : "bg-gray-50 border-gray-200 text-gray-800"
                                    }`}
                                  >
                                    <FileText size={18} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{msg.fileName || "Attachment"}</p>
                                    </div>
                                    <a
                                      href={msg.fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      download={msg.fileName || "attachment"}
                                      className="text-xs underline font-semibold hover:opacity-80"
                                    >
                                      Download
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                              </>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "Just now"}
                          {msg.isEdited && !isDeletedMessage(msg) && (
                            <span
                              className="italic text-gray-400 font-normal"
                              title={msg.editedAt ? `Edited ${new Date(msg.editedAt).toLocaleString()}` : undefined}
                            >
                              (edited)
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Message Input Form */}
              <div className="p-3 bg-white border-t border-gray-200">
                {editingMessage && (
                  <div className="mb-2 flex items-center justify-between bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded-lg border border-amber-200">
                    <span className="flex items-center gap-1.5 font-medium truncate">
                      <Pencil size={14} className="text-amber-600" />
                      Editing message...
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-amber-600 hover:text-amber-800 font-semibold text-xs flex items-center gap-1"
                    >
                      Cancel <X size={13} />
                    </button>
                  </div>
                )}

                {selectedFile && (
                  <div className="mb-2 flex items-center justify-between bg-[#E6FAFF] text-[#00B2D6] text-xs px-3 py-1.5 rounded-lg border border-[#B2ECF7]">
                    <span className="flex items-center gap-1.5 truncate font-medium">
                      <FileText size={14} />
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-[#00B2D6] hover:text-[#0092B0]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-[#00B2D6] hover:bg-[#E6FAFF] rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={editingMessage ? "Edit your message..." : "Type your message..."}
                    className="flex-1 py-2 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00B2D6] focus:border-[#00B2D6]"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim() && !selectedFile}
                    className={`p-2.5 text-white rounded-lg transition-colors shadow-sm disabled:bg-gray-300 ${
                      editingMessage ? "bg-amber-600 hover:bg-amber-700" : "bg-[#00B2D6] hover:bg-[#009cb9]"
                    }`}
                    title={editingMessage ? "Save edit" : "Send message"}
                  >
                    {editingMessage ? <Check size={16} /> : <Send size={16} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <div className="w-16 h-16 bg-[#E6FAFF] text-[#00B2D6] rounded-full flex items-center justify-center mb-4 border border-[#B2ECF7]">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-base font-semibold text-gray-800">Select a conversation</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Choose an existing conversation from the left sidebar
                {isAdminOrSuperAdmin ? " or click 'New Conversation' to search and message any user." : "."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin New Conversation Modal */}
      {isMounted &&
        isModalOpen &&
        isAdminOrSuperAdmin &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Start New Conversation</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B2D6] focus:border-[#00B2D6]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-100">
                {isUsersLoading && (
                  <div className="p-8 text-center text-sm text-gray-500">Loading users...</div>
                )}
                {!isUsersLoading && (!usersData?.data || usersData.data.length === 0) && (
                  <div className="p-8 text-center text-sm text-gray-500">No users found</div>
                )}
                {!isUsersLoading &&
                  usersData?.data &&
                  usersData.data.length > 0 &&
                  usersData.data.map((u: APIUser) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedReceiverId(u.id);
                        setIsModalOpen(false);
                      }}
                      className="w-full text-left p-3 flex items-center justify-between hover:bg-[#E6FAFF] rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold text-xs">
                          {(u.fullName || u.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.fullName || u.email}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                        {u.role}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
