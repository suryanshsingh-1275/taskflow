import React from "react";

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

    return (

        <div className="task-card">

            <div className="task-card-header">

                <h3 className="task-title">
                    {task.title}
                </h3>

                <button className="task-menu-button">
                    ⋮
                </button>

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

    );

};

export default TaskCard;