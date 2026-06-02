import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Userlayout from "../../components/layout/UserLayout";
import "./Post.css";
import { 
    IoImagesOutline, 
    IoVideocamOutline, 
    IoCloseOutline, 
    IoSend 
} from "react-icons/io5";

const Post = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [postText, setPostText] = useState("");
    const [attachedImage, setAttachedImage] = useState("");
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to authenticate session. Redirecting to login...");
                navigate("/Login");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
        } else {
            navigate("/Login");
        }
    }, [token, navigate]);

    const handleImageAttachClick = () => {
        document.getElementById("post-image-input").click();
    };

    const handleImageAttachChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        const uploadData = new FormData();
        uploadData.append("image", file); 

        setUploading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/posts/upload", uploadData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            setAttachedImage(response.data.imageUrl);
            toast.success("Image attached successfully");
        } catch (error) {
            console.error("Error attaching image:", error);
            toast.error("Failed to upload image attachment");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setAttachedImage("");
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (!postText.trim() && !attachedImage) return;

        try {
            await axios.post("http://localhost:3000/api/posts", {
                content: postText,
                image: attachedImage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Post published successfully");
            navigate("/profile");
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to publish post to server");
        }
    };

    if (loading) {
        return (
            <Userlayout>
                <div className="post-loading">
                    <div className="spinner"></div>
                </div>
            </Userlayout>
        );
    }

    const defaultInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "P";

    return (
        <Userlayout>
            <div className="post-create-container">
                <div className="post-create-card">
                    <div className="post-create-header">
                        <h2>Create a post</h2>
                        <button className="post-close-btn" onClick={() => navigate("/profile")} title="Cancel">
                            <IoCloseOutline />
                        </button>
                    </div>

                    <div className="post-user-info">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="User Avatar" className="post-user-avatar" />
                        ) : (
                            <div className="post-user-avatar-placeholder">{defaultInitials}</div>
                        )}
                        <div className="post-user-details">
                            <span className="post-user-name">{user?.name}</span>
                            <span className="post-user-badge">{user?.headline || "Professional"}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitPost} className="post-create-form">
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="What do you want to talk about?"
                            className="post-composer-textarea"
                            rows="6"
                            autoFocus
                        />

                        {uploading && (
                            <div className="attachment-uploading">
                                <div className="spinner mini-spinner"></div>
                                <span>Uploading attachment...</span>
                            </div>
                        )}

                        {attachedImage && (
                            <div className="post-attachment-preview">
                                <img src={attachedImage} alt="Attachment Preview" className="preview-image" />
                                <button type="button" className="remove-attachment-btn" onClick={handleRemoveImage} title="Remove image">
                                    <IoCloseOutline />
                                </button>
                            </div>
                        )}

                        <input 
                            type="file" 
                            id="post-image-input" 
                            accept="image/*" 
                            style={{ display: "none" }} 
                            onChange={handleImageAttachChange} 
                        />

                        <div className="post-composer-toolbar">
                            <div className="toolbar-options">
                                <button type="button" className="toolbar-btn" onClick={handleImageAttachClick} title="Add a photo">
                                    <IoImagesOutline className="toolbar-icon photo-icon" />
                                    <span>Photo</span>
                                </button>
                                <button type="button" className="toolbar-btn" title="Add a video" disabled>
                                    <IoVideocamOutline className="toolbar-icon video-icon" />
                                    <span>Video</span>
                                </button>
                            </div>

                            <button 
                                type="submit" 
                                className="post-submit-action-btn" 
                                disabled={(!postText.trim() && !attachedImage) || uploading}
                            >
                                <IoSend className="send-action-icon" />
                                <span>Post</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Userlayout>
    );
};

export default Post;
