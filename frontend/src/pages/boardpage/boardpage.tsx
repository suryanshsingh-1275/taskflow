import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { useParams } from "react-router-dom";

import Column from "../../components/Column";

import api from "../../api/axios";


// TASK INTERFACE

interface Task {

    _id: string;

    title: string;

    description: string;

    priority: string;

    dueDate: string | null;

    assignee: string | null;

    column: "todo" | "progress" | "review" | "done";

}


// COLUMN INTERFACE

interface ColumnData {

    id: "todo" | "progress" | "review" | "done";

    title: string;

    tasks: Task[];

}


// BOARD INTERFACE

interface Board {

    _id: string;

    title: string;

    description: string;

}


// COMPONENT

const BoardPage = () => {

    const { id } = useParams<{ id: string }>();


    
    // BOARD STATE

    const [board, setBoard] =
        useState<Board | null>(null);


    // COLUMNS STATE

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


    // LOADING

    const [loading, setLoading] =
        useState(true);


    // FETCH TASKS

    const fetchTasks = useCallback(async () => {

        if (!id) {
            return;
        }


        try {

            const res = await api.get(
                `/tasks/board/${id}`
            );


            console.log(
                "Tasks Response:",
                res.data
            );


            const tasks: Task[] =
                res.data.tasks || [];


            // DISTRIBUTE TASKS INTO COLUMNS

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
                "Failed to fetch tasks:",
                error
            );

        }

    }, [id]);


    // FETCH BOARD

    const fetchBoard = useCallback(async () => {

        if (!id) {
            return;
        }


        try {

            const res = await api.get(
                `/boards/${id}`
            );


            console.log(
                "Board Response:",
                res.data
            );


            setBoard(
                res.data.board
            );


        } catch (error) {

            console.error(
                "Failed to fetch board:",
                error
            );

        }

    }, [id]);


    // FETCH BOARD + TASKS

    useEffect(() => {

        const fetchBoardData = async () => {

            setLoading(true);


            try {

                await fetchBoard();

                await fetchTasks();


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

    }, [
        fetchBoard,
        fetchTasks
    ]);


    // LOADING

    if (loading) {

        return (

            <div className="loading">

                Loading board...

            </div>

        );

    }


    // BOARD NOT FOUND

    if (!board) {

        return (

            <div className="no-board">

                Board not found

            </div>

        );

    }


    

    return (

        <div className="board-page-container">


            

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
                        type="button"
                    >
                        Search
                    </button>


                    <button
                        className="add-task-button"
                        type="button"
                    >
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

                            boardId={id!}

                            onTaskCreated={fetchTasks}

                        />

                    ))

                }

            </div>


        </div>

    );

};


export default BoardPage;