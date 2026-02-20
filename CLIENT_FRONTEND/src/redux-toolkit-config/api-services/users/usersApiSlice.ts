import { IUser } from "../../../types/types";
import { apiSlice } from "../apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommentAuthor: builder.query<IUser, number>({
      query: (commentId) => ({
        url: `/users/findCommentAuthor/${commentId}/`,
        method: "GET",
      }),
      providesTags: (result) =>
        // if the user is returned, provide the id of the user as cache tag
        result ? [{ type: "users" as const, id: result.id }] : [],
    }),
    getPostAuthor: builder.query<IUser, number>({
      query: (postId) => ({
        url: `/users/findPostAuthor/${postId}/`,
        method: "GET",
      }),
      providesTags: (result) =>
        // if the user is returned, provide the id of the user as cache tag
        result ? [{ type: "users" as const, id: result.id }] : [],
    }),
    getUser: builder.query<IUser, number>({
      query: (userId) => ({
        url: `/users/findUser/${userId}/`,
        method: "GET",
      }),
      providesTags: (_res, _err, userId) => [
        { type: "users" as const, id: userId },
      ],
    }),
    updateUser: builder.mutation<{ user: IUser }, FormData>({
      query: (body) => ({
        url: "/users/update/",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result) =>
        result?.user ? [{ type: "users", id: result.user.id }] : [],
    }),
  }),
});

export const {
  // useGetCommentAuthorQuery, // not used anymore
  // useGetPostAuthorQuery, // not used anymore
  useGetUserQuery,
  useUpdateUserMutation,
} = usersApiSlice;
