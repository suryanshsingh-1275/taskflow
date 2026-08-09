import { useEffect, useState } from "react";
import axios from "axios";

interface Analytics {

    totalBoards: number;

    totalTasks: number;

    completedTasks: number;

    pendingTasks: number;

    archivedBoards: number;

    favoriteBoards: number;

    productivity: number;

}

const Analytics = () => {

    const [analytics, setAnalytics] = useState<Analytics | null>(null);

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                // Later

                // const res = await axios.get("http://localhost:5000/analytics");

                // setAnalytics(res.data);

                console.log("Fetch Analytics");

            }

            catch (err) {

                console.error(err);

            }

        };

        fetchAnalytics();

    }, []);

    return (

        <div className="analytics-container">

            <div className="analytics-header">

                <h1 className="analytics-title">
                    Analytics
                </h1>

            </div>

            {

                analytics === null ?

                <div className="analytics-loading">

                    <p>
                        Loading Analytics...
                    </p>

                </div>

                :

                <div className="analytics-content">

                    <div className="analytics-grid">

                        <div className="analytics-card">

                            <h3>
                                Total Boards
                            </h3>

                            <p>
                                {analytics.totalBoards}
                            </p>

                        </div>

                        <div className="analytics-card">

                            <h3>
                                Total Tasks
                            </h3>

                            <p>
                                {analytics.totalTasks}
                            </p>

                        </div>

                        <div className="analytics-card">

                            <h3>
                                Completed Tasks
                            </h3>

                            <p>
                                {analytics.completedTasks}
                            </p>

                        </div>

                        <div className="analytics-card">

                            <h3>
                                Pending Tasks
                            </h3>

                            <p>
                                {analytics.pendingTasks}
                            </p>

                        </div>

                        <div className="analytics-card">

                            <h3>
                                Favorite Boards
                            </h3>

                            <p>
                                {analytics.favoriteBoards}
                            </p>

                        </div>

                        <div className="analytics-card">

                            <h3>
                                Archived Boards
                            </h3>

                            <p>
                                {analytics.archivedBoards}
                            </p>

                        </div>

                        <div className="analytics-card">

                            <h3>
                                Productivity
                            </h3>

                            <p>
                                {analytics.productivity}%
                            </p>

                        </div>

                    </div>

                    <div className="charts-section">

                        <div className="chart-card">

                            <h2>
                                Weekly Productivity
                            </h2>

                        </div>

                        <div className="chart-card">

                            <h2>
                                Tasks Completed
                            </h2>

                        </div>

                    </div>

                </div>

            }

        </div>

    );

};

export default Analytics;