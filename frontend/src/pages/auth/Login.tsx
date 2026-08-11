import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Login = () => {

    const navigate = useNavigate();

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

            

            const res = await api.post(
                "/auth/login",
                {
                    email: isPhoneLogin ? "" : email,
                    phone: isPhoneLogin ? phone : "",
                    password,
                }
            );


            console.log("Login response:");
            console.log(res.data);

            console.log("Login Successful");


            // Store JWT token

            localStorage.setItem(
                "token",
                res.data.token
            );


            // Store user information

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );


            
            navigate("/dashboard");


        } catch (err: any) {

            console.error("Login Error:", err);

            console.log(
                err.response?.data?.message ||
                "Login Failed"
            );

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
                        onClick={() =>
                            setIsPhoneLogin(!isPhoneLogin)
                        }
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
                        isPhoneLogin

                            ?

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
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
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
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
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