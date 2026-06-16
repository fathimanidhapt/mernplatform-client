import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";
import "./Stats.css";

const Stats = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
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

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/superadmin/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Failed to load platform statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    return (
        <SuperAdminLayout>
            <div className="super-header-section">
                <h1 className="super-page-title">Platform Statistics Overview</h1>
            </div>

            {loading ? (
                <div className="table-loading">
                    <div className="spinner"></div>
                </div>
            ) : (
                stats && (
                    <div className="stats-dashboard-grid">
                        <div className="stats-card">
                            <div className="stats-card-left">
                                <span className="stats-metric-value">{stats.usersCount}</span>
                                <span className="stats-metric-label">Platform Users</span>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-left">
                                <span className="stats-metric-value">{stats.adminsCount}</span>
                                <span className="stats-metric-label">Moderators / Admins</span>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-left">
                                <span className="stats-metric-value">{stats.postsCount}</span>
                                <span className="stats-metric-label">Total Shared Posts</span>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-left">
                                <span className="stats-metric-value">{stats.connectionsCount}</span>
                                <span className="stats-metric-label">Established Connections</span>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-left">
                                <span className="stats-metric-value">{stats.pendingInvitesCount}</span>
                                <span className="stats-metric-label">Pending Invitations</span>
                            </div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-card-left">
                                <span className="stats-metric-value">{stats.superAdminsCount}</span>
                                <span className="stats-metric-label">Super Administrators</span>
                            </div>
                        </div>
                    </div>
                )
            )}
        </SuperAdminLayout>
    );
};

export default Stats;
