import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { getSocket } from "../socket";

interface Message {
    _id: string;
    text: string;
    sender: {
        _id: string;
        name: string;
    };
    attachmentUrl?: string | null;
    attachmentName?: string | null;
    attachmentType?: "pdf" | "doc" | "image" | "other" | null;
    createdAt: string;
}

interface BoardChatProps {
    boardId: string;
}


const linkify = (text: string) => {

    const urlPattern = /(https?:\/\/[^\s]+)/g;

    return text.split(urlPattern).map((part, index) =>
        urlPattern.test(part) ? (
            <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-link"
            >
                {part}
            </a>
        ) : (
            part
        )
    );

};


const BoardChat = ({ boardId }: BoardChatProps) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");


    // Load history once, over REST, when the chat panel is first
    // opened for this board.
    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const fetchMessages = async () => {

            try {

                const res = await api.get(
                    `/messages/board/${boardId}`
                );

                setMessages(res.data.messages);

            } catch (error) {

                console.error("Fetch Messages Error:", error);

            }

        };

        fetchMessages();

    }, [isOpen, boardId]);


    
    useEffect(() => {

        const socket = getSocket();

        socket.emit("join-board", boardId);

        socket.on("new-message", (message: Message) => {

            setMessages((prev) => [...prev, message]);

        });

        return () => {
            socket.off("new-message");
        };

    }, [boardId]);


    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages]);


    
    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setUploading(true);

        try {

            const formData = new FormData();

            formData.append("file", file);

            const res = await api.post(
                "/messages/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const socket = getSocket();

            socket.emit("send-message", {
                boardId,
                text: "",
                attachmentUrl: res.data.attachmentUrl,
                attachmentName: res.data.attachmentName,
                attachmentType: res.data.attachmentType,
            });

        } catch (error) {

            console.error("Upload Error:", error);

        } finally {

            setUploading(false);

            
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        }

    };


    const handleSend = () => {

        if (text.trim() === "") {
            return;
        }

        const socket = getSocket();

        socket.emit("send-message", {
            boardId,
            text: text.trim(),
        });

        setText("");

    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === "Enter") {
            handleSend();
        }

    };


    return (

        <div className={`board-chat ${isOpen ? "board-chat-open" : ""}`}>

            <button
                className="board-chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬 Chat
            </button>

            {
                isOpen && (

                    <div className="board-chat-panel">

                        <div className="board-chat-messages">

                            {
                                messages.length === 0 ? (

                                    <p className="no-messages">
                                        No messages yet — say something.
                                    </p>

                                ) : (

                                    messages.map((message) => {

                                        const isOwnMessage =
                                            message.sender._id === currentUser?._id;

                                        return (

                                            <div
                                                key={message._id}
                                                className={`chat-message ${
                                                    isOwnMessage ? "chat-message-own" : ""
                                                }`}
                                            >

                                                <span className="chat-sender">
                                                    {isOwnMessage ? "You" : message.sender.name}
                                                </span>

                                                {
                                                    message.attachmentUrl && (

                                                        message.attachmentType === "image" ? (

                                                            <a
                                                                href={message.attachmentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <img
                                                                    src={message.attachmentUrl}
                                                                    alt={message.attachmentName || "attachment"}
                                                                    className="chat-attachment-image"
                                                                />
                                                            </a>

                                                        ) : (

                                                            <a
                                                                href={message.attachmentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="chat-attachment-file"
                                                            >
                                                                📄 {message.attachmentName}
                                                            </a>

                                                        )

                                                    )
                                                }

                                                {
                                                    message.text && (
                                                        <p className="chat-text">
                                                            {linkify(message.text)}
                                                        </p>
                                                    )
                                                }

                                                <span className="chat-time">
                                                    {new Date(
                                                        message.createdAt
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>

                                            </div>

                                        );

                                    })

                                )
                            }

                            <div ref={messagesEndRef} />

                        </div>


                        <div className="board-chat-input-row">

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />

                            <button
                                className="board-chat-attach"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                title="Attach a file"
                            >
                                {uploading ? "..." : "📎"}
                            </button>

                            <input
                                className="board-chat-input"
                                type="text"
                                placeholder="Type a message or paste a link..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />

                            <button
                                className="board-chat-send"
                                onClick={handleSend}
                            >
                                Send
                            </button>

                        </div>

                    </div>

                )
            }

        </div>

    );

};

export default BoardChat;