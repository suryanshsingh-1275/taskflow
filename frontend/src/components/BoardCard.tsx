import React,{useState} from "react";


interface BoardCardProps {

    title: string;
    description: string;
    members: number;
    tasks: number;
    completedTasks: number;
    favorite: boolean;

}

const BoardCard = ({
    title,
    description,
    members,
    tasks,
    completedTasks,
    favorite,
}: BoardCardProps) => {

    const progress = tasks === 0
        ? 0
        : Math.round((completedTasks / tasks) * 100);


    
    


    const [showMenu, setShowMenu] = useState(false);

    const handleThreeDots = (e: React.MouseEvent<HTMLButtonElement>) => {

    e.stopPropagation();

    setShowMenu(!showMenu);

     };


    return (

        <div className="board-card">

            <div className="board-header">

                <h2 className="board-title">
                    {title}
                </h2>

                <span className="board-favorite">
                    {favorite ? "⭐" : "☆"}
                </span>

            </div>

            <div className="board-body">

                <p className="board-description">
                    {description}
                </p>

                <div className="board-info">

                    <p>
                        👥 {members} Members
                    </p>

                    <p>
                        📝 {tasks} Tasks
                    </p>

                </div>

                <div className="progress-div">

                    <div className="progress-bar">

                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`,
                            }}
                        ></div>

                    </div>

                    <p className="progress-text">
                        {progress}% Complete
                    </p>

                </div>

            </div>

            <div className="board-footer">


                <button className="menu-button" onClick={handleThreeDots}>
                    ⋮
                </button>

                {
                showMenu && (

                <div className="menu">

                <button>Edit</button>

                <button>Favorite</button>

                <button>Archive</button>

                <button>Delete</button>

                </div>

             )
             }

            </div>

        </div>

    );

};

export default BoardCard;