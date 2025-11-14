import { useEffect, useState } from "react";
import Chat from "./Chat";
import { getAllUsers, logoutFN } from "../../config/firebase";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, MessageCircle, User } from "lucide-react";
import "./chat.css";

export default function ChatParent() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const all = await getAllUsers();
      setUsers(all.filter((u) => u?.id !== currentUser?.id));
    })();
  }, [currentUser]);

  console.log(users);

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">
            <MessageCircle size={24} />
            <h2>Messages</h2>
          </div>
          <button
            className="logout-button"
            onClick={() => {
              logoutFN();
              navigate("/");
            }}
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="users-list">
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`user-item ${
                selectedUser?.id === u.id ? "active" : ""
              }`}
            >
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <h4>{u.userName || u.email}</h4>
                {/* <span className="user-status online">Online</span> */}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-main-area">
        {selectedUser ? (
          <Chat
            receiverUid={selectedUser.id}
            receiverName={selectedUser.userName || selectedUser.email}
          />
        ) : (
          <div className="empty-state">
            <MessageCircle size={64} />
            <h3>Select a conversation</h3>
            <p>Choose a person from the sidebar to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}
