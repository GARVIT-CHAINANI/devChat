import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/login page/Login";
import ChatParent from "./pages/chat page/ChatParent";
import ProfileUpdate from "./pages/profie update page/ProfileUpdate";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/chat",
      element: <ChatParent />,
    },
    {
      path: "/profile",
      element: <ProfileUpdate />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
