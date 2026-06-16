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
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        if (!token) {
            navigate("/");
        } else if (userRole !== "superadmin") {
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
        Swal.fire({
            title: "Create Administrator",
            html: `
                <div style="text-align: left; margin-top: 10px;">
                    <label style="font-weight: 500; font-size: 14px; color: #1e293b; display: block; margin-bottom: 4px;">Name</label>
                    <input id="swal-input-name" class="swal2-input" placeholder="Name" style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box; border-radius: 6px; border: 1px solid #cbd5e1; padding: 8px 12px; height: auto; font-size: 14px;">
                    
                    <label style="font-weight: 500; font-size: 14px; color: #1e293b; display: block; margin-bottom: 4px;">Email Address</label>
                    <input id="swal-input-email" type="email" class="swal2-input" placeholder="Email" style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box; border-radius: 6px; border: 1px solid #cbd5e1; padding: 8px 12px; height: auto; font-size: 14px;">
                    
                    <label style="font-weight: 500; font-size: 14px; color: #1e293b; display: block; margin-bottom: 4px;">Password</label>
                    <input id="swal-input-password" type="password" class="swal2-input" placeholder="Password" style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box; border-radius: 6px; border: 1px solid #cbd5e1; padding: 8px 12px; height: auto; font-size: 14px;">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Create Admin",
            cancelButtonText: "Cancel",
            position: "top",
            width: "350px",
            background: "#ffffff",
            color: "#1e293b",
            customClass: {
                popup: "admin-swal-popup",
                title: "admin-swal-title",
                htmlContainer: "admin-swal-html",
                confirmButton: "admin-swal-confirm",
                cancelButton: "admin-swal-cancel"
            },
            buttonsStyling: false,
            preConfirm: () => {
                const name = document.getElementById("swal-input-name").value;
                const email = document.getElementById("swal-input-email").value;
                const password = document.getElementById("swal-input-password").value;
                
                if (!name || !email || !password) {
                    Swal.showValidationMessage("Please fill in all fields");
                    return false;
                }
                if (password.length < 6) {
                    Swal.showValidationMessage("Password must be at least 6 characters");
                    return false;
                }
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(email)) {
                    Swal.showValidationMessage("Please enter a valid email address");
                    return false;
                }
                return { name, email, password };
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const { name, email, password } = result.value;
                try {
                    await axios.post("http://localhost:3000/api/superadmin/admins",
                        { name, email, password },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    Swal.fire({
                        title: "Admin Created",
                        text: `${name} has been successfully created as an Admin.`,
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
                    console.error("Error creating admin:", error);
                    const errMsg = error.response?.data?.message || "Failed to create admin";
                    toast.error(errMsg);
                }
            }
        });
    };



    const handleRoleChange = async (userId, name, newRole) => {
        try {
            await axios.put(`http://localhost:3000/api/superadmin/users/${userId}/role`, {
                role: newRole
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Updated role for ${name} to ${newRole} ✅`);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user role:", error);
            const errMsg = error.response?.data?.message || "Failed to update user role";
            toast.error(errMsg);
        }
    };

    const filteredUsers = users.filter(user =>
        user.role !== "superadmin" &&
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <SuperAdminLayout>
            <div className="super-header-section">
                <h1 className="super-page-title">Manage User Roles</h1>
                <div className="super-header-actions">
                    <div className="super-search-wrapper">
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
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
                                    <th>User Name</th>
                                    <th>Email Address</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
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
                                                 <td>
                                                     <select
                                                         className="role-select-dropdown"
                                                         value={user.role}
                                                         onChange={(e) => handleRoleChange(user._id, user.name, e.target.value)}
                                                         style={{
                                                             padding: "6px 12px",
                                                             borderRadius: "6px",
                                                             border: "1px solid #cbd5e1",
                                                             backgroundColor: "#ffffff",
                                                             color: "#1e293b",
                                                             fontSize: "13px",
                                                             fontWeight: "600",
                                                             outline: "none",
                                                             cursor: "pointer"
                                                         }}
                                                     >
                                                         <option value="user">User</option>
                                                         <option value="admin">Admin</option>
                                                     </select>
                                                 </td>
                                                 <td>
                                                     <div className="action-buttons-group">
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
                                        <td colSpan="4" className="no-data-cell">No registered users found.</td>
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
