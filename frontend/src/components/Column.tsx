import React from "react";
import TaskCard from "./TaskCard";

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
}

interface ColumnProps {
    id: string;
    title: string;
    tasks: Task[];
}

const Column = ({
    id,
    title,
    tasks,
}: ColumnProps) => {

    return (

        <div className="column-container">

            <div className="column-header">

                <div className="column-title-div">

                    <h2 className="column-title">
                        {title}
                    </h2>

                    <span className="task-count">
                        {tasks.length}
                    </span>

                </div>

                <button className="column-menu-button">
                    ⋮
                </button>

            </div>


            <div className="column-body">

                {
                    tasks.length === 0 ?

                        <div className="empty-column">

                            <p>
                                No tasks yet
                            </p>

                        </div>

                        :

                        tasks.map((task) => (

                            <TaskCard
                                key={task.id}
                                task={task}
                            />

                        ))
                }

            </div>


            <div className="column-footer">

                <button className="add-task-column-button">

                    + Add Task

                </button>

            </div>

        </div>

    );

};

export default Column;