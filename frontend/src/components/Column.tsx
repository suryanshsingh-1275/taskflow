import { useState } from "react";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModel";

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
    boardId: string;
}

const Column = ({
    id,
    title,
    tasks,
    boardId,
}: ColumnProps) => {

    const [showCreateTask, setShowCreateTask] = useState(false);

    const handleCreateTask = (task: {
        title: string;
        description: string;
        priority: string;
        dueDate: string;
        assignee: string;
    }) => {

        console.log("Creating task...");

        console.log("Board ID:", boardId);

        console.log("Column ID:", id);

        console.log("Task:", task);

        // Later:
        // Axios POST request will go here.
    };


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

                <button
                    className="add-task-column-button"
                    onClick={() => setShowCreateTask(true)}
                >
                    + Add Task
                </button>

            </div>


            <CreateTaskModal

                isOpen={showCreateTask}

                onClose={() => setShowCreateTask(false)}

                boardId={boardId}

                columnId={id}

                onCreate={handleCreateTask}

            />

        </div>
    );
};

export default Column;