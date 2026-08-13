import User from "../models/User.js";
import Board from "../models/Board.js";
import Task from "../models/Task.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// SIGNUP

export const signup = async (req, res) => {

    try {

        const {
            name,
            age,
            email,
            password,
            phone,
            role
        } = req.body;


        // Check required fields

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        // Check if user already exists

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {

            return res.status(409).json({
                message: "User already exists"
            });

        }


        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create user

        const user = await User.create({

            name,

            age,

            email,

            password: hashedPassword,

            phone,

            role: role || "user"

        });


        // Don't send password back

        const userResponse = user.toObject();

        delete userResponse.password;


        res.status(201).json({

            message: "User created successfully",

            user: userResponse

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error"

        });

    }

};



// =========================
// LOGIN
// =========================

export const login = async (req, res) => {

    try {

        const {
            email,
            phone,
            password
        } = req.body;


        // Email OR phone + password

        if ((!email && !phone) || !password) {

            return res.status(400).json({
                message: "Email or phone and password are required"
            });

        }


        // Find user using email OR phone

        const user = await User.findOne(
            email
                ? { email }
                : { phone }
        );


        if (!user) {

            return res.status(401).json({
                message: "Invalid email/phone or password"
            });

        }


        // Compare password

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: "Invalid email/phone or password"
            });

        }


        // Create JWT

        const token = jwt.sign(

            {
                userId: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // Remove password from response

        const userResponse =
            user.toObject();

        delete userResponse.password;


        res.status(200).json({

            message: "Login successful",

            token,

            user: userResponse

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.userId
        ).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // Boards owned by this user

        const boards = await Board.find({
            owner: req.user.userId
        });

        const totalBoards = boards.length;

        const favoriteBoards = boards.filter(
            (board) => board.favorite
        ).length;

        const boardIds = boards.map(
            (board) => board._id
        );


        // Tasks that belong to any of those boards, sitting in "done"

        const completedTasks = await Task.countDocuments({
            board: { $in: boardIds },
            column: "done"
        });


        res.status(200).json({

            user: {
                _id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                phone: user.phone,
                photo: user.avatar,
                bio: user.bio,
                role: user.role,
                joinedOn: user.createdAt,
                totalBoards,
                completedTasks,
                favoriteBoards,
            }

        });

    } catch (error) {

        console.error("Get Profile Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};