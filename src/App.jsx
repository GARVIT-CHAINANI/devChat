import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ChatParent from "./pages/chat page/ChatParent";
import ProfileUpdate from "./pages/profie update page/ProfileUpdate";
import { AuthProvider } from "./context/AuthProvider";
import AuthPage from "./pages/authentication page/AuthPage";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      ),
    },
    {
      element: (
        <AuthProvider>
          <ProtectedRoutes />
        </AuthProvider>
      ),
      children: [
        {
          path: "/chat",
          element: <ChatParent />,
        },
      ],
    },
    {
      path: "/profile",
      element: (
        <AuthProvider>
          <ProfileUpdate />
        </AuthProvider>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
