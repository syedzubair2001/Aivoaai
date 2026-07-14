import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const crmApi = createApi({
  reducerPath: 'crmApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }),
  tagTypes: ['Interaction', 'HCP', 'InteractionType'],
  endpoints: (builder) => ({
    // HCP endpoints
    getHCPs: builder.query({
      query: () => 'hcps',
      providesTags: ['HCP'],
    }),
    createHCP: builder.mutation({
      query: (body) => ({ url: 'hcps', method: 'POST', body }),
      invalidatesTags: ['HCP'],
    }),
    updateHCP: builder.mutation({
      query: ({ id, ...body }) => ({ url: `hcps/${id}`, method: 'PUT', body }),
      invalidatesTags: ['HCP'],
    }),
    deleteHCP: builder.mutation({
      query: (id) => ({ url: `hcps/${id}`, method: 'DELETE' }),
      invalidatesTags: ['HCP'],
    }),

    // Interaction Type endpoints
    getInteractionTypes: builder.query({
      query: () => 'interaction-types',
      providesTags: ['InteractionType'],
    }),
    createInteractionType: builder.mutation({
      query: (body) => ({ url: 'interaction-types', method: 'POST', body }),
      invalidatesTags: ['InteractionType'],
    }),
    updateInteractionType: builder.mutation({
      query: ({ id, ...body }) => ({ url: `interaction-types/${id}`, method: 'PUT', body }),
      invalidatesTags: ['InteractionType'],
    }),
    deleteInteractionType: builder.mutation({
      query: (id) => ({ url: `interaction-types/${id}`, method: 'DELETE' }),
      invalidatesTags: ['InteractionType'],
    }),

    // Interaction endpoints
    getInteractions: builder.query({
      query: () => 'interactions',
      providesTags: ['Interaction'],
    }),
    logInteraction: builder.mutation({
      query: (body) => ({ url: 'interactions', method: 'POST', body }),
      invalidatesTags: ['Interaction'],
    }),
    updateInteraction: builder.mutation({
      query: ({ id, ...body }) => ({ url: `interactions/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Interaction'],
    }),
    deleteInteraction: builder.mutation({
      query: (id) => ({ url: `interactions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Interaction'],
    }),

    // Chat
    sendChatMessage: builder.mutation({
      query: (body) => ({ url: 'chat', method: 'POST', body }),
      invalidatesTags: ['Interaction'],
    }),

    // Auth
    signup: builder.mutation({
      query: (credentials) => ({ url: 'signup', method: 'POST', body: credentials }),
    }),
    login: builder.mutation({
      query: (credentials) => ({ url: 'login', method: 'POST', body: credentials }),
    }),
  }),
});

export const {
  useGetHCPsQuery,
  useCreateHCPMutation,
  useUpdateHCPMutation,
  useDeleteHCPMutation,
  useGetInteractionTypesQuery,
  useCreateInteractionTypeMutation,
  useUpdateInteractionTypeMutation,
  useDeleteInteractionTypeMutation,
  useGetInteractionsQuery,
  useLogInteractionMutation,
  useUpdateInteractionMutation,
  useDeleteInteractionMutation,
  useSendChatMessageMutation,
  useSignupMutation,
  useLoginMutation
} = crmApi;
