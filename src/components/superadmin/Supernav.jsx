import React from "react";
import "./Supernav.css";
import { IoPeople, IoShield, IoBarChart, IoLogOutOutline, IoKeyOutline, IoDocumentText } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Supernav = () => {
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
        <header className="supernav-header">
            <div className="supernav-container">
                <div className="supernav-left">
                    <div className="supernav-logo" onClick={() => navigate("/superadmin/users")}>
                        <span>Super Admin Panel</span>
                    </div>
                </div>

                <nav className="supernav-right">
                    <div
                        className={`supernav-link ${location.pathname === "/superadmin/users" ? "active" : ""}`}
                        onClick={() => navigate("/superadmin/users")}
                    >
                        <IoPeople className="nav-icon" />
                        <span className="nav-text">Manage Users</span>
                    </div>

                    <div
                        className={`supernav-link ${location.pathname === "/superadmin/admins" ? "active" : ""}`}
                        onClick={() => navigate("/superadmin/admins")}
                    >
                        <IoShield className="nav-icon" />
                        <span className="nav-text">Manage Admins</span>
                    </div>

                    <div
                        className={`supernav-link ${location.pathname === "/superadmin/posts" ? "active" : ""}`}
                        onClick={() => navigate("/superadmin/posts")}
                    >
                        <IoDocumentText className="nav-icon" />
                        <span className="nav-text">Manage Posts</span>
                    </div>

                    <div
                        className={`supernav-link ${location.pathname === "/superadmin/stats" ? "active" : ""}`}
                        onClick={() => navigate("/superadmin/stats")}
                    >
                        <IoBarChart className="nav-icon" />
                        <span className="nav-text">Statistics</span>
                    </div>

                    <div
                        className="supernav-link supernav-logout"
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

export default Supernav;
