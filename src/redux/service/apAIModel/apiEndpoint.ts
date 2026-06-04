// src/redux/api/endpoints/aiEndpoints.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import aiApi from "@/redux/api/aiApi";

// Property Suggestion Interface
interface PropertySuggestion {
  _id: string;
  verified: boolean;
  title: string;
  address: string;
  useableArea: number;
  type: string;
  condition: string;
  builtYear: string;
  images: string[];
  status: string;
  askingPrice: number;
  grossAnnualRent: number;
  grossYield: number;
  uuid?: string;
}

// Chat Request Interface
interface ChatRequest {
  message: string;
  userId: string;
  threadId?: string;
}

// Chat Response Interface - Updated to match actual API response
interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    threadId: string;
    response: string;
    history: any[];
    suggestions: PropertySuggestion[];
  };
  error: any;
  timestamp: string;
}

// Chat History Response Interface
interface ChatHistoryResponse {
  success: boolean;
  message: string;
  data: Array<{
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  }>;
  error: any;
  timestamp: string;
}

// Image Analysis Request Interface
interface ImageAnalysisRequest {
  image: string; // base64 or URL
  prompt?: string;
}

const aiEndpoints = aiApi.injectEndpoints({
  endpoints: (builder) => ({
    // Chat with AI model
    chatWithAI: builder.mutation<ChatResponse, ChatRequest>({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ai"],
    }),

    // Get chat history by threadId
    getChatHistory: builder.query<ChatHistoryResponse, string>({
      query: (threadId) => ({
        url: `/history/${threadId}`,
        method: "GET",
      }),
      providesTags: ["ai"],
    }),

    // Image analysis
    analyzeImage: builder.mutation<any, ImageAnalysisRequest>({
      query: (data) => ({
        url: "/analyze-image",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ai"],
    }),

    // Get AI suggestions
    getAISuggestions: builder.query<any, { query: string }>({
      query: ({ query }) => ({
        url: `/suggestions?q=${encodeURIComponent(query)}`,
        method: "GET",
      }),
      providesTags: ["ai"],
    }),

    // Generate content
    generateContent: builder.mutation<any, { prompt: string; type: string }>({
      query: (data) => ({
        url: "/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ai"],
    }),
  }),
});

export const {
  useChatWithAIMutation,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useAnalyzeImageMutation,
  useGetAISuggestionsQuery,
  useGenerateContentMutation,
} = aiEndpoints;

export const { endpoints: aiApiEndpoints } = aiEndpoints;

// Export types for use in components
export type { ChatResponse, ChatRequest, PropertySuggestion, ChatHistoryResponse };
