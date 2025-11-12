import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png"; // your logo here
import "./authPage.css";
import AuthForm from "../../componets/AuthForm";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isLoginMode = searchParams.get("mode") === "login";

  // ensure ?mode param exists
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (!mode) navigate("?mode=login", { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <a href="https://github.com/GARVIT-CHAINANI">devChat</a>
          <AuthForm
            isLoginMode={isLoginMode}
            formTitle={isLoginMode ? "Log In" : "Sign Up"}
            submitButtonText={isLoginMode ? "Login" : "Register"}
          />
          <footer>
            Built by{" "}
            <a href="https://github.com/GARVIT-CHAINANI" target="_blank">
              Garvit Chainani
            </a>{" "}
            using React.js
          </footer>
        </div>

        <div className="auth-right">
          <div className="content">
            <h1>Welcome!</h1>
            <p>DEVCHAT</p>
          </div>
          <div className="overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
