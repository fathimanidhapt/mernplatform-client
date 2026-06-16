import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../components/layout/AdminLayout";
import "./Viewuser.css";

const Viewuser = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        if (!token) {
            navigate("/");
        } else if (userRole !== "admin") {
            toast.error("Access denied. Admins only.");
            navigate("/Home");
        }
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/user/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const standardUsers = response.data.filter(u => u.role === "user");
            setUsers(standardUsers);
        } catch (error) {
            console.error("Error fetching platform users:", error);
            toast.error("Failed to load platform users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    return (
        <AdminLayout>

            <div className="admin-table-card">
                {loading ? (
                    <div className="table-loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-custom-table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Email Address</th>
                                    <th>Role / Status</th>
                                    <th>Headline</th>
                                    <th>Location</th>
                                    <th>Current Company</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => {
                                        const initials = user.name ? user.name.slice(0, 2).toUpperCase() : "U";
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
                                                    <span className={`table-role-badge role-${user.role}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="truncate-cell" title={user.headline}>{user.headline || "N/A"}</td>
                                                <td>{user.location || "N/A"}</td>
                                                <td>{user.company || "N/A"}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-data-cell">No registered users exist.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Viewuser;
