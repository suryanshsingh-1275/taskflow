import React from "react";
import { useParams } from "react-router-dom";
import Column from "../../components/Column";

interface BoardPageProps {
    title?: string;
    description?: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
}

interface ColumnData {
    id: string;
    title: string;
    tasks: Task[];
}

const BoardPage = ({
    title = "TaskFlow Board",
    description = "Project Management",
}: BoardPageProps) => {

    const { id } = useParams();

    const columns: ColumnData[] = [
        {
            id: "todo",
            title: "Todo",
            tasks: [],
        },

        {
            id: "progress",
            title: "In Progress",
            tasks: [],
        },

        {
            id: "review",
            title: "Review",
            tasks: [],
        },

        {
            id: "done",
            title: "Done",
            tasks: [],
        },
    ];

    console.log("Board ID:", id);

    return (

        <div className="board-page-container">

            <div className="board-page-header">

                <div className="board-page-info">

                    <h1 className="board-page-title">
                        {title}
                    </h1>

                    <p className="board-page-description">
                        {description}
                    </p>

                </div>

                <div className="board-page-actions">

                    <button className="board-search-button">
                        Search
                    </button>

                    <button className="add-task-button">
                        + Add Task
                    </button>

                </div>

            </div>


            <div className="columns-container">

                {
                    columns.map((column) => (

                        <Column
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={column.tasks}
                        />

                    ))
                }

            </div>

        </div>

    );

};

export default BoardPage;