import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux-toolkit-config/hooks";
import { useLoginUserMutation } from "../../redux-toolkit-config/api-services/auth/authApiSlice";
import { setCredentials } from "../../redux-toolkit-config/slices/authSlice";
import Loading from "../../components/Loading";
import FetchBaseError from "../../components/FetchBaseError";

/**
 *
 * @returns a page where a user can login with email and password
 */
function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { error, isLoading }] = useLoginUserMutation();

  /**
   * Make a POST request to log in when the user clicks the "Login" button.
   * @param e
   */
  async function handleLogin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    const loginData = await login({ email, password }).unwrap();
    dispatch(setCredentials({ ...loginData }));
    navigate("/");
  }

  const user = useAppSelector((state) => state.auth.user);

  // check when the component mounts if the user is authenticated. If yes redirect him to the home page.
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    // Center the container (which contains the Form and the h1 tag) horizontally and vertically,
    // and align items in a "column" direction (from top to bottom).
    <Container className="d-flex min-vh-100 justify-content-center align-items-center flex-column">
      <h1>Login</h1>
      <Form>
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Text className="text-muted">
            Did not register yet? Navigate to{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Register Page
            </Link>
          </Form.Text>
        </Form.Group>

        {error && <FetchBaseError error={error} />}

        <Button variant="primary" type="submit" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
