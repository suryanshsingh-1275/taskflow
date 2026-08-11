import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Signup = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (
            name === "" ||
            email === "" ||
            phone === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            console.log("Please fill all fields");
            return;

        }

        if (password !== confirmPassword) {

            console.log("Passwords do not match");
            return;

        }

        try {

            const res = await api.post(
                "/auth/signup",
                {
                    name,
                    email,
                    phone,
                    password,
                }
            );

            console.log(res.data);
            console.log("Account Created Successfully");

            // navigate("/login");
            navigate("/login");

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="signup-container">

            <div className="signup-card">

                <div className="title-div">

                    <h1 className="signup-title">
                        Create Account
                    </h1>

                    <p className="signup-subtitle">
                        Start managing your projects today.
                    </p>

                </div>

                <form
                    className="signup-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label className="form-label">
                            Full Name
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter Full Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            className="form-input"
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label className="form-label">
                            Phone Number
                        </label>

                        <input
                            className="form-input"
                            type="tel"
                            placeholder="Enter Phone Number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label className="form-label">
                            Password
                        </label>

                        <input
                            className="form-input"
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label className="form-label">
                            Confirm Password
                        </label>

                        <input
                            className="form-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                    </div>

                    <div className="button-div">

                        <button
                            className="signup-button"
                            type="submit"
                        >
                            Create Account
                        </button>

                    </div>

                </form>

                <div className="login-div">

                    <p className="login-text">
                        Already have an account?
                    </p>

                    <Link
                        className="login-link"
                        to="/login"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

};

export default Signup;