// / src/redux/api/endpoints/adminEndpoints.ts
import baseApi from "@/redux/api/baseApi";

// ===== SHARED INTERFACES =====
export interface PropertyOperator {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

// ===== ADMIN PROPERTY (for /properties/admin) =====
export interface AdminProperty {
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
    | "RECENTLY_RENOVATED"
    | string;

  type: "FLAT" | "OTHERS" | "OFFICES" | "LAND" | "SHOPS" | string;

  listedFor: "RENT" | "SELL" | string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED" | "BOOKED" | string;

  createdAt: string;
  operator?: PropertyOperator;
  price: number; // Root-level field in admin endpoint
}

// ===== PUBLIC PROPERTY (for /properties) =====
export interface PublicProperty {
  id: string;
  uuid: string;
  title: string;
  description: string;
  images: string[];
  address: string;
  city: string | null;
  verified: boolean;

  condition:
    | "LUXURY_STANDARD"
    | "GOOD_CONDITION"
    | "HISTORICAL_PERIOD"
    | "NEWLY_BUILT"
    | "DATED_FINISHES"
    | "NEEDS_RENOVATION"
    | "RECENTLY_RENOVATED"
    | string;

  type: "FLAT" | "OTHERS" | "OFFICES" | "LAND" | "SHOPS" | string;

  useableArea: number;
  builtYear: string;
  createdAt: string;

  financialInfos: {
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
  isFavorite: boolean;
}

// ===== LOCATION INTERFACE =====
export interface PropertyLocation {
  lat: string;
  long: string;
}

// ===== RESPONSE INTERFACES =====
export interface AdminPropertiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: AdminProperty[]; // Flat array for admin endpoint
}

export interface PublicPropertiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: {
    locations: PropertyLocation[];
    properties: PublicProperty[]; // Nested structure for public endpoint
  };
}
export interface DeletePropertyResponse {
  success: boolean;
  statusCode: number;
  message: string; // "Property deleted successfully!"
}
// ===== TOGGLE BLOCK/VERIFY RESPONSE =====
export interface TogglePropertyVerifyResponse {
  success: boolean;
  statusCode: number;
  message: string; // "Property block status toggled successfully!"
}

// Add to response interfaces
export interface ToggleFavouriteResponse {
  success: boolean;
  message: string;
  statusCode: number;
}
export interface SharePropertyResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

// ===== SMART ALERT INTERFACES =====
export interface SmartAlertRequest {
  propertyId: string;
  isActive: boolean;
}

export interface SmartAlertResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    propertyId: string;
    isActive: boolean;
    propertyTitle: string;
  };
}

// Create API slice
const propertiesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ADMIN ENDPOINT: Returns flat array
    getAdminProperties: builder.query<
      AdminPropertiesResponse,
      {
        page?: number;
        limit?: number;
        blocked?: boolean;
        verified?: boolean;
        search?: string;
        status?: string;
      }
    >({
      query: ({ page = 1, limit = 10, blocked, verified, search, status }) => ({
        url: "/properties/admin",
        params: {
          page,
          limit,
          blocked,
          verified,
          search,
          status,
        },
      }),
      providesTags: ["properties"],
    }),

    // PUBLIC ENDPOINT: Returns nested { locations, properties }
    getAllProperties: builder.query<
      PublicPropertiesResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        location?: string;
        surfaceMin?: number;
        surfaceMax?: number;
        yieldMin?: number;
        yieldMax?: number;
        tenantType?: string;
        blocked?: boolean;
        verified?: boolean;
        type?: string;
      }
    >({
      query: ({
        page,
        limit,
        search,
        minPrice,
        maxPrice,
        location,
        surfaceMin,
        surfaceMax,
        yieldMin,
        yieldMax,
        tenantType,
        blocked,
        verified,
        type,
      }) => ({
        url: "/properties",
        params: {
          page,
          limit,
          search,
          minPrice,
          maxPrice,
          location,
          surfaceMin,
          surfaceMax,
          yieldMin,
          yieldMax,
          tenantType,
          blocked,
          verified,
          type,
        },
      }),
      providesTags: ["properties"],
    }),

    deleteProperty: builder.mutation<DeletePropertyResponse, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["properties"],
    }),

    // PATCH endpoint for toggling block/verify
    togglePropertyVerify: builder.mutation<
      TogglePropertyVerifyResponse,
      string
    >({
      query: (id) => ({
        url: `/properties/${id}/verify`,
        method: "PATCH",
      }),
      invalidatesTags: ["properties"],
    }),

    togglePropertyBlock: builder.mutation<TogglePropertyVerifyResponse, string>(
      {
        query: (id) => ({
          url: `/properties/${id}/block`,
          method: "PATCH",
        }),
        invalidatesTags: ["properties"],
      },
    ),

    // Inside the endpoints builder
    toggleFavourite: builder.mutation<ToggleFavouriteResponse, string>({
      query: (id) => ({
        url: `/properties/${id}/favorites`, // Adjust based on your actual backend route
        method: "POST",
      }),
      invalidatesTags: ["properties", "favorites"],
    }),

    getAllFavorites: builder.query<PublicPropertiesResponse, void>({
      query: () => ({
        url: "/properties/favorites", // Adjust based on your actual backend route
        method: "GET",
      }),
      providesTags: ["properties", "favorites"],
    }),

    // Toggle Share Mutation
    toggleShare: builder.mutation<SharePropertyResponse, string>({
      query: (id) => ({
        url: `/properties/${id}/shares`,
        method: "PATCH", // Based on your description of hitting the toggle API
      }),
      // We invalidate "properties" so the share count updates in the UI
      invalidatesTags: ["properties"],
    }),

    getAgencyProperties: builder.query<
      AdminPropertiesResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        operatorId?: string;
        status?: string;
      }
    >({
      query: (params) => ({
        url: "/properties/agency",
        method: "GET",
        params,
      }),
      providesTags: ["properties"],
    }),

    updateSmartAlert: builder.mutation<SmartAlertResponse, SmartAlertRequest>({
      query: ({ propertyId, isActive }) => ({
        url: `/properties/${propertyId}/smart-alert`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["properties"],
    }),
  }),
});

export const {
  useGetAdminPropertiesQuery,
  useGetAllPropertiesQuery,
  useTogglePropertyVerifyMutation,
  useTogglePropertyBlockMutation,
  useDeletePropertyMutation,
  useToggleFavouriteMutation,
  useGetAllFavoritesQuery,
  useToggleShareMutation,
  useGetAgencyPropertiesQuery,
  useUpdateSmartAlertMutation,
} = propertiesApi;
