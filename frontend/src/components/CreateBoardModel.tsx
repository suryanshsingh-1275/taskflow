import { useState } from "react";

interface CreateBoardProps {

    isOpen: boolean;

    onClose: () => void;

    onCreate: (
        title: string,
        description: string,
        visibility: string,
    ) => void;

}

const CreateBoardModal = ({
    isOpen,
    onClose,
    onCreate,
}: CreateBoardProps) => {

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [visibility, setVisibility] = useState("Private");

    const handleCreate = () => {

        if (title === "") {

            console.log("Board title is required");

            return;

        }

        onCreate(
            title,
            description,
            visibility,
        );

        setTitle("");

        setDescription("");

        setVisibility("Private");

    };

    if (!isOpen) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="modal-container">

                <div className="modal-header">

                    <h2 className="modal-title">
                        Create Board
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
                            placeholder="Enter Board Name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                    </div>

                    <div className="form-group">

                        <label className="form-label">
                            Description
                        </label>

                        <textarea
                            className="form-textarea"
                            placeholder="Enter Description"
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

                            <option>
                                Private
                            </option>

                            <option>
                                Team
                            </option>

                            <option>
                                Public
                            </option>

                        </select>

                    </div>

                </div>

                <div className="modal-footer">

                    <button
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="create-button"
                        onClick={handleCreate}
                    >
                        Create
                    </button>

                </div>

            </div>

        </div>

    );

};

export default CreateBoardModal;