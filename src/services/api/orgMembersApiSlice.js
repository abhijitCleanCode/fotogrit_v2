import { apiCore } from "./apiCore";

export const organizationMembersApiSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationMembersList: builder.query({
      query: ({ page = 1, limit = 100, searchTerm = "", org }) => {
        return `/restricted/api/v1/org-members?page=${page}&limit=${limit}&q=${searchTerm}&org=${org}`;
      },
      //   providesTags: ["OrganizationMembers"],
    }),
  }),
});

export const { useGetOrganizationMembersListQuery } =
  organizationMembersApiSlice;
