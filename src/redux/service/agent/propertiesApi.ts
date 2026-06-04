/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/endpoints/agencyPropertiesApi.ts
import baseApi from "@/redux/api/baseApi";

// ===== FAVORITE USER =====
export interface FavoriteUser {
  name: string;
  email: string;
  avatar: string | null;
}

// ===== FINANCIAL INFOS (common to both list and detail) =====
export interface FinancialInfos {
  askingPrice: number;
  managementFee: number;
  propertyTax: number;
  grossAnnualRent: number;
  netAnnualIncome: number;
  perSqmCommercial: number;
  perSqmRentYield: number;
  grossYield: number;
  netYield: number;
}

// ===== BASIC PROPERTY (for list endpoint) =====
export interface Property {
  id: string;
  uuid: string;
  title: string;
  images: string[];
  address: string;
  verified: boolean;
  blocked: boolean;

  condition:
    | "LUXURY_STANDARD"
    | "GOOD_CONDITION"
    | "HISTORICAL_PERIOD"
    | "NEWLY_BUILT"
    | "DATED_FINISHES"
    | "NEEDS_RENOVATION"
    | string;

  type: "FLAT" | "OTHERS" | "OFFICES" | "LAND" | "SHOPS" | string;

  listedFor: "RENT" | "SELL" | string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED" | "BOOKED" | string;

  useableArea: number;
  builtYear: string; // ISO date string
  commercialArea: number;
  createdAt: string;
  description: string;
  updatedAt: string;
  shares: number;

  financialInfos?: FinancialInfos;
  favorites?: FavoriteUser[];

  totalFavorites: number;
  totalVisitors: number;
  totalMessages: number;
}

// ===== EXTENDED PROPERTY DETAILS (for single property endpoint) =====
export interface PropertyDetails extends Property {
  isFavorite?: boolean;
  isSmartAlert?: boolean;
  // Operator details
  operator?: {
    avatar: string | null;
    name: string;
    email: string;
    phone: string;
  };

  floorPlanDesc?: string;
  floorPlanImg?: string;

  //   "avatar": "http://206.162.244.189:5000/uploads/avatar-1770020695727-845209962.jpg",
  // "email": "user1@gmail.com",
  // "name": "Laden bin Putin",
  // "phone": "123-456-7890"

  // Lease/tenant information
  leaseTenantInfos?: {
    status: string;
    duration: string;
    type: string;
    rentPerMonth: number;
    leaseRenewal: boolean;
    leasedArea: string;
    specialClauses: string;
    guaranteeType: string;
    guaranteeAmount: number;
    depositAmount: number;
  };

  // Compliance documents
  complianceDocuments?: {
    energyCertificate: string;
    urbanCadastral: string;
    ownershipDeed: string;
    leaseAgreement: string;
  };

  // Investment data
  optionalInvestmentData?: {
    historicalRate: number;
    holdingPeriod: number;
    sellingCost: number;
  };

  // Additional area fields (from your original interface)
  balconyArea?: number;
  terraceArea?: number;
  gardenArea?: number;
  patioArea?: number;
  roofTerrace?: number;
  garageArea?: number;

  // Location coordinates
  lat?: number | null;
  long?: number | null;
}

// ===== PAGINATED RESPONSE (LIST ENDPOINT) =====
export interface PropertiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Property[]; // ✅ Flat array (matches your JSON)
}

// ===== SINGLE PROPERTY RESPONSE =====
export interface PropertyDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PropertyDetails;
}

// ===== SEND MESSAGE INTERFACES =====
export interface SendMessageRequest {
  id: string;
  data: {
    subject: string;
    message: string;
  };
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
}

// ===== CREATE PROPERTY RESPONSE =====
export interface CreatePropertyResponseData {
  id: string;
}

export interface CreatePropertyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreatePropertyResponseData;
}

// ===== CREATE PROPERTY lease RESPONSE =====
export interface CreateLeaseInfoResponseData {
  message: string;
  data: {
    id: string;
    propertyId: string;
  };
}

export interface CreateLeaseInfoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreateLeaseInfoResponseData;
}

// ===== CREATE PROPERTY Financial RESPONSE =====
export interface CreateFinancialInfoResponseData {
  message: string;
  data: {
    id: string;
    propertyId: string;
  };
}

export interface CreateFinancialInfoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreateFinancialInfoResponseData;
}

// ===== CREATE compliance RESPONSE =====
export interface CreateComplianceDocumentsResponseData {
  message: string;
  data: {
    id: string;
    propertyId: string;
  };
}

export interface ComplianceDocumentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreateComplianceDocumentsResponseData;
}

// ===== CREATE Reserved Property RESPONSE =====
export interface ReservedPropertyResponseData {
  message: string;
  data: {
    id: string;
    propertyId: string;
  };
}

export interface ReservedPropertyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ReservedPropertyResponseData;
}

// ===== REQUEST =====
export interface ReservedPropertyRequest {
  propertyId: string;
  name: string[];
}
// ===== CREATE Optional Investment RESPONSE =====
export interface OptionalInvestmentResponseData {
  message: string;
  data: {
    id: string;
    propertyId: string;
  };
}

export interface OptionalInvestmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: OptionalInvestmentResponseData;
}

// ===== REQUEST =====
export interface OptionalInvestmentRequest {
  propertyId: string;
  historicalRate: number;
  holdingPeriod: number;
  sellingCost: number;
}

// ✅ Request body (based on your Postman)
export interface CreateLeaseInfoPayload {
  propertyId: string;
  status: string; // "active"
  duration: string; // "12 months"
  type: string; // "PRIVATE"
  rentPerMonth: number; // 20000
  leaseRenewal: boolean; // false
  leasedArea: string; // "100 sqft"
  specialClauses?: string; // optional
  guaranteeType: string; // "BANK_GUARANTEE"
  guaranteeAmount: number; // 25000
  depositAmount: number; // 25000
}

//  Payload interface (what we send)
export interface FinancialInfoPayload {
  propertyId: string;
  askingPrice: number;
  managementFee: number;
  propertyTax: number;
  grossAnnualRent: number;
  netAnnualIncome: number;
  perSqmCommercial: number;
  perSqmRentYield: number;
  grossYield: number;
  netYield: number;
}

export interface SharePropertyResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

// Types (API response)
// =====================

export interface PropertyMessageCustomer {
  name: string;
  email: string;
}

export interface PropertyMessageProperty {
  id: string;
  uuid: string;
  title: string;
  status: "ACTIVE" | "INACTIVE" | string; // keep safe if backend adds more
  verified: boolean;
  image: string | null;
}

export interface PropertyMessageItem {
  id: string;
  subject: string;
  message: string;
  property: PropertyMessageProperty;
  customer: PropertyMessageCustomer;
  createdAt: string;
}

export interface PropertyMessagesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PropertyMessagesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: PropertyMessagesPagination;
  data: PropertyMessageItem[];
}

export interface PropertyDetailsFull extends Property {
  // ✅ Existing Property fields (title, type, address, etc.)

  // ✅ NEW from detailed response
  operatorId: string;

  // ✅ Area fields (all present in response)
  commercialArea: number;
  useableArea: number;
  balconyArea: number;
  terraceArea: number;
  gardenArea: number;
  patioArea: number;
  roofTerrace: number;
  garageArea: number;

  // ✅ Property details
  finishesLevel: "PREMIUM" | "STANDARD" | string; // Add more as needed
  builtYear: string; // ISO date string
  condition:
    | "HISTORICAL_PERIOD"
    | "LUXURY_STANDARD"
    | "GOOD_CONDITION"
    | "NEWLY_BUILT"
    | "DATED_FINISHES"
    | "NEEDS_RENOVATION"
    | string;

  // ✅ Status flags
  verified: boolean;
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED" | "BOOKED" | string;
  isFavorite?: boolean;
  isSmartAlert?: boolean;
  blocked: boolean;
  shares: number;

  // ✅ Coordinates (nullable)
  lat: number | null;
  long: number | null;

  // ✅ Floor Plan Description fields
  floorPlanDesc: string;
  // ✅ Timestamps
  createdAt: string;
  updatedAt: string;

  // ✅ NESTED OBJECTS (exact match to API response)
  leaseTenantInfos: {
    id: string;
    status: string;
    duration: string;
    type:
      | "PRIVATE"
      | "COMPANY"
      | "PUBLIC"
      | "AUTHORITY"
      | "CHAIN"
      | "OTHERS"
      | string;
    rentPerMonth: number;
    leaseRenewal: boolean;
    leasedArea: string;
    specialClauses: string;
    guaranteeType:
      | "NONE"
      | "BANK_GUARANTEE"
      | "INSURANCE_BOND"
      | "CORPORATE_GUARANTEE"
      | "PERSONAL_GUARANTEE"
      | string;
    guaranteeAmount: number;
    depositAmount: number;
  };

  financialInfos: {
    id: string;
    askingPrice: number;
    managementFee: number;
    propertyTax: number;
    grossAnnualRent: number;
    netAnnualIncome: number;
    perSqmCommercial: number;
    perSqmRentYield: number;
    grossYield: number;
    netYield: number;
  };

  complianceDocuments: {
    id: string;
    energyCertificate: string;
    urbanCadastral: string;
    ownershipDeed: string;
    leaseAgreement: string;
  };

  optionalInvestmentData: {
    id: string;
    historicalRate: number;
    holdingPeriod: number;
    sellingCost: number;
  };

  reservedProperty: {
    id: string;
    name: string[];
  };
}

// ===== UPDATED API RESPONSE =====
export interface PropertyDetailsFullResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PropertyDetailsFull;
}

// =====================

// ===== API SLICE =====
const agencyPropertiesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get paginated properties list
    getAgencyProperties: builder.query<
      PropertiesResponse,
      {
        page: number;
        limit: number;
        search?: string;
        status?: any;
        favorites?: boolean;
      }
    >({
      query: ({ page, limit, search, status, favorites }) => {
        // Build params dynamically
        const params: Record<string, any> = { page, limit };

        if (search) params.search = search;
        if (status) params.status = status;
        if (favorites) params.favorites = favorites;
        return {
          url: "/properties/agency",
          method: "GET",
          params,
        };
      },
      providesTags: ["properties"],
    }),

    // Get single property details
    getSingleProperty: builder.query<PropertyDetailsResponse, string>({
      query: (id) => `/properties/single/${id}`,
      providesTags: ["properties"],
    }),

    getSinglePropertyDetails: builder.query<
      PropertyDetailsFullResponse,
      string
    >({
      query: (id) => `/properties/single/${id}/detailed`,
      providesTags: ["properties"],
    }),

    // Send message to property owner
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ id, data }) => ({
        url: `/properties/${id}/messages`,
        method: "POST",
        body: data,
      }),
    }),

    // Sent add property data
    createProperty: builder.mutation<CreatePropertyResponse, FormData>({
      query: (formData) => ({
        url: "/properties",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["properties"],
    }),

    // Sent Lease info
    createLeaseInfo: builder.mutation<
      CreateLeaseInfoResponse,
      CreateLeaseInfoPayload
    >({
      query: (body) => ({
        url: "/properties/lease-info",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["properties"],
    }),

    // Sent financial info
    createFinancialInfo: builder.mutation<
      CreateFinancialInfoResponse,
      FinancialInfoPayload
    >({
      query: (body) => ({
        url: "/properties/financial-info",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["properties"],
    }),

    // Sent compliance documents
    uploadComplianceDocuments: builder.mutation<
      ComplianceDocumentsResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/properties/compliance-documents",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["properties"],
    }),

    // Sent reserved property
    createReservedProperty: builder.mutation<
      ReservedPropertyResponse,
      ReservedPropertyRequest
    >({
      query: (body) => ({
        url: "/properties/reserved-property",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["properties"],
    }),

    // Sent reserved property
    createOptionalInvestment: builder.mutation<
      OptionalInvestmentResponse,
      OptionalInvestmentRequest
    >({
      query: (body) => ({
        url: "/properties/optional-investment-data",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["properties"],
    }),

    getPropertyMessages: builder.query<
      PropertyMessagesResponse,
      { propertyId: string; page?: number; limit?: number; search?: string }
    >({
      query: ({ propertyId, page = 1, limit = 10, search }) => ({
        url: `/properties/${propertyId}/messages`,
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["properties"],
    }),
    deleteProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/properties/${propertyId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["properties"]
    }),
    updatePropertyStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/properties/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["properties"],
    }),
    updateProperty: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/properties/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["properties"],
    }),
  }),
});

export const {
  useGetSinglePropertyQuery,
  useGetAgencyPropertiesQuery,
  useSendMessageMutation,
  useCreatePropertyMutation,
  useCreateLeaseInfoMutation,
  useCreateFinancialInfoMutation,
  useUploadComplianceDocumentsMutation,
  useCreateReservedPropertyMutation,
  useCreateOptionalInvestmentMutation,
  useGetPropertyMessagesQuery,
  useGetSinglePropertyDetailsQuery,
  useDeletePropertyMutation,
  useUpdatePropertyStatusMutation,
  useUpdatePropertyMutation,
} = agencyPropertiesApi;
