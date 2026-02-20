import { Button, Container, Form } from "react-bootstrap";
import { IUser } from "../types/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux-toolkit-config/hooks";
import FetchBaseError from "./FetchBaseError";
import { setCredentials } from "../redux-toolkit-config/slices/authSlice";
import { useUpdateUserMutation } from "../redux-toolkit-config/api-services/users/usersApiSlice";

/**
 *
 * @param param0
 * @returns A form, with wich the user can update his/her account (profile picture, cover picture, city, website)
 */
function EditProfileForm({ user }: { user: IUser }) {
  const navigate = useNavigate();

  const [updateUser, { error: updateUserError }] = useUpdateUserMutation();

  const dispatch = useAppDispatch();

  const [userProperties, setUserProperties] = useState({
    username: user.username,
    city: user.city,
    website: user.website,
  });

  const [cover, setCover] = useState<File | null>(null);
  const [profile, setProfile] = useState<File | null>(null);

  function handleChangeUserProperties(e: React.ChangeEvent<HTMLInputElement>) {
    setUserProperties({
      ...userProperties,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Make POST request to update the properties (e.g. cover picture, or profile picture, or city, or website, or...)
   * and then redirect the user to the user profile page.
   * @param e
   */
  async function handleEditUser(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    // prevent page refresh when submitting form
    e.preventDefault();

    const formData = new FormData();

    // Object.entries(userProperties).forEach(([key, value]) => {
    //   formData.append(key, value);
    // });

    formData.append("username", userProperties.username ?? "");
    formData.append("city", userProperties.city ?? "");
    formData.append("website", userProperties.website ?? "");

    if (cover) {
      formData.append("coverPicture", cover);
    }

    if (profile) {
      formData.append("profilePicture", profile);
    }

    // send the 'body' to the server. The server updates the user with these values.
    const updatedUser = await updateUser(formData).unwrap();

    // send the updated user data to the global state
    // dispatch(
    //   updateUserProperties({
    //     ...userProperties,
    //     coverPicture: cover?.toString() || "",
    //     profilePicture: profile?.toString() || "",
    //   }),
    // );

    dispatch(
      setCredentials({
        ...updatedUser,
      }),
    );

    console.log(updatedUser);

    // navigate to the user profile page
    navigate(`/profile/${user.id}`);
  }

  return (
    <Container className="my-5">
      <h1>Edit Account</h1>
      <Form>
        {/* form for sending text to the server */}
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userProperties.username}
            placeholder="Enter new username"
            onChange={handleChangeUserProperties}
          />
        </Form.Group>

        {/* form for sending text to the server */}
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={userProperties.city}
            placeholder="Enter new city"
            onChange={handleChangeUserProperties}
          />
        </Form.Group>

        {/* form for sending text to the server */}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="text"
            name="website"
            value={userProperties.website}
            placeholder="Enter new website"
            onChange={handleChangeUserProperties}
          />
        </Form.Group>

        {/* form for sending files to the server */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Cover Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCover(e.target.files![0])
            }
          />
        </Form.Group>

        {/* form for sending files to the server */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfile(e.target.files![0])
            }
          />
        </Form.Group>

        {/* show error message from the server if an error occured while updating the user */}
        {updateUserError && <FetchBaseError error={updateUserError} />}

        <Button variant="primary" type="submit" onClick={handleEditUser}>
          Edit Account
        </Button>
      </Form>
    </Container>
  );
}

export default EditProfileForm;
