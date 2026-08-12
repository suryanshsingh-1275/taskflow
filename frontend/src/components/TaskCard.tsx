import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import api from "../api/axios";

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string | null;
    assignee: string | null;
}

interface TaskCardProps {
    task: Task;
    onTaskChanged: () => void;
}

const TaskCard = ({
    task,
    onTaskChanged,
}: TaskCardProps) => {

    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);


    const handleThreeDots = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {

        e.stopPropagation();

        setShowMenu(!showMenu);
    };


    
    // EDIT  (PUT /tasks/:id)
   

    const handleEdit = async (updatedTask: {
        title: string;
        description: string;
        priority: string;
        dueDate: string | null;
        assignee: string | null;
    }) => {

        try {

            await api.put(
                `/tasks/${task._id}`,
                {
                    title: updatedTask.title,
                    description: updatedTask.description,
                    priority: updatedTask.priority,
                    dueDate: updatedTask.dueDate || null,
                    assignee: updatedTask.assignee || null,
                }
            );

            onTaskChanged();

        } catch (error) {

            console.error("Update Task Error:", error);

        }

    };


    
    // DELETE  (DELETE /tasks/:id)


    const handleDelete = async () => {

        try {

            await api.delete(`/tasks/${task._id}`);

            onTaskChanged();

        } catch (error) {

            console.error("Delete Task Error:", error);

        }

    };


    return (

        <>

            <div className="task-card">

                <div className="task-card-header">

                    <h3 className="task-title">
                        {task.title}
                    </h3>


                    <button
                        className="task-menu-button"
                        onClick={handleThreeDots}
                    >
                        ⋮
                    </button>


                    {showMenu && (

                        <div className="task-menu">

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
                                    handleDelete();
                                    setShowMenu(false);
                                }}
                            >
                                Delete
                            </button>

                        </div>

                    )}

                </div>


                <div className="task-card-body">

                    <p className="task-description">
                        {task.description}
                    </p>


                    <div className="task-details">

                        <div className="task-priority">

                            <span>
                                Priority:
                            </span>

                            <span>
                                {task.priority}
                            </span>

                        </div>


                        <div className="task-due-date">

                            <span>
                                📅
                            </span>

                            <span>
                                {task.dueDate || "No due date"}
                            </span>

                        </div>


                        <div className="task-assignee">

                            <span>
                                👤
                            </span>

                            <span>
                                {task.assignee || "Unassigned"}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            <EditTaskModal

                isOpen={showEditModal}

                task={task}

                onClose={() => setShowEditModal(false)}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />

        </>

    );
};

export default TaskCard;