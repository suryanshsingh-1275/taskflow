import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {

    const [isPhoneLogin, setIsPhoneLogin] = useState(false);

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (isPhoneLogin) {

            if (phone === "" || password === "") {

                console.log("Please fill all fields");
                return;

            }

        } else {

            if (email === "" || password === "") {

                console.log("Please fill all fields");
                return;

            }

        }

        try {

            const res = await axios.post(
                "http://localhost:5000/login",
                {
                    email,
                    phone,
                    password,
                }
            );

            console.log(res.data);
            console.log("Login Successful");

            // localStorage.setItem("token", res.data.token);
            // navigate("/dashboard");

        } catch (err) {

            console.error(err);
            console.log("Login Failed");

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1 className="login-title">
                    Welcome Back
                </h1>

                <p className="login-subtitle">
                    Login to continue
                </p>

                <div className="toggle-div">

                    <button
                        className="toggle-button"
                        type="button"
                        onClick={() => setIsPhoneLogin(!isPhoneLogin)}
                    >
                        {
                            isPhoneLogin
                                ? "Login with Email"
                                : "Login with Phone"
                        }
                    </button>

                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    {

                        isPhoneLogin ?

                            <div className="form-group">

                                <label className="form-label">
                                    Phone Number
                                </label>

                                <input
                                    className="form-input"
                                    type="tel"
                                    placeholder="Enter Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />

                            </div>

                        :

                            <div className="form-group">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    className="form-input"
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                            </div>

                    }

                    <div className="form-group">

                        <label className="form-label">
                            Password
                        </label>

                        <input
                            className="form-input"
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>

                    <div className="button-div">

                        <button
                            className="login-button"
                            type="submit"
                        >
                            Login
                        </button>

                    </div>

                </form>

                <div className="signup-div">

                    <p className="signup-text">
                        Don't have an account?
                    </p>

                    <Link
                        className="signup-link"
                        to="/signup"
                    >
                        Create Account
                    </Link>

                </div>

            </div>

        </div>

    );

};

export default Login;