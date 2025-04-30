import { apiCore } from "./apiCore";

export const orgRelatedOrgApiSlice = apiCore.injectEndpoints({
  endpoints: (builder) => ({
    addOrgRelation: builder.mutation({
      query: (body) => ({
        url: `/restricted/api/v1/orgs`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useAddOrgRelationMutation } = orgRelatedOrgApiSlice;
