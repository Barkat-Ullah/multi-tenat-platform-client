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
} from "lucide-react";

interface MessagingViewProps {
  role?: string;
}

function formatMessageContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    if (typeof content.message === "string") return content.message;
    if (typeof content.text === "string") return content.text;
    if (typeof content.content === "string") return content.content;
    if (content.fileName) return `[File] ${content.fileName}`;
    if (content.fileUrl) return "[File Attachment]";
  }
  return "";
}

function getDisplayName(userObj: any): string {
  if (!userObj) return "User";
  if (typeof userObj === "string") return userObj;
  return userObj.fullName || userObj.name || userObj.email || "User";
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
    conversations,
    currentMessages,
    onlineUsers,
    selectedReceiverId,
    setSelectedReceiverId,
    sendMessage,
  } = useWebSocketChat();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // New Chat Modal state (Admin/Super Admin only)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Fetch users for Admin "New Chat" modal
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery(
    { page: 1, limit: 100, search: userSearchTerm },
    { skip: !isModalOpen || !isAdminOrSuperAdmin }
  );

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom of chat window
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

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
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[850px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Header / Connection Banner */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Messages & Support Chat</h1>
            <p className="text-xs text-gray-500">
              {isAdminOrSuperAdmin
                ? "Send direct messages to users, drivers, clinics, or organizers"
                : "View and reply to incoming messages"}
            </p>
          </div>
        </div>

        {/* Connection Indicator */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <Wifi size={14} className="text-green-600" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <WifiOff size={14} className="text-amber-600" />
              Connecting...
            </span>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Conversation List */}
        <div className="w-80 md:w-96 border-r border-gray-200 flex flex-col bg-white">
          {/* Action Header & Search */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            {isAdminOrSuperAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
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
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
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
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-700">No conversations</p>
                <p className="text-xs text-gray-400 mt-1">
                  {isAdminOrSuperAdmin
                    ? "Click 'New Conversation' to start messaging a user."
                    : "Messages sent to you will appear here so you can reply."}
                </p>
              </div>
            ) : (
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

                return (
                  <button
                    key={targetId || idx}
                    onClick={() => setSelectedReceiverId(targetId)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50/70 border-l-4 border-blue-600" : ""
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
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                          {getDisplayName(targetUser).charAt(0).toUpperCase()}
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {getDisplayName(targetUser)}
                        </h3>
                        {conv.updatedAt && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {formatMessageContent(conv.lastMessage) || "Click to open conversation"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          {selectedReceiverId ? (
            <>
              {/* Active Receiver Header */}
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {recipientUser?.image ? (
                      <img
                        src={recipientUser.image}
                        alt={getDisplayName(recipientUser)}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {getDisplayName(recipientUser).charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isSelectedUserOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      {getDisplayName(recipientUser)}
                    </h2>
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
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                ) : currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={40} className="mb-2 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">No messages yet</p>
                    <p className="text-xs text-gray-400">Type a message below to start the conversation.</p>
                  </div>
                ) : (
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

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-xs text-sm ${
                            isSelf
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                          }`}
                        >
                          {Boolean(formatMessageContent(msg.message)) && (
                            <p className="leading-relaxed whitespace-pre-wrap">{formatMessageContent(msg.message)}</p>
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
                                      ? "bg-blue-700/50 border-blue-500 text-white"
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
                        </div>

                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "Just now"}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messageEndRef} />
              </div>

              {/* Message Input Form */}
              <div className="p-3 bg-white border-t border-gray-200">
                {selectedFile && (
                  <div className="mb-2 flex items-center justify-between bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-lg border border-blue-200">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText size={14} />
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-blue-500 hover:text-blue-700"
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
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 py-2 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim() && !selectedFile}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
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
      {isModalOpen &&
        isAdminOrSuperAdmin &&
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
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-100">
                {isUsersLoading ? (
                  <div className="p-8 text-center text-sm text-gray-500">Loading users...</div>
                ) : !usersData?.data || usersData.data.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500">No users found</div>
                ) : (
                  usersData.data.map((u: APIUser) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedReceiverId(u.id);
                        setIsModalOpen(false);
                      }}
                      className="w-full text-left p-3 flex items-center justify-between hover:bg-blue-50 rounded-lg transition-colors"
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
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
