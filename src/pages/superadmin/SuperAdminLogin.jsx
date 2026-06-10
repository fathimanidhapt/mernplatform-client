import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../Maincontext";
import "./SuperAdminLogin.css";

const SuperAdminLogin = () => {
    const { Login } = useContext(MainContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields ❌");
            return;
        }

        setLoading(true);
        try {
            const response = await Login({ email, password });

            if (response && response.token) {
                if (response.userData.role !== "superadmin") {
                    toast.error("Access Denied: Super Admin credentials only ❌");
                    setLoading(false);
                    return;
                }

                localStorage.setItem("token", response.token);
                localStorage.setItem("role", response.userData.role);
                localStorage.setItem("name", response.userData.name);
                localStorage.setItem("email", response.userData.email);
                localStorage.setItem("profilePic", response.userData.profilePic || "");

                toast.success("Super Admin Login Successful ✅");
                setEmail("");
                setPassword("");
                navigate("/superadmin/users");
            } else {
                toast.error("Login failed: Invalid credentials ❌");
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sa-login-container">
            <div className="sa-login-card">
                <div className="sa-login-glow"></div>
                <div className="sa-login-header">
                    <div className="sa-badge">SUPER ADMIN PORTAL</div>
                    <h1 className="sa-title">Sign In</h1>
                    <p className="sa-subtitle">Authorized personnel access only</p>
                </div>

                <form onSubmit={handleSubmit} className="sa-login-form">
                    <div className="sa-input-group">
                        <IoPersonCircleOutline className="sa-input-icon" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Super Admin Email"
                            className="sa-input-field"
                            required
                        />
                    </div>

                    <div className="sa-input-group">
                        <MdLockOutline className="sa-input-icon" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="sa-input-field"
                            required
                        />
                    </div>

                    <button type="submit" className="sa-submit-btn" disabled={loading}>
                        {loading ? "Verifying..." : "Access Console"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
