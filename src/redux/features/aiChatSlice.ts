// src/redux/slices/aiChatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PropertySuggestion } from '@/redux/service/apAIModel/apiEndpoint';

interface AIMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: PropertySuggestion[];
}

interface AIState {
  threadId: string | null;
  messages: AIMessage[];
  currentSuggestions: PropertySuggestion[];
  isLoading: boolean;
}

const initialState: AIState = {
  threadId: null,
  messages: [],
  currentSuggestions: [],
  isLoading: false,
};

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    setThreadId: (state, action: PayloadAction<string>) => {
      state.threadId = action.payload;
    },
    addMessage: (state, action: PayloadAction<AIMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<AIMessage[]>) => {
      state.messages = action.payload;
    },
    updateSuggestions: (state, action: PayloadAction<PropertySuggestion[]>) => {
      state.currentSuggestions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearChat: (state) => {
      state.threadId = null;
      state.messages = [];
      state.currentSuggestions = [];
      state.isLoading = false;
    },
    resetSuggestions: (state) => {
      state.currentSuggestions = [];
    },
  },
});

export const {
  setThreadId,
  addMessage,
  setMessages,
  updateSuggestions,
  setLoading,
  clearChat,
  resetSuggestions,
} = aiChatSlice.actions;

export default aiChatSlice.reducer;