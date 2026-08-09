import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/dashboard/Dashboard";
import BoardPage from "../pages/boardpage/boardpage";

import Profile from "../pages/profile/Profile";
import Calendar from "../pages/calendar/Calender";
import Analytics from "../pages/analytics/Analytics";


const App = () => {

    return (

        <BrowserRouter>

            <Routes>

                {/* Authentication */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* Main Pages */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/board/:id"
                    element={<BoardPage />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />


                {/* Default */}

                <Route
                    path="*"
                    element={<Dashboard />}
                />

            </Routes>

        </BrowserRouter>

    );

};

export default App;