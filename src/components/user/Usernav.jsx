import React, { useState, useEffect, useRef } from "react";
import "./Usernav.css";
import { IoSearch, IoPeople, IoChatboxEllipses, IoNotifications, IoAddCircleOutline, IoPersonCircleOutline, IoLogOutOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Usernav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");

    useEffect(() => {
        const handleProfilePicUpdate = () => {
            setProfilePic(localStorage.getItem("profilePic") || "");
        };
        window.addEventListener("profilePicUpdated", handleProfilePicUpdate);
        return () => {
            window.removeEventListener("profilePicUpdated", handleProfilePicUpdate);
        };
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/user/search?query=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchResults(response.data);
            setShowSearchDropdown(true);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    const handleSendRequest = async (targetUserId, targetUserName) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:3000/api/connections/request/${targetUserId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Connection request sent to ${targetUserName}`);
            setSearchResults(prev => prev.map(u => u._id === targetUserId ? { ...u, requestSent: true } : u));
        } catch (error) {
            console.error("Error sending connection request:", error);
            toast.error("Failed to send connection request");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <header className="usernav-header">
            <div className="usernav-container">
                <div className="usernav-left">
                    <div className="usernav-logo" onClick={() => navigate("/Home")}>
                        M
                    </div>
                    <span className="usernav-title" onClick={() => navigate("/Home")}>
                        MERN Platform
                    </span>
                </div>

                <nav className="usernav-right">
                    <div className="usernav-search-container" ref={searchRef}>
                        <div className="usernav-search">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search users by name..."
                                className="search-input"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                            />
                        </div>
                        {showSearchDropdown && searchResults.length > 0 && (
                            <div className="search-dropdown-card">
                                {searchResults.map((user) => {
                                    const initials = user.name ? user.name.slice(0, 2).toUpperCase() : "U";
                                    return (
                                        <div key={user._id} className="search-result-row">
                                            <div
                                                className="search-result-left"
                                                onClick={() => {
                                                    setSearchQuery(user.name);
                                                    navigate(`/user/${user._id}`);
                                                    setShowSearchDropdown(false);
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {user.profilePic ? (
                                                    <img src={user.profilePic} alt="Avatar" className="search-result-avatar" />
                                                ) : (
                                                    <div className="search-result-avatar-placeholder">{initials}</div>
                                                )}
                                                <div className="search-result-details">
                                                    <span className="search-result-name">{user.name}</span>
                                                    <span className="search-result-headline">{user.headline}</span>
                                                </div>
                                            </div>
                                            <div className="search-result-actions">
                                                {user.requestSent ? (
                                                    <span className="sent-indicator">Sent</span>
                                                ) : (
                                                    <button
                                                        className="search-connect-btn"
                                                        onClick={() => handleSendRequest(user._id, user.name)}
                                                    >
                                                        Connect
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div
                        className={`usernav-link ${location.pathname === "/Home" ? "active" : ""}`}
                        onClick={() => navigate("/Home")}
                    >
                        <AiFillHome className="nav-icon" />
                        <span className="nav-text">Home</span>
                    </div>

                    {localStorage.getItem("role") === "admin" && (
                        <div
                            className={`usernav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
                            onClick={() => navigate("/admin/users")}
                        >
                            <IoShieldCheckmarkOutline className="nav-icon" />
                            <span className="nav-text">Admin</span>
                        </div>
                    )}

                    <div
                        className={`usernav-link ${location.pathname === "/network" ? "active" : ""}`}
                        onClick={() => navigate("/network")}
                    >
                        <IoPeople className="nav-icon" />
                        <span className="nav-text">Connections</span>
                    </div>

                    <div
                        className={`usernav-link ${location.pathname === "/create-post" ? "active" : ""}`}
                        onClick={() => navigate("/create-post")}
                    >
                        <IoAddCircleOutline className="nav-icon" />
                        <span className="nav-text">Create Post</span>
                    </div>

                    <div
                        className={`usernav-link ${location.pathname === "/notifications" ? "active" : ""}`}
                        onClick={() => navigate("/notifications")}
                    >
                        <IoNotifications className="nav-icon" />
                        <span className="nav-text">Notifications</span>
                    </div>

                    <div
                        className={`usernav-link ${location.pathname === "/profile" ? "active" : ""}`}
                        onClick={() => navigate("/profile")}
                    >
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="usernav-avatar"
                            />
                        ) : (
                            <IoPersonCircleOutline className="nav-icon" />
                        )}
                        <span className="nav-text">Profile</span>
                    </div>

                    <div
                        className="usernav-link"
                        onClick={handleLogout}
                        style={{ color: "#ef4444" }}
                    >
                        <IoLogOutOutline className="nav-icon" />
                        <span className="nav-text" style={{ color: "#ef4444" }}>Logout</span>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Usernav;
