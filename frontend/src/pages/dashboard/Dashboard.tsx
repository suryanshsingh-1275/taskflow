import { useNavigate } from "react-router-dom";
import BoardCard from "../../components/BoardCard";
import CreateBoardModel from "../../components/CreateBoardModel";
import { useState } from "react";

interface Board {

    id: number;
    title: string;
    description: string;
    members: number;
    tasks: number;
    completedTasks: number;
    favorite: boolean;

}

const Dashboard = () => {

    const navigate = useNavigate();
    const [showCreateBoard, setShowCreateBoard] = useState(false);

    const [boards, setBoards] = useState<Board[]>([]);

     const handleCreateBoard = (
        title: string,
        description: string,
        visibility: string
    ) => {

        console.log("Board Created:");
        console.log(title);
        console.log(description);
        console.log(visibility);

        setShowCreateBoard(false);
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
                        onClick={()=>setShowCreateBoard(true)}
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
                    />

                </div>

                <div className="boards-container">

                    {

                        boards.length === 0 ?

                            <div className="no-boards">

                                <h2>
                                    No Boards Yet
                                </h2>

                                <p>
                                    Create your first board to get started.
                                </p>

                            </div>

                            :

                            boards.map((board) => (

                                <BoardCard

                                    key={board.id}

                                    id={board.id}

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

        </div>

    );

};

export default Dashboard;