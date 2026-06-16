import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminLayout from "../../components/layout/AdminLayout";
import "./Viewpost.css";

const Viewpost = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
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
                                    <th>Product Author</th>
                                    <th>Product Description</th>
                                    <th>Image Link / Media</th>
                                    <th>Likes Count</th>
                                    <th>Comments Count</th>
                                    <th>Action</th>
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
                                                        <span className="table-user-name">{post.author?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="truncate-post-cell" title={post.content}>{post.content}</td>
                                                <td>
                                                    {post.image ? (
                                                        <a href={post.image} target="_blank" rel="noopener noreferrer" className="table-image-link">
                                                            View Post
                                                        </a>
                                                    ) : (
                                                        <span className="no-media-label">No Attachment</span>
                                                    )}
                                                </td>
                                                <td>{post.likes?.length || 0} Likes</td>
                                                <td>{post.comments?.length || 0} Comments</td>
                                                <td>
                                                    <button
                                                        className="table-delete-action-btn"
                                                        onClick={() => handleDeletePost(post._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-data-cell">No platform posts exist.</td>
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

export default Viewpost;
