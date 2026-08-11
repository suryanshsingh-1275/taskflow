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

    column: string;

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


    const [board, setBoard] =
        useState<Board | null>(null);


    const [columns, setColumns] =
        useState<ColumnData[]>([

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


    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const fetchBoardData = async () => {

            try {

                if (!id) {
                    return;
                }


                /*
                    GET BOARD
                */

                const boardRes = await api.get(
                    `/boards/${id}`
                );


                console.log(
                    "Board Response:",
                    boardRes.data
                );


                setBoard(
                    boardRes.data.board
                );


                /*
                    GET TASKS OF BOARD
                */

                const taskRes = await api.get(
                    `/tasks/board/${id}`
                );


                console.log(
                    "Tasks Response:",
                    taskRes.data
                );


                const tasks: Task[] =
                    taskRes.data.tasks;


                /*
                    Put tasks into
                    their respective columns
                */

                setColumns([

                    {
                        id: "todo",
                        title: "Todo",
                        tasks: tasks.filter(
                            (task) =>
                                task.column === "todo"
                        ),
                    },

                    {
                        id: "progress",
                        title: "In Progress",
                        tasks: tasks.filter(
                            (task) =>
                                task.column === "progress"
                        ),
                    },

                    {
                        id: "review",
                        title: "Review",
                        tasks: tasks.filter(
                            (task) =>
                                task.column === "review"
                        ),
                    },

                    {
                        id: "done",
                        title: "Done",
                        tasks: tasks.filter(
                            (task) =>
                                task.column === "done"
                        ),
                    },

                ]);


            } catch (error) {

                console.error(
                    "Failed to fetch board data:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchBoardData();

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

                    <button
                        className="board-search-button"
                    >
                        Search
                    </button>


                    <button
                        className="add-task-button"
                    >
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