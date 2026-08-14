import { useEffect, useState } from "react";
import api from "../../api/axios";


interface User {

    id: string;

    name: string;

    email: string;

    phone: string;

    profileImage: string;

    role: string;

    joinedOn: string;

    totalBoards: number;

    completedTasks: number;

    favoriteBoards: number;

}

const Profile = () => {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                
                const res = await api.get("/auth/me");

                setUser(res.data.user);
    
            }

            catch (err) {

                console.error(err);

            }

        };

        fetchProfile();

    }, []);

    return (

        <div className="profile-container">

            {

                user === null ?

                    <div className="loading">

                        Loading...

                    </div>

                    :

                    <div className="profile-card">

                        <img
                            className="profile-image"
                            src={user.profileImage}
                            alt="Profile"
                        />

                        <h2>
                            {user.name}
                        </h2>

                        <p>
                            {user.email}
                        </p>

                        <p>
                            {user.phone}
                        </p>

                        <p>
                            {user.role}
                        </p>

                        <p>
                            Joined :
                            {" "}
                            {user.joinedOn}
                        </p>

                        <p>
                            Boards :
                            {" "}
                            {user.totalBoards}
                        </p>

                        <p>
                            Completed Tasks :
                            {" "}
                            {user.completedTasks}
                        </p>

                        <p>
                            Favorites :
                            {" "}
                            {user.favoriteBoards}
                        </p>

                    </div>

            }

        </div>

    );

};

export default Profile;