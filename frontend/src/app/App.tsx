import "../App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/dashboard/Dashboard";
import BoardPage from "../pages/boardpage/boardpage";

import Profile from "../pages/profile/Profile";
import Calendar from "../pages/calendar/Calender";
import Analytics from "../pages/analytics/Analytics";

import Archived from "../pages/misc/archives";
import Favorites from "../pages/misc/favourite";

import ProtectedRoute from "../components/ProtectedRoute";



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

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />


                <Route path="/board/:id" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />


                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />


                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />


                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />


                <Route path="/archived" element={<ProtectedRoute><Archived /></ProtectedRoute>} />


                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />


                {/* Default */}

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

            </Routes>

        </BrowserRouter>

    );

};


export default App;