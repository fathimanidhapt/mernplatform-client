import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";
import "./ManagePosts.css";

const ManagePosts = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/posts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching platform posts:", error);
            toast.error("Failed to load platform posts");
        } finally {
            setLoading(false);
        }
    };

    const handleViewImage = (base64Data) => {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
                <html>
                    <head>
                        <title>View Post Media</title>
                        <style>
                            body {
                                margin: 0;
                                background-color: #0f172a;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                            }
                            img {
                                max-width: 100%;
                                max-height: 100vh;
                                object-fit: contain;
                                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${base64Data}" alt="Post Media" />
                    </body>
                </html>
            `);
            newWindow.document.close();
        }
    };

    useEffect(() => {
        if (token) {
            fetchPosts();
        }
    }, [token]);

    const handleDeletePost = async (postId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
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
                    await axios.delete(`http://localhost:3000/api/posts/${postId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire({
                        title: "Deleted",
                        text: "Post has been deleted.",
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
                    fetchPosts();
                } catch (error) {
                    console.error("Error deleting post:", error);
                    toast.error("Failed to delete post");
                }
            }
        });
    };

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
                    fetchPosts();
                } catch (error) {
                    console.error("Error blocking/unblocking user:", error);
                    toast.error(`Failed to ${actionLabel} user`);
                }
            }
        });
    };

    return (
        <SuperAdminLayout>
            <div className="super-header-section">
                <h1 className="super-page-title">Manage Platform Posts</h1>
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
                                    <th>Author</th>
                                    <th>Post Description</th>
                                    <th>Media Link</th>
                                    <th>Likes Count</th>
                                    <th>Comments Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.length > 0 ? (
                                    posts.map((post) => {
                                        const initials = post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : "U";
                                        return (
                                            <tr key={post._id}>
                                                <td>
                                                    <div className="table-user-cell">
                                                        {post.author?.profilePic ? (
                                                            <img src={post.author.profilePic} alt="Author Avatar" className="table-avatar" />
                                                        ) : (
                                                            <div className="table-avatar-placeholder">{initials}</div>
                                                        )}
                                                        <div className="table-author-info">
                                                            <span className="table-user-name">{post.author?.name}</span>
                                                            <span className="table-author-role-badge">({post.author?.role})</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="truncate-cell" title={post.content}>{post.content}</td>
                                                <td>
                                                    {post.image ? (
                                                        <span
                                                            onClick={() => handleViewImage(post.image)}
                                                            className="table-image-link"
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            View Post
                                                        </span>
                                                    ) : (
                                                        <span className="no-media-label">No Attachment</span>
                                                    )}
                                                </td>
                                                <td>{post.likes?.length || 0} Likes</td>
                                                <td>{post.comments?.length || 0} Comments</td>
                                                <td>
                                                    <div className="action-buttons-group">
                                                        <button
                                                            className={`action-btn ${post.author?.isBlocked ? "promote-btn" : "demote-btn"}`}
                                                            onClick={() => handleToggleBlockUser(post.author?._id, post.author?.name, post.author?.isBlocked)}
                                                            disabled={post.author?.role === "superadmin"}
                                                        >
                                                            {post.author?.isBlocked ? "Unblock" : "Block User"}
                                                        </button>
                                                        <button
                                                            className="action-btn delete-btn"
                                                            onClick={() => handleDeletePost(post._id)}
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
                                        <td colSpan="6" className="no-data-cell">No platform posts found.</td>
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

export default ManagePosts;
