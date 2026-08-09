import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
}

interface TaskCardProps {
    task: Task;
}

const TaskCard = ({
    task,
}: TaskCardProps) => {

    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);


    const handleThreeDots = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {

        e.stopPropagation();

        setShowMenu(!showMenu);
    };


    const handleEdit = (updatedTask: Task) => {

        console.log("Updated Task:");
        console.log(updatedTask);

    };


    const handleDelete = (taskId: string) => {

        console.log("Delete Task:");
        console.log(taskId);

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
                                    handleDelete(task.id);
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
                                {task.dueDate}
                            </span>

                        </div>


                        <div className="task-assignee">

                            <span>
                                👤
                            </span>

                            <span>
                                {task.assignee}
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