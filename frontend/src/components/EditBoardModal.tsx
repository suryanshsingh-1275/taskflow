import { useState } from "react";

interface Board {
    _id: string;
    title: string;
    description: string;
    visibility: string;
}

interface EditBoardModalProps {
    isOpen: boolean;
    board: Board;

    onClose: () => void;

    onEdit: (updatedBoard: {
        title: string;
        description: string;
        visibility: string;
    }) => void;

    onDelete: () => void;
}

const EditBoardModal = ({
    isOpen,
    board,
    onClose,
    onEdit,
    onDelete,
}: EditBoardModalProps) => {

    const [title, setTitle] = useState(board.title);
    const [description, setDescription] = useState(board.description);
    const [visibility, setVisibility] = useState(board.visibility);


    const handleEdit = () => {

        if (title.trim() === "") {
            console.log("Board title is required");
            return;
        }

        onEdit({
            title,
            description,
            visibility,
        });

        onClose();
    };


    const handleDelete = () => {

        onDelete();

        onClose();
    };


    if (!isOpen) {
        return null;
    }


    return (
        <div className="modal-overlay">

            <div className="modal-container">

                <div className="modal-header">

                    <h2 className="modal-title">
                        Edit Board
                    </h2>

                </div>


                <div className="modal-body">

                    <div className="form-group">

                        <label className="form-label">
                            Board Name
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label className="form-label">
                            Description
                        </label>

                        <textarea
                            className="form-textarea"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label className="form-label">
                            Visibility
                        </label>

                        <select
                            className="form-select"
                            value={visibility}
                            onChange={(e) =>
                                setVisibility(e.target.value)
                            }
                        >

                            <option value="Private">
                                Private
                            </option>

                            <option value="Team">
                                Team
                            </option>

                            <option value="Public">
                                Public
                            </option>

                        </select>

                    </div>

                </div>


                <div className="modal-footer">

                    <button
                        className="delete-button"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>


                    <button
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>


                    <button
                        className="create-button"
                        onClick={handleEdit}
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditBoardModal;