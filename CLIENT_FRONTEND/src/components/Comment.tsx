import Container from "react-bootstrap/Container";
import { useAppSelector } from "../redux-toolkit-config/hooks";
import { IComment } from "../types/types";
import Button from "react-bootstrap/esm/Button";
import FetchBaseError from "./FetchBaseError";
import { useDeleteCommentMutation } from "../redux-toolkit-config/api-services/comments/commentsApiSlice";

/**
 *
 * @param comment
 * @returns A component which shows a particular comment with its author.
 */
function Comment({ comment }: { comment: IComment }) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [deleteComment, { error: deleteCommentError }] =
    useDeleteCommentMutation();

  /**
   * Make a DELETE request to delete a comment when the user clicks the "Delete Comment" button.
   * @param e
   */
  async function handleDeleteComment(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    e.preventDefault();
    await deleteComment({
      commentId: comment.id,
      postId: comment.post,
    }).unwrap();
  }

  return (
    <Container className="border mb-3 rounded">
      <h6 className="my-2">{comment.author.username}</h6>
      <p className="mb-2">{comment.commentDescription}</p>
      {/* show the delete button only if it was written by the current user */}
      {currentUser && currentUser.id === comment.user && (
        <Button
          variant="outline-danger"
          className="mb-3"
          onClick={handleDeleteComment}
        >
          Delete Comment
        </Button>
      )}

      {/* display the error message from the server if an error occured */}
      {deleteCommentError && <FetchBaseError error={deleteCommentError} />}
    </Container>
  );
}

export default Comment;
