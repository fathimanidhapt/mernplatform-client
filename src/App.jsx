import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signpage from "./pages/Signup";
import Login from "./pages/Login";
import Homefeed from "./pages/user/Homefeed";
import Profile from "./pages/user/Profile";
import Post from "./pages/user/Post";
import Connection from "./pages/user/Connection";
import Notifications from "./pages/user/Notifications";
import Viewuser from "./pages/admin/Viewuser";
import Viewpost from "./pages/admin/Viewpost";
import ManageUsers from "./pages/superadmin/ManageUsers";
import ManageAdmins from "./pages/superadmin/ManageAdmins";
import Stats from "./pages/superadmin/Stats";
import ManagePosts from "./pages/superadmin/ManagePosts";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/Sign" element={<Signpage />} />
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Homefeed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<Post />} />
        <Route path="/network" element={<Connection />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin/users" element={<Viewuser />} />
        <Route path="/admin/posts" element={<Viewpost />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/users" element={<ManageUsers />} />
        <Route path="/superadmin/admins" element={<ManageAdmins />} />
        <Route path="/superadmin/posts" element={<ManagePosts />} />
        <Route path="/superadmin/stats" element={<Stats />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        icon={false}
      />
    </>
  );
};

export default App;