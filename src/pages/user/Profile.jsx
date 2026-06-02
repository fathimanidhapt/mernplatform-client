import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Userlayout from "../../components/layout/UserLayout";
import "./Profile.css";
import {
    IoHeart,
    IoHeartOutline,
    IoChatbubbleOutline,
    IoBriefcaseOutline,
    IoLocationOutline,
    IoSchoolOutline,
    IoCameraOutline,
    IoMailOutline,
    IoCallOutline,
    IoPersonOutline,
    IoShieldCheckmarkOutline,
    IoCalendarOutline,
    IoSend,
    IoCreateOutline,
    IoImagesOutline,
    IoCloseOutline
} from "react-icons/io5";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [posts, setPosts] = useState([]);
    const [connections, setConnections] = useState([]);
    const [newPostText, setNewPostText] = useState("");
    const [attachedImage, setAttachedImage] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        bio: "",
        profilePic: "",
        headline: "",
        location: "",
        education: "",
        company: "",
        gender: "",
        dob: ""
    });

    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
            setFormData({
                name: response.data.name || "",
                phone: response.data.phone || "",
                bio: response.data.bio || "",
                profilePic: response.data.profilePic || "",
                headline: response.data.headline || "",
                location: response.data.location || "",
                education: response.data.education || "",
                company: response.data.company || "",
                gender: response.data.gender || "",
                dob: response.data.dob || ""
            });

            const postsResponse = await axios.get("http://localhost:3000/api/posts/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(postsResponse.data);

            const connResponse = await axios.get("http://localhost:3000/api/connections", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setConnections(connResponse.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile details. Please check if server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put("http://localhost:3000/api/user/profile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
            localStorage.setItem("profilePic", response.data.profilePic || "");
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile details");
        }
    };

    const handleAvatarClick = () => {
        document.getElementById("avatar-file-input").click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        const uploadData = new FormData();
        uploadData.append("profilePic", file);

        try {
            const response = await axios.post("http://localhost:3000/api/user/upload", uploadData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            const newProfilePic = response.data.profilePic;
            setUser((prev) => ({ ...prev, profilePic: newProfilePic }));
            setFormData((prev) => ({ ...prev, profilePic: newProfilePic }));
            localStorage.setItem("profilePic", newProfilePic);
            toast.success("Profile picture updated");
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("Failed to upload profile picture");
        }
    };

    const handleModalImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        const uploadData = new FormData();
        uploadData.append("image", file); 

        setUploadingImage(true);
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
            setUploadingImage(false);
        }
    };

    const handleRemoveModalImage = () => {
        setAttachedImage("");
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostText.trim() && !attachedImage) return;

        try {
            await axios.post("http://localhost:3000/api/posts", {
                content: newPostText,
                image: attachedImage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewPostText("");
            setAttachedImage("");
            toast.success("Post published successfully");

            const postsResponse = await axios.get("http://localhost:3000/api/posts/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(postsResponse.data);
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to publish post to server");
        }
    };

    const handleLikePost = async (postId) => {
        try {
            await axios.put(`http://localhost:3000/api/posts/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const postsResponse = await axios.get("http://localhost:3000/api/posts/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(postsResponse.data);
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to update like status");
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

    const defaultInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "P";

    return (
        <Userlayout>
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header-banner"></div>

                    <div className="profile-avatar-section">
                        <div className="profile-avatar-wrapper" onClick={handleAvatarClick} title="Click to upload profile photo">
                            {user?.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="Profile Avatar"
                                    className="profile-avatar-img"
                                />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    {defaultInitials}
                                </div>
                            )}
                            <div className="profile-avatar-overlay">
                                <IoCameraOutline className="camera-upload-icon" />
                            </div>
                        </div>
                        <input
                            type="file"
                            id="avatar-file-input"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleAvatarChange}
                        />
                    </div>

                    {!isEditing ? (
                        <div className="profile-details-section">
                            <div className="profile-header-content">
                                <div className="profile-main-info">
                                    <h2 className="profile-name">
                                        {user?.name}
                                    </h2>
                                    <p className="profile-headline">{user?.headline || "Add professional title / headline"}</p>
                                    <p className="profile-location">
                                        <IoLocationOutline className="location-pin" />
                                        {user?.location || "Location not specified"}
                                        <span className="divider-dot">•</span>
                                        <span className="connections-count">
                                            {connections.length} {connections.length === 1 ? "connection" : "connections"}
                                        </span>
                                    </p>
                                </div>

                                <div className="profile-quick-details">
                                    {user?.company && (
                                        <div className="quick-item">
                                            <IoBriefcaseOutline className="quick-icon" />
                                            <span>{user.company}</span>
                                        </div>
                                    )}
                                    {user?.education && (
                                        <div className="quick-item">
                                            <IoSchoolOutline className="quick-icon" />
                                            <span>{user.education}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                                Edit Profile Intro
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="profile-edit-form">
                            <h2 className="edit-form-title">Edit Intro Details</h2>

                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="headline">Headline</label>
                                <input
                                    type="text"
                                    id="headline"
                                    name="headline"
                                    placeholder="Professional Headline"
                                    value={formData.headline}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="company">Current Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    placeholder="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="education">Education</label>
                                <input
                                    type="text"
                                    id="education"
                                    name="education"
                                    placeholder=" University/School"
                                    value={formData.education}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio">About (Summary)</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    placeholder="Briefly describe your expertise, key skills"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    placeholder="e.g. +1 (555) 019-2834"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dob">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    value={formData.dob ? formData.dob.split('T')[0] : ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {!isEditing && (
                    <div className="profile-section-card">
                        <h3 className="section-card-title">About</h3>
                        <p className="section-card-bio">
                            {user?.bio || "No professional summary added yet. Click 'Edit Profile Intro' to describe your professional achievements."}
                        </p>
                    </div>
                )}

                {!isEditing && (
                    <div className="profile-section-card">
                        <div className="section-card-header">
                            <h3 className="section-card-title">Contact Information</h3>
                            <button className="contact-edit-btn" onClick={() => setIsEditing(true)} title="Edit Contact Details">
                                <IoCreateOutline />
                            </button>
                        </div>
                        <div className="registered-details-list">
                            <div className="registered-detail-item">
                                <IoPersonOutline className="detail-item-icon" />
                                <div className="detail-item-content">
                                    <span className="detail-label">Registered Name</span>
                                    <span className="detail-value">{user?.name}</span>
                                </div>
                            </div>
                            <div className="registered-detail-item">
                                <IoMailOutline className="detail-item-icon" />
                                <div className="detail-item-content">
                                    <span className="detail-label">Email Address</span>
                                    <span className="detail-value">{user?.email}</span>
                                </div>
                            </div>
                            <div className="registered-detail-item">
                                <IoCallOutline className="detail-item-icon" />
                                <div className="detail-item-content">
                                    <span className="detail-label">Contact Number</span>
                                    <span className="detail-value">{user?.phone || "Not specified"}</span>
                                </div>
                            </div>
                            {user?.gender && (
                                <div className="registered-detail-item">
                                    <IoPersonOutline className="detail-item-icon" />
                                    <div className="detail-item-content">
                                        <span className="detail-label">Gender</span>
                                        <span className="detail-value">{user.gender}</span>
                                    </div>
                                </div>
                            )}
                            {user?.dob && (
                                <div className="registered-detail-item">
                                    <IoCalendarOutline className="detail-item-icon" />
                                    <div className="detail-item-content">
                                        <span className="detail-label">Date of Birth</span>
                                        <span className="detail-value">
                                            {new Date(user.dob).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {user?.createdAt && (
                                <div className="registered-detail-item">
                                    <IoCalendarOutline className="detail-item-icon" />
                                    <div className="detail-item-content">
                                        <span className="detail-label">Member Since</span>
                                        <span className="detail-value">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
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
                )}

                {!isEditing && (user?.company || user?.education) && (
                    <div className="profile-section-card">
                        <h3 className="section-card-title">Experience & Education</h3>
                        <div className="section-list">
                            {user?.company && (
                                <div className="section-list-item">
                                    <IoBriefcaseOutline className="list-item-icon" />
                                    <div className="list-item-details">
                                        <h4>Current Role</h4>
                                        <p>{user.company}</p>
                                    </div>
                                </div>
                            )}
                            {user?.education && (
                                <div className="section-list-item">
                                    <IoSchoolOutline className="list-item-icon" />
                                    <div className="list-item-details">
                                        <h4>Education</h4>
                                        <p>{user.education}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!isEditing && (
                    <div className="profile-section-card">
                        <div className="section-card-header">
                            <div className="section-title-wrapper">
                                <h3 className="section-card-title">Activity</h3>
                                <span className="section-followers-count">
                                    {connections.length} {connections.length === 1 ? "connection" : "connections"}
                                </span>
                            </div>
                            <button
                                className="create-post-trigger-btn"
                                onClick={() => setIsCreatingPost(true)}
                                title="Create a Post"
                            >
                                Create Post
                            </button>
                        </div>

                        <div className="posts-list">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post._id} className="post-card">
                                        <div className="post-card-header">
                                            {user?.profilePic ? (
                                                <img 
                                                    src={user.profilePic} 
                                                    alt="Author" 
                                                    className="post-author-avatar" 
                                                />
                                            ) : (
                                                <div className="post-author-avatar-placeholder">
                                                    {defaultInitials}
                                                </div>
                                            )}
                                            <div className="post-author-info">
                                                <span className="post-author-name">{user?.name}</span>
                                                <span className="post-author-headline">{user?.headline || "Professional"}</span>
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
                                                className={`post-action-btn ${post.likes?.includes(user?._id) ? "liked" : ""}`}
                                                onClick={() => handleLikePost(post._id)}
                                            >
                                                {post.likes?.includes(user?._id) ? <IoHeart className="like-icon-active" /> : <IoHeartOutline />}
                                                <span>{post.likes?.length || 0} Likes</span>
                                            </button>
                                            <button className="post-action-btn">
                                                <IoChatbubbleOutline />
                                                <span>Comment</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-posts-msg">No activity posts yet. Click "Create Post" above to share your first professional update.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isCreatingPost && (
                <div className="post-modal-overlay">
                    <div className="post-modal-container">
                        <div className="post-modal-header">
                            <h3>Create a post</h3>
                            <button className="close-modal-btn" onClick={() => {
                                setIsCreatingPost(false);
                                setAttachedImage("");
                            }} title="Close Modal">&times;</button>
                        </div>
                        <div className="post-modal-user-info">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="User Avatar" className="modal-user-avatar" />
                            ) : (
                                <div className="modal-user-avatar-placeholder">{defaultInitials}</div>
                            )}
                            <div className="modal-user-details">
                                <span className="modal-user-name">{user?.name}</span>
                                <span className="modal-user-badge">{user?.headline || "Professional"}</span>
                            </div>
                        </div>
                        <form onSubmit={(e) => {
                            handleCreatePost(e);
                            setIsCreatingPost(false);
                        }}>
                            <textarea
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                placeholder='write your thoughts...'
                                className="modal-composer-textarea"
                                rows="5"
                                autoFocus
                            />

                            {uploadingImage && (
                                <div className="modal-uploading-indicator">
                                    <div className="spinner mini-spinner"></div>
                                    <span>Uploading attachment...</span>
                                </div>
                            )}

                            {attachedImage && (
                                <div className="modal-attachment-preview">
                                    <img src={attachedImage} alt="Attachment Preview" className="modal-preview-image" />
                                    <button type="button" className="modal-remove-attachment-btn" onClick={handleRemoveModalImage} title="Remove image">
                                        <IoCloseOutline />
                                    </button>
                                </div>
                            )}

                            <input 
                                type="file" 
                                id="modal-post-image-input" 
                                accept="image/*" 
                                style={{ display: "none" }} 
                                onChange={handleModalImageChange} 
                            />

                            <div className="post-modal-footer">
                                <div className="modal-toolbar-options">
                                    <button type="button" className="modal-toolbar-btn" onClick={() => document.getElementById("modal-post-image-input").click()} title="Add a photo">
                                        <IoImagesOutline className="modal-toolbar-icon" />
                                        <span>Photo</span>
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="modal-post-submit-btn"
                                    disabled={(!newPostText.trim() && !attachedImage) || uploadingImage}
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Userlayout>
    );
};

export default Profile;
