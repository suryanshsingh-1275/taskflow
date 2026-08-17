import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {

    try {

        


        const notifications = await Notification.find({
            recipient: req.user.userId
        })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.userId,
            read: false
        });

        res.status(200).json({

            notifications,

            unreadCount

        });

    } catch (error) {

        console.error("Get Notifications Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};




export const markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(

            {
                _id: id,
                recipient: req.user.userId
            },

            { read: true },

            { new: true }

        );

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found"
            });

        }

        res.status(200).json({

            message: "Marked as read",

            notification

        });

    } catch (error) {

        console.error("Mark As Read Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};





export const markAllAsRead = async (req, res) => {

    try {

        await Notification.updateMany(

            {
                recipient: req.user.userId,
                read: false
            },

            { read: true }

        );

        res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {

        console.error("Mark All As Read Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};