import { useState } from "react";
import api from "../api/axios";

interface Member {
    _id: string;
    name: string;
    email: string;
}

interface InviteMemberModalProps {
    isOpen: boolean;
    boardId: string;

    onClose: () => void;

    
    onMemberAdded: (updatedBoard: {
        owner: Member;
        members: Member[];
    }) => void;
}

const InviteMemberModal = ({
    isOpen,
    boardId,
    onClose,
    onMemberAdded,
}: InviteMemberModalProps) => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleInvite = async () => {

        if (email.trim() === "") {
            setError("Email is required");
            return;
        }

        setLoading(true);
        setError("");

        try {

            const res = await api.post(
                `/boards/${boardId}/members`,
                { email: email.trim() }
            );

            onMemberAdded(res.data.board);

            setEmail("");
            onClose();

        } catch (err: any) {

            console.error("Invite Member Error:", err);

            setError(
                err.response?.data?.message ||
                "Could not add that member"
            );

        } finally {

            setLoading(false);

        }

    };


    if (!isOpen) {
        return null;
    }


    return (

        <div className="modal-overlay">

            <div className="modal-container">

                <div className="modal-header">

                    <h2 className="modal-title">
                        Invite Member
                    </h2>

                </div>


                <div className="modal-body">

                    <div className="form-group">

                        <label className="form-label">
                            Email of registered user
                        </label>

                        <input
                            className="form-input"
                            type="email"
                            placeholder="teammate@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                        />

                        {
                            error && (
                                <p className="form-error">
                                    {error}
                                </p>
                            )
                        }

                    </div>

                </div>


                <div className="modal-footer">

                    <button
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="create-button"
                        onClick={handleInvite}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Member"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default InviteMemberModal;