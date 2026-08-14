import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Event {

    id: number;

    title: string;

    description: string;

    date: string;

    time: string;

    priority: string;

    completed: boolean;

}

const Calendar = () => {

    const [events, setEvents] = useState<Event[]>([]);

    const handleAddEvent = () => {

        console.log("Open Add Event Modal");

    };

    const handleToday = () => {

        console.log("Go To Today");

    };

    const handlePreviousMonth = () => {

        console.log("Previous Month");

    };

    const handleNextMonth = () => {

        console.log("Next Month");

    };

    useEffect(() => {

        const fetchEvents = async () => {

            try {

                const res = await api.get("/tasks/calendar");

                setEvents(res.data.tasks);


                

            }

            catch (err) {

                console.error(err);

            }

        };

        fetchEvents();

    }, []);

    return (

        <div className="calendar-container">

            <div className="calendar-header">

                <div className="calendar-month">

                    <button
                        className="month-button"
                        onClick={handlePreviousMonth}
                    >
                        ◀
                    </button>

                    <h1 className="calendar-title">
                        August 2026
                    </h1>

                    <button
                        className="month-button"
                        onClick={handleNextMonth}
                    >
                        ▶
                    </button>

                </div>

                <div className="calendar-actions">

                    <button
                        className="today-button"
                        onClick={handleToday}
                    >
                        Today
                    </button>

                    <button
                        className="add-event-button"
                        onClick={handleAddEvent}
                    >
                        + Add Event
                    </button>

                </div>

            </div>

            <div className="calendar-grid">

                <div className="day-name">Mon</div>
                <div className="day-name">Tue</div>
                <div className="day-name">Wed</div>
                <div className="day-name">Thu</div>
                <div className="day-name">Fri</div>
                <div className="day-name">Sat</div>
                <div className="day-name">Sun</div>

                {

                    Array.from({ length: 35 }).map((_, index) => (

                        <div
                            key={index}
                            className="calendar-day"
                        >

                            <span className="day-number">

                                {index + 1 <= 31 ? index + 1 : ""}

                            </span>

                        </div>

                    ))

                }

            </div>

            <div className="events-section">

                <h2 className="events-title">

                    Upcoming Events

                </h2>

                {

                    events.length === 0 ?

                        <div className="no-events">

                            <p>

                                No Upcoming Events

                            </p>

                        </div>

                        :

                        events.map((event) => (

                            <div
                                key={event.id}
                                className="event-card"
                            >

                                <h3 className="event-title">

                                    {event.title}

                                </h3>

                                <p className="event-description">

                                    {event.description}

                                </p>

                                <div className="event-details">

                                    <p>

                                         {event.date}

                                    </p>

                                    <p>

                                         {event.time}

                                    </p>

                                    <p>

                                         {event.priority}

                                    </p>

                                </div>

                            </div>

                        ))

                }

            </div>

        </div>

    );

};

export default Calendar;