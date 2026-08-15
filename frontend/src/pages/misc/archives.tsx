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

const Archived = () => {

    const [boards, setBoards] = useState<Board[]>([]);

    
    useEffect(() => {

        const fetchArchivedBoards = async () => {

            try {

                const res = await api.get("/boards");

                setBoards(res.data.boards);

            } catch (error) {

                console.error(
                    "Fetch Archived Boards Error:",
                    error
                );

            }

        };

        fetchArchivedBoards();

    }, []);


    const archivedBoards = boards.filter((board) => board.archived);


    const handleBoardUpdated = (updatedBoard: Board) => {

       
        if (!updatedBoard.archived) {

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

        <div className="archived-container">

            <div className="archived-header">

                <h1 className="archived-title">
                    Archived Boards
                </h1>

            </div>

            <div className="boards-container">

                {

                    archivedBoards.length === 0 ?

                        <div className="no-boards">

                            <h2>
                                No Archived Boards
                            </h2>

                            <p>
                                Archived boards will appear here.
                            </p>

                        </div>

                        :

                        archivedBoards.map((board) => (

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

export default Archived;