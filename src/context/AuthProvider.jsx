import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { auth, getUserData } from "../config/firebase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            setCurrentUser({ id: user.uid, ...userData });
          } else {
            setCurrentUser({ id: user.uid, email: user.email });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
        console.log("No user logged in");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  console.log("User:", currentUser);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
