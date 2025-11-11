import { useState, useEffect } from "react";
import { sendMessageFn, listenToMessages } from "../../config/firebase";
import "./chat.css";
import { useAuth } from "../../context/useAuth";

const Chat = ({ receiverUid }) => {
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await sendMessageFn(currentUser?.id, receiverUid, text);
    setText("");
  };

  return (
    <main className="main-chat">
      <div className="chat-container">
        <div className="messages">
          {messages.map((m) => (
            <p
              key={m.id}
              className={
                m.senderUid === currentUser.id ? "my-message" : "their-message"
              }
            >
              {m.text}
            </p>
          ))}
        </div>

        <form onSubmit={handleSend} className="input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
