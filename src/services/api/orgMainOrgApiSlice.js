import { apiCore } from "./apiCore";

export const MainOrganizationSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationList: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "", city = "" }) => {
        return `/restricted/api/v1/orgs?page=${page}&limit=${limit}&q=${searchTerm}&city=${city}`;
      },
      providesTags: ["MainOrganization"],
    }),
    addNewOrganization: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/orgs`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainOrganization"],
    }),
    updateOrganization: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/orgs`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainOrganization"],
    }),
    deleteOrganization: builder.mutation({
      query: ({ id }) => ({
        url: `/restricted/api/v1/orgs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MainOrganization"],
    }),
  }),
});

export const {
  useGetOrganizationListQuery,
  useAddNewOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = MainOrganizationSlice;
