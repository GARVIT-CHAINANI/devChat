import { useState, useEffect } from "react";
import { sendMessageFn, listenToMessages } from "../../config/firebase";
import { useAuth } from "../../context/useAuth";
import { Send, User } from "lucide-react";
import "./chat.css";

const Chat = ({ receiverUid, receiverName }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.id || !receiverUid) return;

    const chatId =
      currentUser.id > receiverUid
        ? currentUser.id + receiverUid
        : receiverUid + currentUser.id;

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, receiverUid]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessageFn(currentUser?.id, receiverUid, text);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-section">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <User size={24} />
          </div>
          <div className="chat-header-details">
            <h3>{receiverName}</h3>
            {/* <span className="status-online">Online</span> */}
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`message-wrapper ${
              m.senderUid === currentUser.id
                ? "message-sent"
                : "message-received"
            }`}
          >
            <div className="message-bubble">
              <p className="message-text">{m.text}</p>
              <span className="message-time">{formatTime(m.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="message-input-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="message-input"
        />
        <button onClick={handleSend} className="send-button">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
