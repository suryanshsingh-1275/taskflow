import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Column from "../../components/Column";
import api from "../../api/axios";


interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
    status: string;
}


interface ColumnData {
    id: string;
    title: string;
    tasks: Task[];
}


interface Board {
    id: string;
    title: string;
    description: string;
}


const BoardPage = () => {

    const { id } = useParams();


    const [board, setBoard] = useState<Board | null>(null);

    const [columns, setColumns] = useState<ColumnData[]>([
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
    ]);


    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchBoard = async () => {

            try {

                if (!id) {
                    return;
                }


                const res = await api.get(
                    `/boards/${id}`
                );


                console.log(
                    "Board Response:",
                    res.data
                );


                setBoard(res.data.board);


                /*
                    Later we'll get tasks from the
                    backend response and distribute
                    them into these four columns.
                */

            } catch (error) {

                console.error(
                    "Failed to fetch board:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchBoard();

    }, [id]);


    if (loading) {

        return (
            <div className="loading">
                Loading board...
            </div>
        );

    }


    if (!board) {

        return (
            <div className="no-board">
                Board not found
            </div>
        );

    }


    return (

        <div className="board-page-container">


            {/* Board Header */}

            <div className="board-page-header">

                <div className="board-page-info">

                    <h1 className="board-page-title">
                        {board.title}
                    </h1>

                    <p className="board-page-description">
                        {board.description}
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


            {/* Columns */}

            <div className="columns-container">

                {
                    columns.map((column) => (

                        <Column
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={column.tasks}
                            boardId={id!}
                        />

                    ))
                }

            </div>


        </div>

    );

};


export default BoardPage;