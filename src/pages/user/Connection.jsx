import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Userlayout from "../../components/layout/UserLayout";
import "./Connection.css";
import {
    IoPeopleOutline,
    IoPersonAddOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoLocationOutline,
    IoBriefcaseOutline
} from "react-icons/io5";

const Connection = () => {
    const [connections, setConnections] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const fetchNetworkData = async () => {
        try {
            const connResponse = await axios.get("http://localhost:3000/api/connections", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConnections(connResponse.data);

            const pendingResponse = await axios.get("http://localhost:3000/api/connections/pending", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(pendingResponse.data);

            const sentResponse = await axios.get("http://localhost:3000/api/connections/sent", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSentRequests(sentResponse.data);

            const suggestionsResponse = await axios.get("http://localhost:3000/api/connections/suggestions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuggestions(suggestionsResponse.data);
        } catch (error) {
            console.error("Error fetching network data:", error);
            toast.error("Failed to load network updates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNetworkData();
        }
    }, [token]);

    const handleSendRequest = async (targetUserId) => {
        try {
            await axios.post(`http://localhost:3000/api/connections/request/${targetUserId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Connection request sent successfully");
            fetchNetworkData();
        } catch (error) {
            console.error("Error sending connection request:", error);
            toast.error("Failed to send connection request");
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            await axios.delete(`http://localhost:3000/api/connections/request/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Connection request cancelled successfully");
            fetchNetworkData();
        } catch (error) {
            console.error("Error cancelling connection request:", error);
            toast.error("Failed to cancel connection request");
        }
    };

    const handleResponse = async (senderId, action) => {
        try {
            await axios.put(`http://localhost:3000/api/connections/respond/${senderId}`, {
                action: action
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (action === "accepted") {
                toast.success("Connection invitation accepted");
            } else {
                toast.info("Connection invitation ignored");
            }

            fetchNetworkData();
        } catch (error) {
            console.error("Error responding to invitation:", error);
            toast.error("Failed to process invitation");
        }
    };

    if (loading) {
        return (
            <Userlayout>
                <div className="network-loading">
                    <div className="spinner"></div>
                </div>
            </Userlayout>
        );
    }

    return (
        <Userlayout>
            <div className="network-outer-container">
                <div className="network-inner-layout">
                    <div className="network-section-card">
                        <h3 className="section-title">Pending Invitations ({pendingRequests.filter(r => r.role === "user").length})</h3>
                        {pendingRequests.filter(r => r.role === "user").length > 0 ? (
                            <div className="requests-list">
                                {pendingRequests.filter(r => r.role === "user").map((reqst) => {
                                    const initials = reqst.name ? reqst.name.slice(0, 2).toUpperCase() : "U";
                                    return (
                                        <div key={reqst._id} className="request-row-card">
                                            <div className="request-card-left">
                                                {reqst.profilePic ? (
                                                    <img src={reqst.profilePic} alt="User avatar" className="request-avatar" />
                                                ) : (
                                                    <div className="request-avatar-placeholder">{initials}</div>
                                                )}
                                                <div className="request-details">
                                                    <span className="request-name">{reqst.name}</span>
                                                    <span className="request-headline">{reqst.headline}</span>
                                                    <span className="request-meta-item">
                                                        <IoLocationOutline className="meta-icon" />
                                                        <span>{reqst.location}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="request-actions">
                                                <button
                                                    className="accept-invitation-btn"
                                                    onClick={() => handleResponse(reqst.senderId, "accepted")}
                                                >
                                                    <IoCheckmarkCircleOutline className="action-btn-icon" />
                                                    <span>Accept</span>
                                                </button>
                                                <button
                                                    className="reject-invitation-btn"
                                                    onClick={() => handleResponse(reqst.senderId, "rejected")}
                                                >
                                                    <IoCloseCircleOutline className="action-btn-icon" />
                                                    <span>Ignore</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-suggestions-msg" style={{ margin: "10px 0" }}>No pending connection requests.</p>
                        )}
                    </div>

                    <div className="network-section-card">
                        <h3 className="section-title">Sent Requests ({sentRequests.filter(r => r.role === "user").length})</h3>
                        {sentRequests.filter(r => r.role === "user").length > 0 ? (
                            <div className="requests-list">
                                {sentRequests.filter(r => r.role === "user").map((reqst) => {
                                    const initials = reqst.name ? reqst.name.slice(0, 2).toUpperCase() : "U";
                                    return (
                                        <div key={reqst._id} className="request-row-card">
                                            <div className="request-card-left">
                                                {reqst.profilePic ? (
                                                    <img src={reqst.profilePic} alt="User avatar" className="request-avatar" />
                                                ) : (
                                                    <div className="request-avatar-placeholder">{initials}</div>
                                                )}
                                                <div className="request-details">
                                                    <span className="request-name">{reqst.name}</span>
                                                    <span className="request-headline">{reqst.headline}</span>
                                                    <span className="request-meta-item">
                                                        <IoLocationOutline className="meta-icon" />
                                                        <span>{reqst.location}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="request-actions">
                                                <button
                                                    className="reject-invitation-btn"
                                                    onClick={() => handleCancelRequest(reqst._id)}
                                                >
                                                    <IoCloseCircleOutline className="action-btn-icon" />
                                                    <span>Cancel Request</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-suggestions-msg" style={{ margin: "10px 0" }}>No outgoing pending requests.</p>
                        )}
                    </div>

                    <div className="network-section-card">
                        <h3 className="section-title">People you may know</h3>
                        {suggestions.filter(suggest => suggest.role === "user").length > 0 ? (
                            <div className="suggestions-grid">
                                {suggestions.filter(suggest => suggest.role === "user").map((suggest) => {
                                    const initials = suggest.name ? suggest.name.slice(0, 2).toUpperCase() : "U";
                                    return (
                                        <div key={suggest._id} className="suggestion-item-card">
                                            <div className="suggestion-card-banner"></div>
                                            <div className="suggestion-avatar-container">
                                                {suggest.profilePic ? (
                                                    <img src={suggest.profilePic} alt="User avatar" className="suggestion-avatar-img" />
                                                ) : (
                                                    <div className="suggestion-avatar-placeholder">{initials}</div>
                                                )}
                                            </div>
                                            <div className="suggestion-info">
                                                <span className="suggestion-name" title={suggest.name}>{suggest.name}</span>
                                                <span className="suggestion-headline" title={suggest.headline}>{suggest.headline}</span>
                                                {suggest.location && (
                                                    <span className="suggestion-location">
                                                        <IoLocationOutline className="suggestion-loc-icon" />
                                                        <span>{suggest.location}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="suggestion-card-actions">
                                                <button
                                                    className="suggestion-connect-btn"
                                                    onClick={() => handleSendRequest(suggest._id)}
                                                >
                                                    <IoPersonAddOutline className="action-btn-icon" />
                                                    <span>Connect</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-suggestions-msg" style={{ margin: "10px 0" }}>No new recommendations available at this time.</p>
                        )}
                    </div>

                    <div className="network-section-card">
                        <h3 className="section-title">Your Connections ({connections.filter(c => c.role === "user").length})</h3>
                        {connections.filter(c => c.role === "user").length > 0 ? (
                            <div className="requests-list">
                                {connections.filter(c => c.role === "user").map((conn) => {
                                    const initials = conn.name ? conn.name.slice(0, 2).toUpperCase() : "U";
                                    return (
                                        <div key={conn._id} className="request-row-card">
                                            <div className="request-card-left">
                                                {conn.profilePic ? (
                                                    <img src={conn.profilePic} alt="Friend avatar" className="request-avatar" />
                                                ) : (
                                                    <div className="request-avatar-placeholder">{initials}</div>
                                                )}
                                                <div className="request-details">
                                                    <span className="request-name">{conn.name}</span>
                                                    <span className="request-headline">{conn.headline}</span>
                                                    <span className="request-meta-item">
                                                        <IoBriefcaseOutline className="meta-icon" />
                                                        <span>{conn.role}</span>
                                                    </span>
                                                    <span className="request-meta-item">
                                                        <IoLocationOutline className="meta-icon" />
                                                        <span>{conn.location}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="request-actions">
                                                <span className="connection-status-badge">
                                                    <IoCheckmarkCircleOutline className="action-btn-icon" />
                                                    <span>Connected</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="no-connections-msg">You haven't added any professional connections yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </Userlayout>
    );
};

export default Connection;
