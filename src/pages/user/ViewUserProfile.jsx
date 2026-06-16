import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Userlayout from "../../components/layout/UserLayout";
import "./Profile.css";
import {
    IoHeart,
    IoHeartOutline,
    IoChatbubbleOutline,
    IoBriefcaseOutline,
    IoLocationOutline,
    IoSchoolOutline,
    IoMailOutline,
    IoCallOutline,
    IoPersonOutline,
    IoCalendarOutline,
    IoSend
} from "react-icons/io5";

const ViewUserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [targetUser, setTargetUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [connections, setConnections] = useState([]);

    const [commentInputs, setCommentInputs] = useState({});
    const [visibleComments, setVisibleComments] = useState({});

    const token = localStorage.getItem("token");

    const fetchUserProfile = async () => {
        try {
            const profileResponse = await axios.get(`http://localhost:3000/api/user/profile?userId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTargetUser(profileResponse.data);

            const loggedInResponse = await axios.get("http://localhost:3000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoggedInUser(loggedInResponse.data);

            const postsResponse = await axios.get(`http://localhost:3000/api/posts/user?userId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(postsResponse.data);

            const connResponse = await axios.get(`http://localhost:3000/api/connections?userId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConnections(connResponse.data);

        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to load user profile details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && id) {
            setLoading(true);
            fetchUserProfile();
        } else if (!token) {
            navigate("/");
        }
    }, [token, id]);

    const handleLikePost = async (postId) => {
        try {
            await axios.put(`http://localhost:3000/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const postsResponse = await axios.get(`http://localhost:3000/api/posts/user?userId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(postsResponse.data);
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to update like status");
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentInputs(prev => ({
            ...prev,
            [postId]: text
        }));
    };

    const toggleCommentsVisibility = (postId) => {
        setVisibleComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleAddComment = async (e, postId) => {
        e.preventDefault();
        const text = commentInputs[postId];
        if (!text || !text.trim()) return;

        try {
            await axios.post(`http://localhost:3000/api/posts/${postId}/comment`, {
                text: text.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCommentInputs(prev => ({
                ...prev,
                [postId]: ""
            }));

            const postsResponse = await axios.get(`http://localhost:3000/api/posts/user?userId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(postsResponse.data);
            toast.success("Comment added");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
        }
    };

    if (loading) {
        return (
            <Userlayout>
                <div className="profile-loading">
                    <div className="spinner"></div>
                </div>
            </Userlayout>
        );
    }

    const defaultInitials = targetUser?.name ? targetUser.name.slice(0, 2).toUpperCase() : "P";
    const loggedInInitials = loggedInUser?.name ? loggedInUser.name.slice(0, 2).toUpperCase() : "U";

    return (
        <Userlayout>
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header-banner"></div>

                    <div className="profile-avatar-section">
                        <div className="profile-avatar-wrapper" style={{ cursor: "default" }}>
                            {targetUser?.profilePic ? (
                                <img
                                    src={targetUser.profilePic}
                                    alt="Profile Avatar"
                                    className="profile-avatar-img"
                                />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    {defaultInitials}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-details-section">
                        <div className="profile-header-content">
                            <div className="profile-main-info">
                                <h2 className="profile-name">{targetUser?.name}</h2>
                                <p className="profile-headline">{targetUser?.headline || "Professional Headline"}</p>
                                <p className="profile-location">
                                    <IoLocationOutline className="location-pin" />
                                    {targetUser?.location || "Location not specified"}
                                    <span className="divider-dot">•</span>
                                    <span className="connections-count">
                                        {connections.length} {connections.length === 1 ? "connection" : "connections"}
                                    </span>
                                </p>
                            </div>

                            <div className="profile-quick-details">
                                {targetUser?.company && (
                                    <div className="quick-item">
                                        <IoBriefcaseOutline className="quick-icon" />
                                        <span>{targetUser.company}</span>
                                    </div>
                                )}
                                {targetUser?.education && (
                                    <div className="quick-item">
                                        <IoSchoolOutline className="quick-icon" />
                                        <span>{targetUser.education}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-section-card">
                    <h3 className="section-card-title">About</h3>
                    <p className="section-card-bio">
                        {targetUser?.bio || "No professional summary added yet."}
                    </p>
                </div>

                <div className="profile-section-card">
                    <h3 className="section-card-title">Contact Information</h3>
                    <div className="registered-details-list">
                        <div className="registered-detail-item">
                            <IoPersonOutline className="detail-item-icon" />
                            <div className="detail-item-content">
                                <span className="detail-label">Registered Name</span>
                                <span className="detail-value">{targetUser?.name}</span>
                            </div>
                        </div>
                        <div className="registered-detail-item">
                            <IoMailOutline className="detail-item-icon" />
                            <div className="detail-item-content">
                                <span className="detail-label">Email Address</span>
                                <span className="detail-value">{targetUser?.email}</span>
                            </div>
                        </div>
                        <div className="registered-detail-item">
                            <IoCallOutline className="detail-item-icon" />
                            <div className="detail-item-content">
                                <span className="detail-label">Contact Number</span>
                                <span className="detail-value">{targetUser?.phone || "Not specified"}</span>
                            </div>
                        </div>
                        {targetUser?.gender && (
                            <div className="registered-detail-item">
                                <IoPersonOutline className="detail-item-icon" />
                                <div className="detail-item-content">
                                    <span className="detail-label">Gender</span>
                                    <span className="detail-value">{targetUser.gender}</span>
                                </div>
                            </div>
                        )}
                        {targetUser?.dob && (
                            <div className="registered-detail-item">
                                <IoCalendarOutline className="detail-item-icon" />
                                <div className="detail-item-content">
                                    <span className="detail-label">Date of Birth</span>
                                    <span className="detail-value">
                                        {new Date(targetUser.dob).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>
                        )}
                        {targetUser?.createdAt && (
                            <div className="registered-detail-item">
                                <IoCalendarOutline className="detail-item-icon" />
                                <div className="detail-item-content">
                                    <span className="detail-label">Member Since</span>
                                    <span className="detail-value">
                                        {new Date(targetUser.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {(targetUser?.company || targetUser?.education) && (
                    <div className="profile-section-card">
                        <h3 className="section-card-title">Experience & Education</h3>
                        <div className="section-list">
                            {targetUser?.company && (
                                <div className="section-list-item">
                                    <IoBriefcaseOutline className="list-item-icon" />
                                    <div className="list-item-details">
                                        <h4>Current Role</h4>
                                        <p>{targetUser.company}</p>
                                    </div>
                                </div>
                            )}
                            {targetUser?.education && (
                                <div className="section-list-item">
                                    <IoSchoolOutline className="list-item-icon" />
                                    <div className="list-item-details">
                                        <h4>Education</h4>
                                        <p>{targetUser.education}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="profile-section-card">
                    <div className="section-card-header">
                        <div className="section-title-wrapper">
                            <h3 className="section-card-title">Activity</h3>
                            <span className="section-followers-count">
                                {connections.length} {connections.length === 1 ? "connection" : "connections"}
                            </span>
                        </div>
                    </div>

                    <div className="posts-list">
                        {posts.length > 0 ? (
                            posts.map((post) => {
                                const isLikedByMe = loggedInUser && post.likes?.includes(loggedInUser._id);
                                return (
                                    <div key={post._id} className="post-card">
                                        <div className="post-card-header">
                                            {targetUser?.profilePic ? (
                                                <img
                                                    src={targetUser.profilePic}
                                                    alt="Author"
                                                    className="post-author-avatar"
                                                />
                                            ) : (
                                                <div className="post-author-avatar-placeholder">
                                                    {defaultInitials}
                                                </div>
                                            )}
                                            <div className="post-author-info">
                                                <span className="post-author-name">{targetUser?.name}</span>
                                                <span className="post-author-headline">{targetUser?.headline || "Professional"}</span>
                                            </div>
                                        </div>
                                        <div className="post-card-content">
                                            <p>{post.content}</p>
                                            {post.image && (
                                                <img src={post.image} alt="Post Attachment" className="post-attachment-img" />
                                            )}
                                        </div>
                                        <div className="post-card-actions">
                                            <button
                                                className={`post-action-btn ${isLikedByMe ? "liked" : ""}`}
                                                onClick={() => handleLikePost(post._id)}
                                            >
                                                {isLikedByMe ? <IoHeart className="like-icon-active" /> : <IoHeartOutline />}
                                                <span>{post.likes?.length || 0} Likes</span>
                                            </button>
                                            <button className="post-action-btn" onClick={() => toggleCommentsVisibility(post._id)}>
                                                <IoChatbubbleOutline />
                                                <span>{post.comments?.length || 0} Comments</span>
                                            </button>
                                        </div>

                                        {visibleComments[post._id] && (
                                            <div className="feed-comments-section" style={{ padding: "12px 0 0 0" }}>
                                                <form onSubmit={(e) => handleAddComment(e, post._id)} className="comment-composer-form">
                                                    {loggedInUser?.profilePic ? (
                                                        <img src={loggedInUser.profilePic} alt="My profile" className="commenter-avatar" />
                                                    ) : (
                                                        <div className="commenter-avatar-placeholder">{loggedInInitials}</div>
                                                    )}
                                                    <div className="comment-input-wrapper">
                                                        <input
                                                            type="text"
                                                            placeholder="Add a comment..."
                                                            value={commentInputs[post._id] || ""}
                                                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                                            className="comment-text-input"
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={!(commentInputs[post._id] || "").trim()}
                                                            className="comment-submit-btn"
                                                        >
                                                            <IoSend />
                                                        </button>
                                                    </div>
                                                </form>

                                                <div className="comments-list" style={{ marginTop: "12px" }}>
                                                    {post.comments && post.comments.length > 0 ? (
                                                        post.comments.map((comment) => {
                                                            const commentAuthorInitials = comment.author?.name ? comment.author.name.slice(0, 2).toUpperCase() : "C";
                                                            return (
                                                                <div key={comment._id} className="comment-item">
                                                                    {comment.author?.profilePic ? (
                                                                        <img src={comment.author.profilePic} alt="Commenter" className="comment-item-avatar" />
                                                                    ) : (
                                                                        <div className="comment-item-avatar-placeholder">{commentAuthorInitials}</div>
                                                                    )}
                                                                    <div className="comment-item-bubble">
                                                                        <div className="comment-item-header">
                                                                            <span className="commenter-name">{comment.author?.name}</span>
                                                                            <span className="commenter-headline">{comment.author?.headline || "Professional"}</span>
                                                                            <span className="comment-date">
                                                                                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                                                                    month: "short",
                                                                                    day: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })}
                                                                            </span>
                                                                        </div>
                                                                        <p className="comment-text">{comment.text}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="no-comments-msg">No comments yet.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="no-posts-msg">No activity posts yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </Userlayout>
    );
};

export default ViewUserProfile;
