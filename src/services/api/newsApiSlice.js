import { apiCore } from './apiCore';

export const newsSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getNewsList: builder.query({
      query: ({ page, limit = 10, order, sort }) =>
        `/restricted/api/v1/news?page=${page}&limit=${limit}&order&sort`,
      providesTags: ['News'],
    }),
    addNewNews: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/news',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation({
      query: (body) => ({
        url: '/restricted/api/v1/news',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['News'],
    }),
    deleteNews: builder.mutation({
      query: ({ id }) => {
        console.log("deleteNews",id);
        return {
          url: `restricted/api/v1/news/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['News'],
    }),
  }),
});

export const {
  useGetNewsListQuery,
  useAddNewNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsSlice;
