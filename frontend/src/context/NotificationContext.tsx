import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import api from "../api/axios";
import { getSocket } from "../socket";

interface Notification {
    _id: string;
    type: string;
    message: string;
    relatedBoard?: string;
    relatedTask?: string;
    read: boolean;
    createdAt: string;
}

interface NotificationContextValue {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationContext =
    createContext<NotificationContextValue | null>(null);
 

    export const NotificationProvider = ({
    children,
    }: {
    children: React.ReactNode;
    }) => {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }


        const fetchNotifications = async () => {

            try {

                const res = await api.get("/notifications");

                setNotifications(res.data.notifications);

                setUnreadCount(res.data.unreadCount);

            } catch (error) {

                console.error("Fetch Notifications Error:", error);

            }

        };

        fetchNotifications();


        const socket = getSocket();
        
        socket.on("notification", (notification: Notification) => {

            setNotifications((prev) => [notification, ...prev]);

            setUnreadCount((prev) => prev + 1);

        });


        return () => {
            socket.off("notification");
        };

    }, []);


    const markAsRead = async (id: string) => {

        try {

            await api.put(`/notifications/${id}/read`);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - 1));

        } catch (error) {

            console.error("Mark As Read Error:", error);

        }

    };


    const markAllAsRead = async () => {

        try {

            await api.put("/notifications/read-all");

            setNotifications((prev) =>
                prev.map((notification) => ({ ...notification, read: true }))
            );

            setUnreadCount(0);

        } catch (error) {

            console.error("Mark All As Read Error:", error);

        }

    };


    return (

        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>

    );

};


export const useNotifications = () => {

    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used within a NotificationProvider"
        );
    }

    return context;

};