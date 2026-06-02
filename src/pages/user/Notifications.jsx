import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Userlayout from "../../components/layout/UserLayout";
import "./Notifications.css";
import {
    IoHeartOutline,
    IoChatbubbleEllipsesOutline,
    IoPersonAddOutline,
    IoCheckmarkCircleOutline,
    IoNotificationsOutline,
    IoCheckmarkDoneOutline
} from "react-icons/io5";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put("http://localhost:3000/api/notifications/read", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("All notifications marked as read");
            fetchNotifications();
        } catch (error) {
            console.error("Error marking notifications as read:", error);
            toast.error("Failed to mark notifications as read");
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    const getNotificationMessage = (type) => {
        switch (type) {
            case "like":
                return "liked your post.";
            case "comment":
                return "commented on your post.";
            case "connection_request":
                return "sent you a connection request.";
            case "connection_accept":
                return "accepted your connection request.";
            default:
                return "interacted with you.";
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "like":
                return <IoHeartOutline className="notif-type-icon like-icon" />;
            case "comment":
                return <IoChatbubbleEllipsesOutline className="notif-type-icon comment-icon" />;
            case "connection_request":
                return <IoPersonAddOutline className="notif-type-icon request-icon" />;
            case "connection_accept":
                return <IoCheckmarkCircleOutline className="notif-type-icon accept-icon" />;
            default:
                return <IoNotificationsOutline className="notif-type-icon default-icon" />;
        }
    };

    if (loading) {
        return (
            <Userlayout>
                <div className="notif-loading">
                    <div className="spinner"></div>
                </div>
            </Userlayout>
        );
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Userlayout>
            <div className="notif-outer-container">
                <div className="notif-inner-layout">
                    <div className="notif-header-card">
                        <div className="notif-header-left">
                            <div className="header-icon-box">
                                <IoNotificationsOutline className="header-icon" />
                            </div>
                            <div className="header-details">
                                <h2>Notifications</h2>
                                <p>Stay updated with professional actions and connection status.</p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button className="mark-read-btn" onClick={handleMarkAllAsRead}>
                                <IoCheckmarkDoneOutline className="action-btn-icon" />
                                <span>Mark all as read</span>
                            </button>
                        )}
                    </div>

                    <div className="notif-section-card">
                        {notifications.length > 0 ? (
                            <div className="notif-list">
                                {notifications.map((notif) => {
                                    const initials = notif.senderName ? notif.senderName.slice(0, 2).toUpperCase() : "U";
                                    const timeString = new Date(notif.createdAt).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    });

                                    return (
                                        <div key={notif._id} className={`notif-row-card ${notif.isRead ? "" : "notif-unread"}`}>
                                            <div className="notif-card-left">
                                                <div className="notif-avatar-container">
                                                    {notif.senderProfilePic ? (
                                                        <img src={notif.senderProfilePic} alt="Sender avatar" className="notif-avatar" />
                                                    ) : (
                                                        <div className="notif-avatar-placeholder">{initials}</div>
                                                    )}
                                                    <div className="notif-icon-badge">
                                                        {getNotificationIcon(notif.type)}
                                                    </div>
                                                </div>
                                                <div className="notif-details">
                                                    <p className="notif-text">
                                                        <span className="notif-sender-name">{notif.senderName}</span>{" "}
                                                        {getNotificationMessage(notif.type)}
                                                    </p>
                                                    <span className="notif-timestamp">{timeString}</span>
                                                </div>
                                            </div>
                                            {!notif.isRead && <div className="unread-indicator-dot"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="no-notif-state">
                                <IoNotificationsOutline className="no-notif-big-icon" />
                                <p className="no-notif-msg">No alerts or updates yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Userlayout>
    );
};

export default Notifications;
