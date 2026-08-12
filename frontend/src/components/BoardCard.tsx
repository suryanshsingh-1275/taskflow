import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditBoardModal from "./EditBoardModal";
import api from "../api/axios";

interface BoardCardProps {

    _id: string;
    title: string;
    description: string;

    members: string[];

    
    
    tasks?: number;
    completedTasks?: number;

    favorite: boolean;
    archived: boolean;
    visibility: string;

    
    onBoardUpdated: (updatedBoard: any) => void;

    
    onBoardDeleted: (boardId: string) => void;
}

const BoardCard = ({
    _id,
    title,
    description,
    members,
    tasks = 0,
    completedTasks = 0,
    favorite,
    archived,
    visibility,
    onBoardUpdated,
    onBoardDeleted,
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


    

    const handleEdit = async (updatedBoard: {
        title: string;
        description: string;
        visibility: string;
    }) => {

        try {

            const res = await api.put(
                `/boards/${_id}`,
                {
                    title: updatedBoard.title,
                    description: updatedBoard.description,
                    visibility: updatedBoard.visibility,
                }
            );

            onBoardUpdated(res.data.board);

        } catch (error) {

            console.error("Edit Board Error:", error);

        }

    };


    // DELETE  (DELETE /boards/:id)

    const handleDelete = async () => {

        try {

            await api.delete(`/boards/${_id}`);

            onBoardDeleted(_id);

        } catch (error) {

            console.error("Delete Board Error:", error);

        }

    };


    // FAVORITE  (PUT /boards/:id with { favorite })

    const handleFavorite = async () => {

        try {

            const res = await api.put(
                `/boards/${_id}`,
                { favorite: !favorite }
            );

            onBoardUpdated(res.data.board);

        } catch (error) {

            console.error("Favorite Board Error:", error);

        }

    };


    // ARCHIVE  (PUT /boards/:id with { archived })

    const handleArchive = async () => {

        try {

            const res = await api.put(
                `/boards/${_id}`,
                { archived: !archived }
            );

            onBoardUpdated(res.data.board);

        } catch (error) {

            console.error("Archive Board Error:", error);

        }

    };


    return (

        <>

            <div
                className="board-card"
                onClick={() => navigate(`/board/${_id}`)}
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
                            👥 {members.length} Members
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
                                        handleFavorite();
                                        setShowMenu(false);
                                    }}
                                >
                                    {favorite ? "Unfavorite" : "Favorite"}
                                </button>


                                <button
                                    onClick={() => {
                                        handleArchive();
                                        setShowMenu(false);
                                    }}
                                >
                                    {archived ? "Unarchive" : "Archive"}
                                </button>


                                <button
                                    onClick={() => {
                                        handleDelete();
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
                    _id,
                    title,
                    description,
                    visibility,
                }}

                onClose={() => setShowEditModal(false)}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />

        </>

    );
};

export default BoardCard;