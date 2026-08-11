import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Signup = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        // Check empty fields

        if (
            name.trim() === "" ||
            email.trim() === "" ||
            phone.trim() === "" ||
            age.trim() === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            console.log("Please fill all fields");

            return;
        }


        // Check password

        if (password !== confirmPassword) {

            console.log("Passwords do not match");

            return;
        }


        // Convert age to number

        const ageNumber = Number(age);


        if (ageNumber <= 0) {

            console.log("Please enter a valid age");

            return;
        }


        try {

            const res = await api.post(
                "/auth/signup",
                {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    age: ageNumber,
                    password
                }
            );


            console.log(
                "Signup Response:",
                res.data
            );


            console.log(
                "Account Created Successfully"
            );


            // Go to login after successful signup

            navigate("/login");


        } catch (error: any) {

            console.error(
                "Signup Error:",
                error
            );


            console.error(
                "Server Response:",
                error.response?.data
            );

        }

    };


    return (

        <div className="signup-container">

            <div className="signup-card">


                {/* TITLE */}

                <div className="title-div">

                    <h1 className="signup-title">
                        Create Account
                    </h1>

                    <p className="signup-subtitle">
                        Start managing your projects today.
                    </p>

                </div>


                {/* FORM */}

                <form
                    className="signup-form"
                    onSubmit={handleSubmit}
                >


                    {/* NAME */}

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


                    {/* EMAIL */}

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


                    {/* PHONE */}

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


                    {/* AGE */}

                    <div className="form-group">

                        <label className="form-label">
                            Age
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            placeholder="Enter Age"
                            min="1"
                            value={age}
                            onChange={(e) =>
                                setAge(e.target.value)
                            }
                        />

                    </div>


                    {/* PASSWORD */}

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


                    {/* CONFIRM PASSWORD */}

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


                    {/* BUTTON */}

                    <div className="button-div">

                        <button
                            className="signup-button"
                            type="submit"
                        >
                            Create Account
                        </button>

                    </div>

                </form>


                {/* LOGIN */}

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