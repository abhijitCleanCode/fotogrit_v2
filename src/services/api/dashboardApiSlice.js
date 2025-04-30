import { apiCore } from './apiCore';

export const dashboardSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getMediaSales: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/media-sales?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTopSalesByUser: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/top-sales-by-user?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTopSalesByClub: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/top-sales-by-club?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTopSalesByEventGroup: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/top-sales-by-event-group?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTotalUserSignups: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/users/signups?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTotalUserActives: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/users/actives?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTotalUserPurchases: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/users/orders?period=${period}`,
      providesTags: ['Dashboard'],
    }),
    getTotalFaceRecognitions: builder.query({
      query: ({ period }) => 
        `/restricted/api/v1/report/dashboards/face-recognitions?period=${period}`,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetMediaSalesQuery,
  useGetTopSalesByUserQuery,
  useGetTopSalesByClubQuery,
  useGetTopSalesByEventGroupQuery,
  useGetTotalUserSignupsQuery,
  useGetTotalUserActivesQuery,
  useGetTotalUserPurchasesQuery,
  useGetTotalFaceRecognitionsQuery,
} = dashboardSlice; 
