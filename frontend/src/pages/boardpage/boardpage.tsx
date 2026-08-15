import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Column from "../../components/Column";
import InviteMemberModal from "../../components/InviteMemberModal";
import api from "../../api/axios";

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string | null;
    assignee: string | null;
    column: "todo" | "progress" | "review" | "done";
}

interface ColumnData {
    id: "todo" | "progress" | "review" | "done";
    title: string;
    tasks: Task[];
}


interface Member {
    _id: string;
    name: string;
    email: string;
}

interface Board {
    _id: string;
    title: string;
    description: string;
    owner: Member;
    members: Member[];
}

const BoardPage = () => {

    const { id } = useParams<{ id: string }>();

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
    const [showInvite, setShowInvite] = useState(false);


    // FETCH TASKS

    const fetchTasks = async () => {

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

    };


    // FETCH BOARD + TASKS

    useEffect(() => {

        const fetchBoardData = async () => {

            try {

                if (!id) {
                    return;
                }


                // GET BOARD

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


                // GET TASKS

                await fetchTasks();

            } catch (error) {

                console.error(
                    "Failed to fetch board:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchBoardData();

    }, [id]);


    // Called by InviteMemberModal after a successful invite.
    const handleMemberAdded = (updatedBoard: {
        owner: Member;
        members: Member[];
    }) => {

        setBoard((prev) =>
            prev
                ? { ...prev, members: updatedBoard.members }
                : prev
        );

    };


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


            {/* BOARD HEADER */}

            <div className="board-page-header">

                <div className="board-page-info">

                    <h1 className="board-page-title">
                        {board.title}
                    </h1>

                    <p className="board-page-description">
                        {board.description}
                    </p>


                    {/* MEMBER STRIP */}

                    <div className="board-members">

                        <span
                            className="member-chip member-chip-owner"
                            title={`${board.owner.name} (owner)`}
                        >
                            {board.owner.name}
                        </span>

                        {
                            board.members.map((member) => (

                                <span
                                    key={member._id}
                                    className="member-chip"
                                    title={member.email}
                                >
                                    {member.name}
                                </span>

                            ))
                        }

                    </div>

                </div>


                <div className="board-page-actions">

                    <button
                        className="board-search-button"
                    >
                        Search
                    </button>

                    <button
                        className="invite-button"
                        onClick={() => setShowInvite(true)}
                    >
                        + Invite
                    </button>

                    <button
                        className="add-task-button"
                        onClick={() => {
                            // We will handle this later
                            // through the column modal.
                        }}
                    >
                        + Add Task
                    </button>

                </div>

            </div>


            {/* COLUMNS */}

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


            {/* INVITE MODAL */}

            <InviteMemberModal

                isOpen={showInvite}

                boardId={id!}

                onClose={() => setShowInvite(false)}

                onMemberAdded={handleMemberAdded}

            />


        </div>

    );

};

export default BoardPage;