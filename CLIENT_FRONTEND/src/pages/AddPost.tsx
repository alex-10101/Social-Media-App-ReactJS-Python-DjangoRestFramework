import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useAppSelector } from "../redux-toolkit-config/hooks";
import { useNavigate } from "react-router-dom";
import FetchBaseError from "../components/FetchBaseError";
import { useAddPostMutation } from "../redux-toolkit-config/api-services/posts/postsApiSlice";

/**
 *
 * @returns A page, where a user can add a post
 */
function AddPost() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [postDescription, setPostDescription] = useState("");
  const [addPost, { error: addPostError }] = useAddPostMutation();
  const currentUser = useAppSelector((state) => state.auth.user);

  /**
   * Make a POST request to add a post description, or a file or both to the server
   * when a user clicks the "Add post" button.
   * @param e
   */
  async function handleUploadPost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();

    let formData = new FormData();

    if (file) {
      formData.append("img", file);
    }

    if (postDescription) {
      formData.append("postDescription", postDescription);
    }

    await addPost(formData).unwrap();

    // @ts-ignore
    if (addPostError && addPostError.data.detail) {
      return;
    }

    navigate("/");
  }

  return (
    <Container className="my-5">
      <h1>Upload a post</h1>
      <Form>
        {/* form for uploading text to the server */}
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="user_name"
            value={postDescription}
            placeholder={`What is on your mind ${currentUser?.username} ?`}
            onChange={(e) => setPostDescription(e.target.value)}
          />
        </Form.Group>

        {/* form for uploading files to the server */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFile(e.target.files![0])
            }
          />
        </Form.Group>

        {/* show this paragraph if an error occured while adding the post */}
        {addPostError && <FetchBaseError error={addPostError} />}

        {/* the button to add a post */}
        <Button variant="primary" type="submit" onClick={handleUploadPost}>
          Add post
        </Button>
      </Form>
    </Container>
  );
}

export default AddPost;
