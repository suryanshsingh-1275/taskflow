import React, { useState } from "react";

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
}

interface EditTaskModalProps {
    isOpen: boolean;
    task: Task;

    onClose: () => void;

    onEdit: (updatedTask: Task) => void;

    onDelete: (taskId: string) => void;
}

const EditTaskModal = ({
    isOpen,
    task,
    onClose,
    onEdit,
    onDelete,
}: EditTaskModalProps) => {

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [assignee, setAssignee] = useState(task.assignee);

    const handleEdit = () => {

        if (title.trim() === "") {
            console.log("Task title is required");
            return;
        }

        const updatedTask: Task = {
            id: task.id,
            title,
            description,
            priority,
            dueDate,
            assignee,
        };

        console.log("Task Edited:");
        console.log(updatedTask);

        onEdit(updatedTask);

        onClose();
    };

    const handleDelete = () => {

        console.log("Deleting Task:");
        console.log(task.id);

        onDelete(task.id);

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
                        Edit Task
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
                            value={assignee}
                            onChange={(e) =>
                                setAssignee(e.target.value)
                            }
                        />

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

export default EditTaskModal;