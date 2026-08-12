import { useNavigate } from "react-router-dom";
import BoardCard from "../../components/BoardCard";
import CreateBoardModel from "../../components/CreateBoardModel";
import { useEffect, useState } from "react";
import api from "../../api/axios";


interface Board {
    _id: string;
    title: string;
    description: string;
    members: string[];
    visibility: string;
    favorite: boolean;
    archived: boolean;
}

const Dashboard = () => {

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [showCreateBoard, setShowCreateBoard] = useState(false);

    const [boards, setBoards] = useState<Board[]>([]);


    

    useEffect(() => {

        const fetchBoards = async () => {

            try {

                const res = await api.get("/boards");

                setBoards(res.data.boards);

            } catch (error) {

                console.error(
                    "Fetch Boards Error:",
                    error
                );

            }

        };

        fetchBoards();

    }, []);


    
    const filteredBoards = boards.filter((board) =>
        !board.archived &&
        board.title.toLowerCase().includes(search.toLowerCase())
    );


    const handleCreateBoard = async (
        title: string,
        description: string,
        visibility: string
    ) => {

        try {

            const res = await api.post(
                "/boards",
                {
                    title,
                    description,
                    visibility
                }
            );

            console.log(
                "Board Created:",
                res.data
            );

            const newBoard = res.data.board;

            setBoards((prevBoards) => [
                newBoard,
                ...prevBoards
            ]);

            setShowCreateBoard(false);

        } catch (error) {

            console.error(
                "Create Board Error:",
                error
            );

        }

    };


   
    const handleBoardUpdated = (updatedBoard: Board) => {

        setBoards((prevBoards) =>
            prevBoards.map((board) =>
                board._id === updatedBoard._id
                    ? updatedBoard
                    : board
            )
        );

    };


    // Called by BoardCard after a successful delete.
    const handleBoardDeleted = (boardId: string) => {

        setBoards((prevBoards) =>
            prevBoards.filter((board) => board._id !== boardId)
        );

    };


    return (

        <div className="dashboard-container">

            <div className="dashboard-sidebar">

                <h2 className="logo">
                    TaskFlow
                </h2>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/boards")}
                >
                    My Boards
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/favorites")}
                >
                    Favorites
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/archived")}
                >
                    Archived
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/tasks")}
                >
                    My Tasks
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/calendar")}
                >
                    Calendar
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/analytics")}
                >
                    Analytics
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/profile")}
                >
                    Profile
                </button>

                <button
                    className="sidebar-button"
                    onClick={() => navigate("/settings")}
                >
                    Settings
                </button>

            </div>

            <div className="dashboard-main">

                <div className="dashboard-header">

                    <button
                        className="create-board-button"
                        onClick={() => setShowCreateBoard(true)}
                    >
                        + Create Board
                    </button>

                    <CreateBoardModel
                        isOpen={showCreateBoard}
                        onClose={() => setShowCreateBoard(false)}
                        onCreate={handleCreateBoard}
                    />

                    <input
                        className="search-board"
                        type="text"
                        placeholder="Search Boards..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="boards-container">

                    {

                        filteredBoards.length === 0 ?

                            <div className="no-boards">

                                <h2>
                                    No Boards Yet
                                </h2>

                                <p>
                                    Create your first board to get started.
                                </p>

                            </div>

                            :

                            filteredBoards.map((board) => (

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

        </div>

    );

};

export default Dashboard;