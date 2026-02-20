import Form from "react-bootstrap/Form";
import { useState } from "react";
import { IPost } from "../types/types";
import Button from "react-bootstrap/Button";
import Comment from "./Comment";
import Loading from "./Loading";
import FetchBaseError from "./FetchBaseError";
import {
  useCreateCommentMutation,
  useGetAllCommentsInfiniteQuery,
} from "../redux-toolkit-config/api-services/comments/commentsApiSlice";

/**
 *
 * @param post
 * @returns A 'comment section', which displays all comments and allows a user to add a comment on a particular post.
 */
function CommentSection({ post }: { post: IPost }) {
  const [addComment, { error: addCommentError }] = useCreateCommentMutation();

  const {
    data,
    isLoading,
    isFetching,
    error: getAllCommentsError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetAllCommentsInfiniteQuery(post.id);
  const [comment_description, setCommentDescription] = useState("");

  /**
   * Make a POST request to add a comment on this particular post
   * when the user clicks the "Add Comment" button.
   * @param e
   */
  async function handleAddComment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    await addComment({
      post: post.id,
      commentDescription: comment_description,
    }).unwrap();
    setCommentDescription("");
  }

  const comments = data?.pages.flatMap((page) => page.results);

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            type="text"
            placeholder="Your Comment..."
            onChange={(e) => setCommentDescription(e.target.value)}
            value={comment_description}
          />
          <Button
            className="w-100"
            variant="primary"
            type="submit"
            onClick={handleAddComment}
          >
            Add Comment
          </Button>
          {addCommentError && <FetchBaseError error={addCommentError} />}
        </Form.Group>
      </Form>

      {/* display the error message from the server if an error occured */}
      {getAllCommentsError && <FetchBaseError error={getAllCommentsError} />}

      {/* show a loading spinner if data is still loading from the server */}
      {isLoading && <Loading />}

      {/* show the retrieved data */}
      {comments &&
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
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
    </>
  );
}

export default CommentSection;
