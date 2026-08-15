import { useState } from "react";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModel";
import api from "../api/axios";


interface Task {
    _id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string | null;
    assignee: string | null;
    column: string;
}

interface TaskData {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
}


interface AssignableMember {
    _id: string;
    name: string;
}

interface ColumnProps {
    id: string;
    title: string;
    tasks: Task[];
    boardId: string;
    members: AssignableMember[];

    
    onTaskCreated: () => void;
}

const Column = ({
    id,
    title,
    tasks,
    boardId,
    members,
    onTaskCreated,
}: ColumnProps) => {

    const [showCreateTask, setShowCreateTask] =
        useState(false);


    const handleCreateTask = async (
        task: TaskData
    ) => {

        try {

            const res = await api.post(
                "/tasks",
                {
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    dueDate: task.dueDate || null,

                   
                    assignee: task.assignee || null,

                    board: boardId,

                    // Your schema calls this "column"
                    column: id,
                }
            );


            console.log(
                "Task Created:",
                res.data
            );


            // Close modal
            setShowCreateTask(false);


            // Tell BoardPage to fetch tasks again
            onTaskCreated();


        } catch (error) {

            console.error(
                "Create Task Error:",
                error
            );

        }

    };


    return (

        <div className="column-container">


            {/* COLUMN HEADER */}

            <div className="column-header">

                <div className="column-title-div">

                    <h2 className="column-title">
                        {title}
                    </h2>

                    <span className="task-count">
                        {tasks.length}
                    </span>

                </div>


                <button
                    className="column-menu-button"
                    type="button"
                >
                    ⋮
                </button>

            </div>


            {/* COLUMN BODY */}

            <div className="column-body">

                {
                    tasks.length === 0

                        ?

                        <div className="empty-column">

                            <p>
                                No tasks yet
                            </p>

                        </div>

                        :

                        tasks.map((task) => (

                            <TaskCard
                                key={task._id}
                                task={task}
                                members={members}
                                onTaskChanged={onTaskCreated}
                            />

                        ))
                }

            </div>


            {/* COLUMN FOOTER */}

            <div className="column-footer">

                <button
                    className="add-task-column-button"
                    type="button"
                    onClick={() =>
                        setShowCreateTask(true)
                    }
                >
                    + Add Task
                </button>

            </div>


            {/* CREATE TASK MODAL */}

            <CreateTaskModal

                isOpen={showCreateTask}

                onClose={() =>
                    setShowCreateTask(false)
                }

                boardId={boardId}

                columnId={id}

                members={members}

                onCreate={handleCreateTask}

            />

        </div>

    );
};

export default Column;