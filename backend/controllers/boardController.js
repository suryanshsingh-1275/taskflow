import Board from "../models/Board.js";


// ==========================================
// CREATE BOARD
// ==========================================

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



// ==========================================
// GET ALL BOARDS
// ==========================================

export const getBoards = async (req, res) => {

    try {

        const boards = await Board.find({

            owner: req.user.userId

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



// ==========================================
// GET SINGLE BOARD
// ==========================================

export const getBoard = async (req, res) => {

    try {

        const { id } = req.params;


        const board = await Board.findOne({

            _id: id,

            owner: req.user.userId

        });


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



// ==========================================
// UPDATE BOARD
// ==========================================
//
// This endpoint is reused for THREE different frontend actions:
//   1. Editing board details        -> { title, description, visibility }
//   2. Toggling favorite            -> { favorite: true/false }
//   3. Toggling archived            -> { archived: true/false }
//
// FIX: The original version always destructured only
// { title, description, visibility } and passed that object straight
// to findOneAndUpdate. That meant a request like { favorite: true }
// updated NOTHING, because "favorite" was never read from req.body.
//
// The fix below only puts a field into the update object if the
// caller actually sent it. That way "favorite: true" doesn't
// accidentally wipe out title/description, and editing the title
// doesn't accidentally wipe out favorite/archived.

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



// ==========================================
// DELETE BOARD
// ==========================================

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