import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditBoardModal from "./EditBoardModal";

interface BoardCardProps {
    id: number;
    title: string;
    description: string;
    members: number;
    tasks: number;
    completedTasks: number;
    favorite: boolean;
}

const BoardCard = ({
    id,
    title,
    description,
    members,
    tasks,
    completedTasks,
    favorite,
}: BoardCardProps) => {

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);


    const progress = tasks === 0
        ? 0
        : Math.round((completedTasks / tasks) * 100);


    const handleThreeDots = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {

        e.stopPropagation();

        setShowMenu(!showMenu);

    };


    const handleEdit = (updatedBoard: BoardCardProps) => {

        console.log("Updated Board:");
        console.log(updatedBoard);

    };


    const handleDelete = (boardId: number) => {

        console.log("Delete Board:");
        console.log(boardId);

    };


    const handleFavorite = (boardId: number) => {

        console.log("Favorite Board:");
        console.log(boardId);

    };


    const handleArchive = (boardId: number) => {

        console.log("Archive Board:");
        console.log(boardId);

    };


    return (

        <>

            <div
                className="board-card"
                onClick={() => navigate(`/board/${id}`)}
            >

                <div className="board-header">

                    <h2 className="board-title">
                        {title}
                    </h2>

                    <span className="board-favorite">
                        {favorite ? "⭐" : "☆"}
                    </span>

                </div>


                <div className="board-body">

                    <p className="board-description">
                        {description}
                    </p>


                    <div className="board-info">

                        <p>
                            👥 {members} Members
                        </p>

                        <p>
                            📝 {tasks} Tasks
                        </p>

                    </div>


                    <div className="progress-div">

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${progress}%`,
                                }}
                            ></div>

                        </div>

                        <p className="progress-text">
                            {progress}% Complete
                        </p>

                    </div>

                </div>


                <div className="board-footer">

                    <button
                        className="menu-button"
                        onClick={handleThreeDots}
                    >
                        ⋮
                    </button>


                    {
                        showMenu && (

                            <div
                                className="menu"
                                onClick={(e) => e.stopPropagation()}
                            >

                                <button
                                    onClick={() => {
                                        setShowEditModal(true);
                                        setShowMenu(false);
                                    }}
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() => {
                                        handleFavorite(id);
                                        setShowMenu(false);
                                    }}
                                >
                                    Favorite
                                </button>


                                <button
                                    onClick={() => {
                                        handleArchive(id);
                                        setShowMenu(false);
                                    }}
                                >
                                    Archive
                                </button>


                                <button
                                    onClick={() => {
                                        handleDelete(id);
                                        setShowMenu(false);
                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        )
                    }

                </div>

            </div>


            <EditBoardModal

                isOpen={showEditModal}

                board={{
                    id,
                    title,
                    description,
                    members,
                    tasks,
                    completedTasks,
                    favorite,
                    visibility: "Private",
                }}

                onClose={() => setShowEditModal(false)}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />

        </>

    );
};

export default BoardCard; 