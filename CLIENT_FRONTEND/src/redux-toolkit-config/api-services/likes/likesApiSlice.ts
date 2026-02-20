import { ILike } from "../../../types/types";
import { apiSlice } from "../apiSlice";

export const likesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLikes: builder.query<ILike[], number>({
      query: (postId) => ({ url: `/likes/?postId=${postId}`, method: "GET" }),
      providesTags: (result, _err, postId) =>
        result
          ? [
              { type: "likes" as const, id: postId }, //  ID tag for the post with the given id
              ...result.map((like) => ({
                type: "likes" as const,
                id: like.id, // individual id tag for each like
              })),
            ]
          : [{ type: "likes" as const, id: postId }],
    }),
    handleLikeAndUnlike: builder.mutation<
      ILike,
      { userId: number; postId: number }
    >({
      query: (body) => ({
        url: `/likes/?postId=${body.postId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "likes", id: arg.postId }, // refetches likes for this post
      ],
    }),
  }),
});

export const { useGetAllLikesQuery, useHandleLikeAndUnlikeMutation } =
  likesApiSlice;
