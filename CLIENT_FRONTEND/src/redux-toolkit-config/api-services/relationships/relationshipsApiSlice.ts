import { IRelationship } from "../../../types/types";
import { apiSlice } from "../apiSlice";

export const relationshipsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRelationship: builder.query<IRelationship, number>({
      query: (followedUserId) => ({
        url: `/relationships/?followedUserId=${followedUserId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, followedUserId) => [
        { type: "relationships" as const, id: followedUserId },
      ],
    }),
    getAllFollowedUsers: builder.query<IRelationship[], void>({
      query: () => ({ url: "/relationships/all/", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              { type: "relationships" as const, id: "LIST" },
              ...result.map((relationship) => ({
                type: "relationships" as const,
                id: relationship.followedUser,
              })),
            ]
          : [{ type: "relationships" as const, id: "LIST" }],
    }),
    createAndDeleteRelationship: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/relationships/?userId=${userId}`,
        method: "POST",
        body: { followedUser: userId },
      }),
      invalidatesTags: (_res, _err, userId) => [
        { type: "relationships", id: userId },
        { type: "relationships", id: "LIST" },
        { type: "posts", id: "LIST" }, // timeline refresh
      ],
    }),
  }),
});

export const {
  useGetRelationshipQuery,
  useGetAllFollowedUsersQuery,
  useCreateAndDeleteRelationshipMutation,
} = relationshipsApiSlice;
