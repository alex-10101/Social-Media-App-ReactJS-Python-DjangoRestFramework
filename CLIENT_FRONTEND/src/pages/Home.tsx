import Container from "react-bootstrap/Container";
import Post from "../components/Post";
import Loading from "../components/Loading";
import FetchBaseError from "../components/FetchBaseError";
import Button from "react-bootstrap/Button";
import { useGetAllPostsInfiniteQuery } from "../redux-toolkit-config/api-services/posts/postsApiSlice";

/**
 *
 * @returns Component which represents the home page and displays all the posts.
 */
function Home() {
  const {
    data,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetAllPostsInfiniteQuery();

  if (error) {
    return <FetchBaseError error={error} />;
  }

  if (isLoading || !data) {
    return <Loading />;
  }

  const allPosts = data.pages.flatMap((page) => page.results);
  // const hasNextPage = Boolean(data.pages[data.pages.length - 1].next);

  return (
    <Container>
      {allPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      <div className="d-flex gap-2 mt-3 justify-content-center">
        <Button
          disabled={!hasNextPage || isFetching}
          onClick={() => fetchNextPage()}
        >
          {isFetching
            ? "Loading..."
            : hasNextPage
              ? "Load more"
              : "No more posts"}
        </Button>

        <Button disabled={isFetching} onClick={() => refetch()}>
          Refetch
        </Button>
      </div>
    </Container>
  );
}

export default Home;
