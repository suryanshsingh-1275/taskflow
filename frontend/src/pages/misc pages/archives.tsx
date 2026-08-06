import { useEffect, useState } from "react";
import axios from "axios";
import BoardCard from "../../components/BoardCard";

interface ArchivedBoard {

    id: number;

    title: string;

    description: string;

    members: number;

    tasks: number;

    completedTasks: number;

    favorite: boolean;

}

const Archived = () => {

    const [archivedBoards, setArchivedBoards] = useState<ArchivedBoard[]>([]);

    useEffect(() => {

        const fetchArchivedBoards = async () => {

            try {

                // Later

                // const res = await axios.get("http://localhost:5000/boards/archived");

                // setArchivedBoards(res.data);

                console.log("Fetch Archived Boards");

            }

            catch (err) {

                console.error(err);

            }

        };

        fetchArchivedBoards();

    }, []);

    return (

        <div className="archived-container">

            <div className="archived-header">

                <h1 className="archived-title">
                    Archived Boards
                </h1>

            </div>

            <div className="boards-container">

                {

                    archivedBoards.length === 0 ?

                        <div className="no-boards">

                            <h2>
                                No Archived Boards
                            </h2>

                            <p>
                                Archived boards will appear here.
                            </p>

                        </div>

                        :

                        archivedBoards.map((board) => (

                            <BoardCard

                                key={board.id}

                                title={board.title}

                                description={board.description}

                                members={board.members}

                                tasks={board.tasks}

                                completedTasks={board.completedTasks}

                                favorite={board.favorite}

                            />

                        ))

                }

            </div>

        </div>

    );

};

export default Archived;