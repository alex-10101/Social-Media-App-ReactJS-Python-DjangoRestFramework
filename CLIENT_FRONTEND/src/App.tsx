import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddPost from "./pages/AddPost";
import { useEffect } from "react";
import PersistLogin from "./components/authComponents/PersistLogin";
import { PrivateOutlet } from "./components/authComponents/PrivateOutlet";
import DeleteAccount from "./pages/authPages/DeleteAccount";
import ChangePassword from "./pages/authPages/ChangePassword";
import Register from "./pages/authPages/Register";
import Login from "./pages/authPages/Login";

function App() {
  // When the component mounts, get the CSRF cookie.
  useEffect(() => {
    async function getCSRFCookie() {
      try {
        const result = await fetch(
          "http://localhost:8000/api/auth/csrf_cookie/",
          {
            method: "GET",
            credentials: "include",
          },
        );
        await result.json();
      } catch (err) {
        console.log(err);
      }
    }

    getCSRFCookie();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route element={<PrivateOutlet />}>
              <Route index element={<Home />} />
              <Route path="deleteAccount" element={<DeleteAccount />} />
              <Route path="resetPassword" element={<ChangePassword />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="addPost" element={<AddPost />} />
            </Route>
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
