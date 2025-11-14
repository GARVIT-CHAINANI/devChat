import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./authPage.css";
import AuthForm from "../../componets/AuthForm";
import logo from "../../assets/devChat_logo.png";

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
          <a href="https://github.com/GARVIT-CHAINANI">
            <img src={logo} alt="devChat" />
          </a>

          <footer>
            Built by{" "}
            <a
              href="https://github.com/GARVIT-CHAINANI"
              target="_blank"
              rel="noopener noreferrer"
            >
              Garvit Chainani
            </a>{" "}
            using React.js and firebase | A real time chat app | thanks for
            using
          </footer>
        </div>

        <div className="auth-right">
          <div className="content">
            <AuthForm
              isLoginMode={isLoginMode}
              formTitle={isLoginMode ? "Login" : "Sign Up"}
              submitButtonText={isLoginMode ? "Login Now" : "Sign Up Now"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
