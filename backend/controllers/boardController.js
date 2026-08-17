import Board from "../models/Board.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getCache, setCache, delCache } from "../utils/cache.js";

const invalidateBoardCache = async (board) => {

    const userIds = [
        board.owner.toString(),
        ...board.members.map((memberId) => memberId.toString()),
    ];

    await Promise.all(
        userIds.flatMap((userId) => [
            delCache(`board:${board._id}:${userId}`),
            delCache(`boards:${userId}`),
        ])
    );

};


// CREATE BOARD

export const createBoard = async (req, res) => {

    try {

        const {
            title,
            description,
            visibility
        } = req.body;


        if (!title) {

            return res.status(400).json({
                message: "Board title is required"
            });

        }


        const board = await Board.create({

            title,

            description: description || "",

            visibility: visibility || "Private",

            owner: req.user.userId,

            members: [req.user.userId],

            favorite: false,

            archived: false

        });


     
        await delCache(`boards:${req.user.userId}`);


        res.status(201).json({

            message: "Board created successfully",

            board

        });

    } catch (error) {

        console.error("Create Board Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

};



// GET ALL BOARDS

export const getBoards = async (req, res) => {

    try {

        const cacheKey = `boards:${req.user.userId}`;

        const cached = await getCache(cacheKey);

        if (cached) {

            return res.status(200).json({ boards: cached });

        }


        const boards = await Board.find({

            $or: [
                { owner: req.user.userId },
                { members: req.user.userId }
            ]

        }).sort({

            createdAt: -1

        });


        
        await setCache(cacheKey, boards, 30);


        res.status(200).json({

            boards

        });

    } catch (error) {

        console.error("Get Boards Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

};



// GET SINGLE BOARD

export const getBoard = async (req, res) => {

    try {

        const { id } = req.params;

        
        const cacheKey = `board:${id}:${req.user.userId}`;

        const cached = await getCache(cacheKey);

        if (cached) {

            return res.status(200).json({ board: cached });

        }


        const board = await Board.findOne({

            _id: id,

            $or: [
                { owner: req.user.userId },
                { members: req.user.userId }
            ]

        })
            .populate("owner", "name email")
            .populate("members", "name email");


        if (!board) {

            return res.status(404).json({

                message: "Board not found"

            });

        }


        await setCache(cacheKey, board, 30);


        res.status(200).json({

            board

        });

    } catch (error) {

        console.error("Get Board Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

};



// UPDATE BOARD

export const updateBoard = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            visibility,
            favorite,
            archived
        } = req.body;


        const updates = {};

        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (visibility !== undefined) updates.visibility = visibility;
        if (favorite !== undefined) updates.favorite = favorite;
        if (archived !== undefined) updates.archived = archived;


        const board = await Board.findOneAndUpdate(

            {
                _id: id,

                owner: req.user.userId
            },

            updates,

            {
                new: true,

                runValidators: true
            }

        );


        if (!board) {

            return res.status(404).json({

                message: "Board not found"

            });

        }


        await invalidateBoardCache(board);


        res.status(200).json({

            message: "Board updated successfully",

            board

        });

    } catch (error) {

        console.error("Update Board Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

};



// DELETE BOARD

export const deleteBoard = async (req, res) => {

    try {

        const { id } = req.params;


        const board = await Board.findOneAndDelete({

            _id: id,

            owner: req.user.userId

        });


        if (!board) {

            return res.status(404).json({

                message: "Board not found"

            });

        }


        
        await invalidateBoardCache(board);


        res.status(200).json({

            message: "Board deleted successfully"

        });

    } catch (error) {

        console.error("Delete Board Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

};



// INVITE MEMBER   (POST /boards/:id/members)

export const inviteMember = async (req, res) => {

    try {

        const { id } = req.params;

        const { email } = req.body;


        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });

        }


        const board = await Board.findOne({
            _id: id,
            owner: req.user.userId
        });

        if (!board) {

            return res.status(404).json({
                message: "Board not found"
            });

        }


        const invitedUser = await User.findOne({ email });

        if (!invitedUser) {

            return res.status(404).json({
                message: "No registered user found with that email"
            });

        }


        const alreadyOwner = board.owner.equals(invitedUser._id);

        const alreadyMember = board.members.some(
            (memberId) => memberId.equals(invitedUser._id)
        );

        if (alreadyOwner || alreadyMember) {

            return res.status(409).json({
                message: "That user is already on this board"
            });

        }


        board.members.push(invitedUser._id);

        await board.save();


        const updatedBoard = await Board.findById(board._id)
            .populate("owner", "name email")
            .populate("members", "name email");


        
        await invalidateBoardCache(updatedBoard);


        const notification = await Notification.create({
            recipient: invitedUser._id,
            type: "board-invite",
            message: `You were added to "${updatedBoard.title}"`,
            relatedBoard: updatedBoard._id,
        });

        const io = req.app.get("io");

        io.to(invitedUser._id.toString()).emit("notification", notification);


        res.status(200).json({

            message: "Member added successfully",

            board: updatedBoard

        });

    } catch (error) {

        console.error("Invite Member Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



// REMOVE MEMBER   (DELETE /boards/:id/members/:memberId)

export const removeMember = async (req, res) => {

    try {

        const { id, memberId } = req.params;


        const board = await Board.findOne({
            _id: id,
            owner: req.user.userId
        });

        if (!board) {

            return res.status(404).json({
                message: "Board not found"
            });

        }


        board.members = board.members.filter(
            (existingMemberId) => existingMemberId.toString() !== memberId
        );

        await board.save();


        const updatedBoard = await Board.findById(board._id)
            .populate("owner", "name email")
            .populate("members", "name email");


       
        await invalidateBoardCache(updatedBoard);
        await delCache(`board:${id}:${memberId}`);
        await delCache(`boards:${memberId}`);


        const notification = await Notification.create({
            recipient: memberId,
            type: "board-removed",
            message: `You were removed from "${updatedBoard.title}"`,
            relatedBoard: updatedBoard._id,
        });

        const io = req.app.get("io");

        io.to(memberId).emit("notification", notification);


        res.status(200).json({

            message: "Member removed successfully",

            board: updatedBoard

        });

    } catch (error) {

        console.error("Remove Member Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};