import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { FaFacebookF } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { MainContext } from "./Maincontext";

const Loginpage = () => {
    const { Login } = useContext(MainContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        const userData = {
            email,
            password,
        };

        try {

            const response =
                await Login(userData);

            console.log(response);

            if (response && response.token) {

                localStorage.setItem("token", response.token);
                localStorage.setItem("role", response.userData.role);
                localStorage.setItem("name", response.userData.name);
                localStorage.setItem("email", response.userData.email);
                localStorage.setItem("profilePic", response.userData.profilePic || "");

                toast.success("Login successful ✅");

                setEmail("");
                setPassword("");

                if (response.userData.role === "superadmin") {
                    navigate("/superadmin/users");
                } else if (response.userData.role === "admin") {
                    navigate("/admin/users");
                } else {
                    navigate("/Home");
                }

            } else {

                toast.error(
                    "Login failed: token not received ❌"
                );
            }

        } catch (error) {

            console.log(error);

            toast.error("Login failed ❌");
        }
    };

    return (
        <div className="bg">



            <div className="log-right">

                <div className="log-rightinbox">



                    <h1 className="log-divider">
                        Login
                    </h1>

                    <div className="log-line1">

                        <IoPersonCircleOutline />

                        <input
                            className="box4"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                        />

                    </div>

                    <div className="log-line1">

                        <MdLockOutline />

                        <input
                            className="box4"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                        />

                    </div>

                    <button className="button1">
                        Forgot Password?
                    </button>

                    <button
                        className="bottom"
                        onClick={handleSubmit}
                    >
                        Log In
                    </button>

                    <p className="signup">

                        Don’t have an account?

                        <button
                            className="button2"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Sign Up
                        </button>

                    </p>
                </div>
            </div>
        </div>
    );
};

export default Loginpage;