import React, { useState } from "react";

interface TaskData {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;

    boardId: string;
    columnId: string;

    onCreate: (task: TaskData) => void;
}

const CreateTaskModal = ({
    isOpen,
    onClose,
    boardId,
    columnId,
    onCreate,
}: CreateTaskModalProps) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [assignee, setAssignee] = useState("");

    const handleCreate = () => {

        if (title.trim() === "") {
            console.log("Task title is required");
            return;
        }

        const task: TaskData = {
            title,
            description,
            priority,
            dueDate,
            assignee,
        };

        console.log("Board ID:", boardId);
        console.log("Column ID:", columnId);
        console.log("Task:", task);

        onCreate(task);

        setTitle("");
        setDescription("");
        setPriority("Medium");
        setDueDate("");
        setAssignee("");

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
                        Create Task
                    </h2>

                </div>

                <div className="modal-body">

                    <div className="form-group">

                        <label className="form-label">
                            Task Title
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter Task Title"
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
                            Priority
                        </label>

                        <select
                            className="form-select"
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                        >

                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>

                        </select>

                    </div>


                    <div className="form-group">

                        <label className="form-label">
                            Due Date
                        </label>

                        <input
                            className="form-input"
                            type="date"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(e.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label className="form-label">
                            Assignee
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter Assignee"
                            value={assignee}
                            onChange={(e) =>
                                setAssignee(e.target.value)
                            }
                        />

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
                        Create Task
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CreateTaskModal;