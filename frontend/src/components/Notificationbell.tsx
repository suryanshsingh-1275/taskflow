import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const NotificationBell = () => {

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
    } = useNotifications();

    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();


    const handleNotificationClick = (notification: {
        _id: string;
        read: boolean;
        relatedBoard?: string;
    }) => {

        if (!notification.read) {
            markAsRead(notification._id);
        }

        if (notification.relatedBoard) {
            navigate(`/board/${notification.relatedBoard}`);
        }

        setShowDropdown(false);

    };


    return (

        <div className="notification-bell-container">

            <button
                className="notification-bell-button"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                🔔

                {
                    unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )
                }
            </button>


            {
                showDropdown && (

                    <div className="notification-dropdown">

                        <div className="notification-dropdown-header">

                            <h3>Notifications</h3>

                            {
                                unreadCount > 0 && (
                                    <button
                                        className="notification-mark-all"
                                        onClick={markAllAsRead}
                                    >
                                        Mark all read
                                    </button>
                                )
                            }

                        </div>


                        <div className="notification-list">

                            {
                                notifications.length === 0 ? (

                                    <p className="no-notifications">
                                        No notifications yet
                                    </p>

                                ) : (

                                    notifications.map((notification) => (

                                        <div
                                            key={notification._id}
                                            className={`notification-item ${
                                                notification.read
                                                    ? ""
                                                    : "notification-unread"
                                            }`}
                                            onClick={() =>
                                                handleNotificationClick(notification)
                                            }
                                        >

                                            <p>{notification.message}</p>

                                            <span className="notification-time">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </span>

                                        </div>

                                    ))

                                )
                            }

                        </div>

                    </div>

                )
            }

        </div>

    );

};

export default NotificationBell;