import { IPost, PaginatedResponse } from "../../../types/types";
import { apiSlice } from "../apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.infiniteQuery<
      PaginatedResponse<IPost>, // type of the response
      void, // no queryArg needed for timeline
      number // pageParam can be page number
      // string | number // pageParam can be page number or a "next" url
    >({
      infiniteQueryOptions: {
        // initial page number / page parameter. First data retrieved is from page 1.
        initialPageParam: 1,

        /**
         * 
         * @param lastPage This is the API response of the most recently fetched page. With DRF pagination, a page looks like this:
            {
              "count": 42,
              "next": "http://localhost:8000/api/posts/?page=3",
              "previous": "http://localhost:8000/api/posts/?page=1",
              "results": [ ... ]
            }
         * @param _allPages This is an array of all pages fetched so far (not used here):
            [
              page1Response,
              page2Response,
              page3Response,
              ...
            ]
         * @param lastPageParam This is the page paramater / the page number that was used to fetch lastPage.
         * @returns the paramater for the next page / the next page number
         */
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
          // If Django Rest Framework (DRF) says next page is null => no more pages
          if (!lastPage.next) {
            return undefined;
          }

          // Otherwise next page number
          return lastPageParam + 1;

          // Pass the full next URL as pageParam (next is a string, the next page URL, returned by the server, here Django Rest Framework)
          // return lastPage.next;
        },
      },

      /**
       * @param pageParam: The page number / parameter returned by the getNextPageParam() function.
       * @returns the data for the page identified by pageParam.
       *
       * First, the query returns the data from page 1 (because initialPageParam = 1).
       * When fetchNextPage() is called in a component,
       * it triggers the getNextPageParam function which returns the next page parameter.
       * The pageParam in the query function is the param returned by the getNextPageParam function.
       * The query function returns the data for the page identified by pageParam.
       */
      query: ({ pageParam }) => {
        // pageParam = 1 initially, then becomes lastPage.next (a URL string)
        return { url: `/posts/?page=${pageParam}`, method: "GET" };

        // // if the page param is a string, an absolute URL, turn it into a relative API path
        // // e.g. "http://localhost:8000/api/posts?page=2" --> "/posts?page=2"
        // const u = new URL(pageParam);
        // return { url: `/posts${u.search}`, method: "GET" };
      },

      providesTags: (result) => {
        const posts = result?.pages.flatMap((page) => page.results) ?? [];
        return posts
          ? [
              ...posts.map((post) => ({ type: "posts" as const, id: post.id })),
              { type: "posts", id: "LIST" },
            ]
          : [{ type: "posts", id: "LIST" }];
      },
    }),

    addPost: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "/posts/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "posts", id: "LIST" }],
    }),

    deletePost: builder.mutation<IPost, number>({
      query: (postId) => ({
        url: `/posts/${postId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "posts", id },
        { type: "posts", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllPostsInfiniteQuery,
  useAddPostMutation,
  useDeletePostMutation,
} = postsApiSlice;
