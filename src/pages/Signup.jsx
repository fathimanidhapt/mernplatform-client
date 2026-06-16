import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";

import { IoPersonCircleOutline, IoCheckbox, IoSquareOutline } from "react-icons/io5";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { MainContext } from "./Maincontext";

const Signpage = () => {
    const navigate = useNavigate();

    const { signup } = useContext(MainContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreed) {
            toast.error("Please agree to the Terms & Conditions ❌");
            return;
        }

        if (email && email.toLowerCase().trim() === "superadmin@gmail.com") {
            toast.error("Invalid registration credentials ❌");
            return;
        }

        const userData = {
            name: name,
            email: email,
            password: password,
            confirmpassword: confirmpassword
        };

        console.log(userData, "===userData");

        try {
            await signup(userData);

            toast.success("Signup successful! ✅");

            setName('');
            setEmail('');
            setPassword('');
            setConfirmpassword('');

            navigate("/");

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed ❌";
            toast.error(errorMessage);
            console.log(error);
        }
    };



    return (
        <>
            <div className="signup-container">

                <div className="signup-card">
                    <div className="signup-header">


                        <h1 className="divider">
                            Sign up
                        </h1>
                        <div >
                            <div className="line">
                                <IoPersonCircleOutline />
                                <input className="box" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your username" />
                            </div>

                            <div className="line">
                                <MdOutlineEmail />
                                <input className="box" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your E-mail" />
                            </div>

                            <div className="line">
                                <MdLockOutline />
                                <input className="box" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                            </div>

                            <div className="line">
                                <MdLockOutline />
                                <input className="box" type="password" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} placeholder="confirm your password" />
                            </div>

                            <p className="condition">
                                <span className="checkbox-wrapper" onClick={() => setAgreed(!agreed)}>
                                    {agreed ? <IoCheckbox /> : <IoSquareOutline className="unchecked" />}
                                </span>
                                <span className="condition-text" onClick={() => setAgreed(!agreed)}>
                                    Agree with
                                </span>
                                <button type="button" className="button2">Terms & Conditions</button>
                            </p>

                            <button className="bottom" onClick={handleSubmit}>
                                Sign In
                            </button>

                            <p className="signup">
                                Already have an account?
                                <button className="button2" onClick={() => navigate("/")}>
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signpage;
