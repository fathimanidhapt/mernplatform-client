import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";
import "./ManageUsers.css";

const ManageAdmins = () => {
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
            console.error("Error fetching admins:", error);
            toast.error("Failed to load administrators list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleEditUserRole = async (userId, name, currentRole) => {
        Swal.fire({
            title: "Edit User Role",
            text: `Select a new role for ${name}:`,
            input: "select",
            inputOptions: {
                user: "User",
                admin: "Admin",
                superadmin: "Super Admin"
            },
            inputValue: currentRole || "admin",
            position: "top",
            width: "280px",
            showCancelButton: true,
            confirmButtonText: "Save",
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
            if (result.isConfirmed && result.value) {
                const selectedRole = result.value;
                try {
                    await axios.put(`http://localhost:3000/api/superadmin/users/${userId}/role`,
                        { role: selectedRole },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    Swal.fire({
                        title: "Role Updated",
                        text: `${name}'s role is now ${selectedRole}.`,
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
                    console.error("Error updating user role:", error);
                    toast.error("Failed to update user role");
                }
            }
        });
    };

    const handleDeleteAdmin = async (userId, name) => {
        Swal.fire({
            title: "Delete Account?",
            text: `Are you sure you want to permanently delete administrator ${name}? This action cannot be undone.`,
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
                        text: "Administrator account deleted.",
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
                    console.error("Error deleting administrator:", error);
                    toast.error("Failed to delete administrator account");
                }
            }
        });
    };

    const handleAddAdmin = () => {
        const standardUsersList = users.filter(u => u.role === "user");

        if (standardUsersList.length === 0) {
            Swal.fire({
                title: "No users available",
                text: "There are no standard users to promote to Admin.",
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
            return;
        }

        const options = {};
        standardUsersList.forEach(u => {
            options[u._id] = `${u.name} (${u.email})`;
        });

        Swal.fire({
            title: "Add Administrator",
            text: "Select a user to promote to Admin:",
            input: "select",
            inputOptions: options,
            inputPlaceholder: "Choose a user...",
            position: "top",
            width: "280px",
            showCancelButton: true,
            confirmButtonText: "Add Admin",
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
            if (result.isConfirmed && result.value) {
                const userId = result.value;
                const selectedUser = standardUsersList.find(u => u._id === userId);
                try {
                    await axios.put(`http://localhost:3000/api/superadmin/users/${userId}/role`,
                        { role: "admin" },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    Swal.fire({
                        title: "Admin Added",
                        text: `${selectedUser.name} has been promoted to Admin.`,
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
                    console.error("Error adding admin:", error);
                    toast.error("Failed to add admin");
                }
            }
        });
    };

    const administrators = users.filter(user =>
        user.role === "admin" &&
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <SuperAdminLayout>
            <div className="super-header-section">
                <h1 className="super-page-title">Manage Admin</h1>
                <div className="super-header-actions">
                    <div className="super-search-wrapper">
                        <input
                            type="text"
                            placeholder="Search administrators by name or email..."
                            className="super-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="super-add-admin-btn" onClick={handleAddAdmin}>
                        + Add Admin
                    </button>
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
                                    <th>Admin Name</th>
                                    <th>Email Address</th>
                                    <th>Headline</th>
                                    <th>Location</th>
                                    <th>Current Company</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {administrators.length > 0 ? (
                                    administrators.map((user) => {
                                         const initials = user.name ? user.name.slice(0, 2).toUpperCase() : "AD";
                                         return (
                                             <tr key={user._id}>
                                                 <td>
                                                     <div className="table-user-cell">
                                                         {user.profilePic ? (
                                                             <img src={user.profilePic} alt="Admin Avatar" className="table-avatar" />
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
                                                             className="action-btn promote-btn"
                                                             onClick={() => handleEditUserRole(user._id, user.name, user.role)}
                                                         >
                                                             Edit
                                                         </button>
                                                         <button
                                                             className="action-btn delete-btn"
                                                             onClick={() => handleDeleteAdmin(user._id, user.name)}
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
                                        <td colSpan="6" className="no-data-cell">No registered administrators found.</td>
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

export default ManageAdmins;
