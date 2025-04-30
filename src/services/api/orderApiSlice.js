import { apiCore } from './apiCore';

export const orderSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ customerName = '', searchTerm = '', page = 1, limit = 10 }) =>
        `/restricted/api/v1/orders/all?c=${customerName}&q=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: ['Orders'],
    }),
    getDetailOrder: builder.query({
      query: ({ id }) => `/restricted/api/v1/orders/all/${id}`,
      providesTags: ['Orders'],
    }),
  }),
});

export const { useGetOrdersQuery, useGetDetailOrderQuery } = orderSlice;
