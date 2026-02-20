import { useLocation } from "react-router-dom";
import ProfileComponent from "../components/ProfileComponent";
import Loading from "../components/Loading";
import FetchBaseError from "../components/FetchBaseError";
import { useGetUserQuery } from "../redux-toolkit-config/api-services/users/usersApiSlice";

/**
 *
 * @returns Component / page which displays the user's properties (profile picture, cover picture, city, website)
 */
function Profile() {
  // get the id of the user from the url
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { data: user, isLoading, error: userError } = useGetUserQuery(userId);

  if (userError) {
    return <FetchBaseError error={userError} />;
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  return <ProfileComponent user={user} />;
}

export default Profile;
