import { apiCore } from "./apiCore";

export const organizationTypeSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationTypeList: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" }) => {
        return `/restricted/api/v1/org-types?page=${page}&limit=${limit}&q=${searchTerm}`;
      },
      providesTags: ["OrganizationType"],
    }),
    addNewOrganizationType: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/org-types`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["OrganizationType"],
    }),
  }),
});

export const {
  useGetOrganizationTypeListQuery,
  useAddNewOrganizationTypeMutation,
} = organizationTypeSlice;
