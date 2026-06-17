import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Userlayout from "../../components/layout/UserLayout";
import "./Homefeed.css";
import {
    IoHeart,
    IoHeartOutline,
    IoChatbubbleOutline,
    IoSend,
    IoImagesOutline,
    IoLocationOutline,
    IoBriefcaseOutline,
    IoPeopleOutline
} from "react-icons/io5";

const Homefeed = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentInputs, setCommentInputs] = useState({});
    const [visibleComments, setVisibleComments] = useState({});
    const [connections, setConnections] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    const token = localStorage.getItem("token");

    const handleConnect = async (authorId) => {
        const sentReq = sentRequests.find(r => r.receiverId === authorId);
        if (sentReq) {
            try {
                await axios.delete(`http://localhost:3000/api/connections/request/${sentReq._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.dismiss();
                toast.info("Connection request cancelled");
                const sentResponse = await axios.get("http://localhost:3000/api/connections/sent", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSentRequests(sentResponse.data);
            } catch (error) {
                console.error("Error cancelling request:", error);
                toast.dismiss();
                toast.error("Failed to cancel connection request");
            }
        } else {
            try {
                await axios.post(`http://localhost:3000/api/connections/request/${authorId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.dismiss();
                toast.success("Connection request sent successfully");
                const sentResponse = await axios.get("http://localhost:3000/api/connections/sent", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSentRequests(sentResponse.data);
            } catch (error) {
                console.error("Error sending connection request:", error);
                toast.dismiss();
                toast.error("Failed to send connection request");
            }
        }
    };

    const fetchFeedData = async () => {
        try {
            const userResponse = await axios.get("http://localhost:3000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userResponse.data);

            const postsResponse = await axios.get("http://localhost:3000/api/posts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(postsResponse.data);

            const connResponse = await axios.get("http://localhost:3000/api/connections", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConnections(connResponse.data);

            const sentResponse = await axios.get("http://localhost:3000/api/connections/sent", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSentRequests(sentResponse.data);

            const pendingResponse = await axios.get("http://localhost:3000/api/connections/pending", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(pendingResponse.data);
        } catch (error) {
            console.error("Error fetching feed:", error);
            toast.error("Failed to load feed updates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchFeedData();
        } else {
            navigate("/");
        }
    }, [token, navigate]);

    const handleLike = async (postId) => {
        try {
            await axios.put(`http://localhost:3000/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const postsResponse = await axios.get("http://localhost:3000/api/posts", {
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

            const postsResponse = await axios.get("http://localhost:3000/api/posts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(postsResponse.data);
            toast.success("Comment added");
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("Failed to add comment");
        }
    };

    if (loading) {
        return (
            <Userlayout>
                <div className="feed-loading">
                    <div className="spinner"></div>
                </div>
            </Userlayout>
        );
    }

    const defaultInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "P";

    return (
        <Userlayout>
            <div className="feed-outer-container">
                <div className="feed-inner-layout">
                    <aside className="feed-sidebar">
                        <div className="sidebar-profile-card">
                            <div className="sidebar-banner"></div>
                            <div className="sidebar-avatar-wrapper" onClick={() => navigate("/profile")}>
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="User profile" className="sidebar-avatar-img" />
                                ) : (
                                    <div className="sidebar-avatar-placeholder">{defaultInitials}</div>
                                )}
                            </div>
                            <div className="sidebar-profile-info">
                                <h3 className="sidebar-profile-name" onClick={() => navigate("/profile")}>
                                    {user?.name}
                                </h3>
                                <p className="sidebar-profile-headline">{user?.headline || "Professional"}</p>
                            </div>
                            <div className="sidebar-extra-stats">
                                <div className="stats-item">
                                    <div className="stats-label">
                                        <IoPeopleOutline className="stats-icon" />
                                        <span>Connections</span>
                                    </div>
                                    <span className="stats-value">{connections.length}</span>
                                </div>
                                <div className="stats-item">
                                    <div className="stats-label">
                                        <IoLocationOutline className="stats-icon" />
                                        <span>Location</span>
                                    </div>
                                    <span className="stats-value truncate-stat">{user?.location || "Not specified"}</span>
                                </div>
                                {user?.company && (
                                    <div className="stats-item">
                                        <div className="stats-label">
                                            <IoBriefcaseOutline className="stats-icon" />
                                            <span>Current Role</span>
                                        </div>
                                        <span className="stats-value truncate-stat">{user.company}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    <main className="feed-main-content">
                        <div className="feed-posts-wrapper">
                            {posts.filter(post => post.author?._id !== user?._id && post.author?.role === "user").length > 0 ? (
                                posts.filter(post => post.author?._id !== user?._id && post.author?.role === "user").map((post) => {
                                    const postAuthorInitials = post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : "U";
                                    const isLikedByMe = post.likes?.includes(user?._id);

                                    const isAlreadyConnected = connections.some(conn => conn.friendId?.toString() === post.author?._id?.toString());
                                    const isSentPending = sentRequests.some(r => r.receiverId?.toString() === post.author?._id?.toString());

                                    return (
                                        <div key={post._id} className="feed-post-card">
                                            <div className="feed-post-header">
                                                <div className="feed-post-header-left">
                                                    {post.author?.profilePic ? (
                                                        <img src={post.author.profilePic} alt="Author" className="feed-post-avatar" />
                                                    ) : (
                                                        <div className="feed-post-avatar-placeholder">{postAuthorInitials}</div>
                                                    )}
                                                    <div className="feed-post-author-details">
                                                        <span className="feed-post-author-name">{post.author?.name}</span>
                                                        <span className="feed-post-author-headline">{post.author?.headline || "Professional"}</span>
                                                        <span className="feed-post-date">
                                                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                {post.author?._id === user?._id ? null : isAlreadyConnected ? (
                                                    <button className="feed-connect-btn connected" disabled>
                                                        Connected
                                                    </button>
                                                ) : isSentPending ? (
                                                    <button
                                                        className="feed-connect-btn pending"
                                                        onClick={() => handleConnect(post.author?._id)}
                                                    >
                                                        Pending
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="feed-connect-btn"
                                                        onClick={() => handleConnect(post.author?._id)}
                                                    >
                                                        Connect
                                                    </button>
                                                )}
                                            </div>

                                            <div className="feed-post-body">
                                                <p className="feed-post-text">{post.content}</p>
                                                {post.image && (
                                                    <div className="feed-post-attachment-container">
                                                        <img src={post.image} alt="Attachment" className="feed-post-attachment-img" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="feed-post-stats">
                                                <span className="stats-likes-count">{post.likes?.length || 0} Likes</span>
                                                <span className="stats-comments-count" onClick={() => toggleCommentsVisibility(post._id)}>
                                                    {post.comments?.length || 0} Comments
                                                </span>
                                            </div>

                                            <div className="feed-post-actions">
                                                <button
                                                    className={`feed-action-btn ${isLikedByMe ? "liked" : ""}`}
                                                    onClick={() => handleLike(post._id)}
                                                >
                                                    {isLikedByMe ? <IoHeart className="action-icon liked-icon" /> : <IoHeartOutline className="action-icon" />}
                                                    <span>Like</span>
                                                </button>
                                                <button className="feed-action-btn" onClick={() => toggleCommentsVisibility(post._id)}>
                                                    <IoChatbubbleOutline className="action-icon" />
                                                    <span>Comment</span>
                                                </button>
                                            </div>

                                            {visibleComments[post._id] && (
                                                <div className="feed-comments-section">
                                                    <form onSubmit={(e) => handleAddComment(e, post._id)} className="comment-composer-form">
                                                        {user?.profilePic ? (
                                                            <img src={user.profilePic} alt="My profile" className="commenter-avatar" />
                                                        ) : (
                                                            <div className="commenter-avatar-placeholder">{defaultInitials}</div>
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

                                                    <div className="comments-list">
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
                                                            <p className="no-comments-msg">Be the first to comment on this post.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-posts-box">
                                    <p>No feed updates available yet. Start sharing your professional thoughts to engage with your network.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </Userlayout>
    );
};

export default Homefeed;
