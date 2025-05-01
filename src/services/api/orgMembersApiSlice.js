import { apiCore } from "./apiCore";

export const organizationMembersApiSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationMembersList: builder.query({
      query: ({ page = 1, limit = 100, searchTerm = "", org }) => {
        return `/restricted/api/v1/org-members?page=${page}&limit=${limit}&q=${searchTerm}&org=${org}`;
      },
      providesTags: ["OrganizationMembers"],
    }),
    getUsersList: builder.query({
      query: () => {
        return `/restricted/api/v1/user?order=id&sort=asc`;
      },
      //   providedTags: ["OrganizationMembers"],
    }),
    addNewOrgMembers: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/org-members`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["OrganizationMembers"],
    }),
  }),
});

export const {
  useGetOrganizationMembersListQuery,
  useGetUsersListQuery,
  useAddNewOrgMembersMutation,
} = organizationMembersApiSlice;
