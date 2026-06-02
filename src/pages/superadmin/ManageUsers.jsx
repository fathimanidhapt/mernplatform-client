import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";
import "./ManageUsers.css";

const ManageUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole !== "superadmin") {
            toast.error("Access denied. Super Admins only.");
            navigate("/Home");
        }
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/superadmin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleToggleBlockUser = async (userId, name, currentBlockedState) => {
        const actionLabel = currentBlockedState ? "unblock" : "block";
        Swal.fire({
            title: `${currentBlockedState ? 'Unblock' : 'Block'} User?`,
            text: `Are you sure you want to ${actionLabel} ${name}?`,
            position: "top",
            width: "280px",
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionLabel}`,
            cancelButtonText: "Cancel",
            background: "#ffffff",
            color: "#1e293b",
            customClass: {
                popup: "admin-swal-popup",
                title: "admin-swal-title",
                htmlContainer: "admin-swal-html",
                confirmButton: "admin-swal-confirm",
                cancelButton: "admin-swal-cancel"
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:3000/api/superadmin/users/${userId}/block`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    Swal.fire({
                        title: currentBlockedState ? "Unblocked" : "Blocked",
                        text: `${name} has been ${currentBlockedState ? 'unblocked' : 'blocked'} successfully.`,
                        position: "top",
                        width: "280px",
                        confirmButtonText: "OK",
                        background: "#ffffff",
                        color: "#1e293b",
                        customClass: {
                            popup: "admin-swal-popup",
                            title: "admin-swal-title",
                            htmlContainer: "admin-swal-html",
                            confirmButton: "admin-swal-confirm"
                        },
                        buttonsStyling: false
                    });
                    fetchUsers();
                } catch (error) {
                    console.error("Error blocking/unblocking user:", error);
                    toast.error(`Failed to ${actionLabel} user`);
                }
            }
        });
    };

    const handleDeleteUser = async (userId, name) => {
        Swal.fire({
            title: "Delete Account?",
            text: `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
            position: "top",
            width: "280px",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            background: "#ffffff",
            color: "#1e293b",
            customClass: {
                popup: "admin-swal-popup",
                title: "admin-swal-title",
                htmlContainer: "admin-swal-html",
                confirmButton: "admin-swal-confirm",
                cancelButton: "admin-swal-cancel"
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/api/superadmin/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire({
                        title: "Deleted",
                        text: "Account has been successfully deleted.",
                        position: "top",
                        width: "280px",
                        confirmButtonText: "OK",
                        background: "#ffffff",
                        color: "#1e293b",
                        customClass: {
                            popup: "admin-swal-popup",
                            title: "admin-swal-title",
                            htmlContainer: "admin-swal-html",
                            confirmButton: "admin-swal-confirm"
                        },
                        buttonsStyling: false
                    });
                    fetchUsers();
                } catch (error) {
                    console.error("Error deleting user:", error);
                    toast.error("Failed to delete user");
                }
            }
        });
    };

    const standardUsers = users.filter(user =>
        user.role === "user" &&
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <SuperAdminLayout>
            <div className="super-header-section">
                <h1 className="super-page-title">Manage  Users</h1>
                <div className="super-search-wrapper">
                    <input
                        type="text"
                        placeholder="Search standard users by name or email..."
                        className="super-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="super-table-card">
                {loading ? (
                    <div className="table-loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="super-custom-table">
                            <thead>
                                <tr>
                                    <th>User Info</th>
                                    <th>Email Address</th>
                                    <th>Headline</th>
                                    <th>Location</th>
                                    <th>Current Company</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standardUsers.length > 0 ? (
                                    standardUsers.map((user) => {
                                        const initials = user.name ? user.name.slice(0, 2).toUpperCase() : "US";
                                        return (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className="table-user-cell">
                                                        {user.profilePic ? (
                                                            <img src={user.profilePic} alt="User Avatar" className="table-avatar" />
                                                        ) : (
                                                            <div className="table-avatar-placeholder">{initials}</div>
                                                        )}
                                                        <span className="table-user-name">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td className="truncate-cell" title={user.headline}>{user.headline || "N/A"}</td>
                                                <td>{user.location || "N/A"}</td>
                                                <td>{user.company || "N/A"}</td>
                                                <td>
                                                    <div className="action-buttons-group">
                                                        <button
                                                            className={`action-btn ${user.isBlocked ? "promote-btn" : "demote-btn"}`}
                                                            onClick={() => handleToggleBlockUser(user._id, user.name, user.isBlocked)}
                                                        >
                                                            {user.isBlocked ? "Unblock" : "Block User"}
                                                        </button>
                                                        <button
                                                            className="action-btn delete-btn"
                                                            onClick={() => handleDeleteUser(user._id, user.name)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-data-cell">No registered standard users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
};

export default ManageUsers;
