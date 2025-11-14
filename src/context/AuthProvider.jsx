import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { auth, getUserData } from "../config/firebase";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const firstCheck = useRef(true); // prevent redirect on refresh

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);

          setCurrentUser(
            userData
              ? { id: user.uid, ...userData }
              : { id: user.uid, email: user.email }
          );

          // redirect ONLY when user just logged in
          if (!firstCheck.current) {
            navigate("/chat");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
      firstCheck.current = false; // after first state check
    });

    return unsubscribe;
  }, []);

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
