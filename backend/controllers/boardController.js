import Board from "../models/Board.js";
import User from "../models/User.js";


// CREATE BOARD

export const createBoard = async (req, res) => {

    try {

        const {
            title,
            description,
            visibility
        } = req.body;


        // Check required field

        if (!title) {

            return res.status(400).json({
                message: "Board title is required"
            });

        }


        // Create board

        const board = await Board.create({

            title,

            description: description || "",

            visibility: visibility || "Private",

            owner: req.user.userId,

            members: [req.user.userId],

            favorite: false,

            archived:false

        });


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

        const boards = await Board.find({

            $or: [
                { owner: req.user.userId },
                { members: req.user.userId }
            ]

        }).sort({

            createdAt: -1

        });


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


        // Only the owner can invite. Scoping the find to
        // { _id: id, owner: req.user.userId } means a non-owner
        // gets a 404 here, same pattern as updateBoard/deleteBoard.

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