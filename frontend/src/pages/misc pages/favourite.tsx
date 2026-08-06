import { useEffect, useState } from "react";
import axios from "axios";
import BoardCard from "../../components/BoardCard";

interface FavoriteBoard {

    id: number;

    title: string;

    description: string;

    members: number;

    tasks: number;

    completedTasks: number;

    favorite: boolean;

}

const Favorites = () => {

    const [favoriteBoards, setFavoriteBoards] = useState<FavoriteBoard[]>([]);

    useEffect(() => {

        const fetchFavoriteBoards = async () => {

            try {

                // Later

                // const res = await axios.get("http://localhost:5000/boards/favorites");

                // setFavoriteBoards(res.data);

                console.log("Fetch Favorite Boards");

            }

            catch (err) {

                console.error(err);

            }

        };

        fetchFavoriteBoards();

    }, []);

    return (

        <div className="favorites-container">

            <div className="favorites-header">

                <h1 className="favorites-title">
                    Favorite Boards
                </h1>

            </div>

            <div className="boards-container">

                {

                    favoriteBoards.length === 0 ?

                        <div className="no-boards">

                            <h2>
                                No Favorite Boards
                            </h2>

                            <p>
                                Mark a board as favorite to see it here.
                            </p>

                        </div>

                        :

                        favoriteBoards.map((board) => (

                            <BoardCard

                                key={board.id}

                                title={board.title}

                                description={board.description}

                                members={board.members}

                                tasks={board.tasks}

                                completedTasks={board.completedTasks}

                                favorite={board.favorite}

                            />

                        ))

                }

            </div>

        </div>

    );

};

export default Favorites;