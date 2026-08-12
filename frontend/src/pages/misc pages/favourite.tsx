import { useEffect, useState } from "react";
import api from "../../api/axios";
import BoardCard from "../../components/BoardCard";

interface Board {
    _id: string;
    title: string;
    description: string;
    members: string[];
    visibility: string;
    favorite: boolean;
    archived: boolean;
}

const Favorites = () => {

    const [boards, setBoards] = useState<Board[]>([]);

    
    useEffect(() => {

        const fetchFavoriteBoards = async () => {

            try {

                const res = await api.get("/boards");

                setBoards(res.data.boards);

            } catch (error) {

                console.error(
                    "Fetch Favorite Boards Error:",
                    error
                );

            }

        };

        fetchFavoriteBoards();

    }, []);


    const favoriteBoards = boards.filter((board) => board.favorite);


    const handleBoardUpdated = (updatedBoard: Board) => {

        if (!updatedBoard.favorite) {

            setBoards((prev) =>
                prev.filter((board) => board._id !== updatedBoard._id)
            );

            return;

        }

        setBoards((prev) =>
            prev.map((board) =>
                board._id === updatedBoard._id ? updatedBoard : board
            )
        );

    };


    const handleBoardDeleted = (boardId: string) => {

        setBoards((prev) =>
            prev.filter((board) => board._id !== boardId)
        );

    };


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

                                key={board._id}

                                _id={board._id}

                                title={board.title}

                                description={board.description}

                                members={board.members}

                                favorite={board.favorite}

                                archived={board.archived}

                                visibility={board.visibility}

                                onBoardUpdated={handleBoardUpdated}

                                onBoardDeleted={handleBoardDeleted}

                            />

                        ))

                }

            </div>

        </div>

    );

};

export default Favorites;