import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ChatParent from "./pages/chat page/ChatParent";
import ProfileUpdate from "./pages/profie update page/ProfileUpdate";
import { AuthProvider } from "./context/AuthProvider";
import AuthPage from "./pages/authentication page/AuthPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPage />,
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
