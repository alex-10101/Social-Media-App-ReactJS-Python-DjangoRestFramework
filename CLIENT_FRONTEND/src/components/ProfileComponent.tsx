import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux-toolkit-config/hooks";
import NoProfilePic from "/img/No_image_available.svg.png";
import NoCoverPic from "/img/no-picture-available-icon-1.png";
import { IUser } from "../types/types";
import FetchBaseError from "./FetchBaseError";
import {
  useCreateAndDeleteRelationshipMutation,
  useGetRelationshipQuery,
} from "../redux-toolkit-config/api-services/relationships/relationshipsApiSlice";

/**
 *
 * @param param0
 * @returns A component, which displays the profile of a user
 */
function ProfileComponent({ user }: { user: IUser }) {
  const navigate = useNavigate();

  const { data: relationship, error: relationshipError } =
    useGetRelationshipQuery(user.id);

  const [
    handleCreateAndDeleteRelationship,
    { error: createAndDeleteRelationshipError },
  ] = useCreateAndDeleteRelationshipMutation();

  const currentUser = useAppSelector((state) => state.auth.user);

  /**
   * Make a POST request to add or remove a relationship from the database.
   */
  async function handleFollowAndUnfollow() {
    await handleCreateAndDeleteRelationship(user.id);
  }

  /**
   * Redirects the user to the edit account page when the user clicks the "Edit Account" button.
   */
  function handleGoToEditAccountPage() {
    navigate(`/edit`);
  }

  if (relationshipError) {
    return <FetchBaseError error={relationshipError} />;
  }

  return (
    user && (
      <Container className="d-flex justify-content-center">
        <Card>
          <div>
            <Image src={user?.coverPicture || NoCoverPic} fluid width="100%" />
          </div>

          {/* overlap the cover picutre with the profile picture, center the profile picture horizontally */}
          <div className="position-relative text-center">
            <div
              className="position-absolute"
              style={{
                top: "-40px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {/* show the profile picture of the user or an alternative image if the user does not have any profile picture*/}
              <Image
                src={user?.profilePicture || NoProfilePic}
                style={{ height: "80px", width: "80px", marginTop: "2px" }}
                roundedCircle
                fluid
              />
            </div>
          </div>

          <div className="mt-5 text-center">
            <h4 className="mb-3">{user?.username}</h4>

            {/* show the user's city and website (if it has any)  */}
            <Container>
              <Row>
                {user?.city && (
                  <Col>
                    <div>
                      <h6 className="mb-0 fw-bold">City</h6>
                      <p>{user?.city}</p>
                    </div>
                  </Col>
                )}

                {user?.website && (
                  <Col>
                    <div>
                      <h6 className="mb-0 fw-bold">Website</h6>
                      <p>{user?.website} </p>
                    </div>
                  </Col>
                )}
              </Row>
            </Container>

            {currentUser?.id === user.id ? (
              // show 'edit account' button if the id of the user from the url is the id of the user making the request
              <Button
                className="rounded mb-4"
                onClick={handleGoToEditAccountPage}
              >
                Edit Account
              </Button>
            ) : (
              <>
                {/* show 'follow' button if the id of the user from the url is the
              id of a different user */}
                <Button
                  className="rounded mb-4"
                  onClick={handleFollowAndUnfollow}
                >
                  {/*  show 'follow' text if the user is not already followed, else show different text */}
                  {relationship?.followerUser === currentUser?.id
                    ? "Following. Click to Unfollow"
                    : "Follow"}
                </Button>
                {createAndDeleteRelationshipError && (
                  <FetchBaseError error={createAndDeleteRelationshipError} />
                )}
              </>
            )}
          </div>
        </Card>
      </Container>
    )
  );
}

export default ProfileComponent;
