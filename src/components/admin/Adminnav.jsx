import React from "react";
import "./Adminnav.css";
import { IoPeople, IoDocumentText, IoLogOutOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Adminnav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("role");
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <header className="adminnav-header">
            <div className="adminnav-container">
                <div className="adminnav-left">
                    <div className="adminnav-logo" onClick={() => navigate("/admin/posts")}>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="adminnav-right">
                    <div
                        className={`adminnav-link ${location.pathname === "/admin/posts" ? "active" : ""}`}
                        onClick={() => navigate("/admin/posts")}
                    >
                        <IoDocumentText className="nav-icon" />
                        <span className="nav-text">View Posts</span>
                    </div>

                    <div
                        className={`adminnav-link ${location.pathname === "/admin/users" ? "active" : ""}`}
                        onClick={() => navigate("/admin/users")}
                    >
                        <IoPeople className="nav-icon" />
                        <span className="nav-text">View Users</span>
                    </div>

                    <div
                        className="adminnav-link adminnav-logout"
                        onClick={handleLogout}
                    >
                        <IoLogOutOutline className="nav-icon text-danger" />
                        <span className="nav-text text-danger">Logout</span>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Adminnav;
