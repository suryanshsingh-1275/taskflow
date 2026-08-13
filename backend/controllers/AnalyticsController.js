import Board from "../models/Board.js";
import Task from "../models/Task.js";


export const getAnalytics = async (req, res) => {

    try {

        const boards = await Board.find({
            owner: req.user.userId
        });

        const boardIds = boards.map(
            (board) => board._id
        );

        const tasks = await Task.find({
            board: { $in: boardIds }
        });


        const totalBoards = boards.length;

        const favoriteBoards = boards.filter(
            (board) => board.favorite
        ).length;

        const archivedBoards = boards.filter(
            (board) => board.archived
        ).length;


        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            (task) => task.column === "done"
        ).length;

        const pendingTasks = totalTasks - completedTasks;

        const productivity = totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);


        res.status(200).json({

            analytics: {
                totalBoards,
                totalTasks,
                completedTasks,
                pendingTasks,
                archivedBoards,
                favoriteBoards,
                productivity,
            }

        });

    } catch (error) {

        console.error("Get Analytics Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};