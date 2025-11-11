import { useEffect, useState } from "react";
import Chat from "./Chat";
import { getAllUsers } from "../../config/firebase";
import { useAuth } from "../../context/useAuth";

export default function ChatParent() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // object { id, userName, ... }

  useEffect(() => {
    (async () => {
      const all = await getAllUsers();
      // remove current user from list
      setUsers(all.filter((u) => u?.id !== currentUser?.id));
    })();
  }, [currentUser]);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <aside style={{ width: 260, borderRight: "1px solid #ddd" }}>
        <h3>People</h3>
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => setSelectedUser(u)}
            style={{
              padding: 10,
              cursor: "pointer",
              background: selectedUser?.id === u.id ? "#f0f0f0" : "transparent",
            }}
          >
            {u.userName || u.email}
          </div>
        ))}
      </aside>

      <section style={{ flex: 1 }}>
        {selectedUser ? (
          <Chat receiverUid={selectedUser.id} />
        ) : (
          <div style={{ padding: 20 }}>Select a person to start chatting</div>
        )}
      </section>
    </div>
  );
}
