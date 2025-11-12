import { useState } from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  login,
  signup,
  googleSignInFn,
  githubSignInFn,
} from "../config/firebase";
import { GoogleOutlined, GithubFilled } from "@ant-design/icons";
import "./authForm.css";

const AuthForm = ({ isLoginMode, formTitle, submitButtonText }) => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    userName: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(input.email)) return message.warning("Invalid email!");
    if (input.password.length < 6)
      return message.warning("Password must be at least 6 chars");
    if (!isLoginMode && !input.userName.trim())
      return message.warning("Username is required!");

    try {
      setLoading(true);

      if (isLoginMode) {
        await login(input.email, input.password);
        message.success("Logged in successfully!");
      } else {
        await signup(input.userName, input.email, input.password);
        message.success("Account created successfully!");
      }

      setInput({ email: "", password: "", userName: "" });
      navigate("/chat");
    } catch (err) {
      message.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleThirdParty = async (fn, provider) => {
    try {
      setLoading(true);
      await fn();
      message.success(`Signed in with ${provider}`);
      navigate("/chat");
    } catch {
      message.error(`${provider} sign-in failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{formTitle}</h2>

      {!isLoginMode && (
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={input.userName}
          onChange={handleChange}
          disabled={loading}
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={input.email}
        onChange={handleChange}
        disabled={loading}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={input.password}
        onChange={handleChange}
        disabled={loading}
      />

      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        className="auth-btn"
        onClick={handleSubmit}
      >
        {submitButtonText}
      </Button>

      <div className="divider">OR</div>

      <div className="auth-third-party">
        <Button
          icon={<GoogleOutlined />}
          onClick={() => handleThirdParty(googleSignInFn, "Google")}
          disabled={loading}
        >
          Continue with Google
        </Button>
        <Button
          icon={<GithubFilled />}
          onClick={() => handleThirdParty(githubSignInFn, "GitHub")}
          disabled={loading}
        >
          Continue with GitHub
        </Button>
      </div>

      <p className="switch-mode">
        {isLoginMode ? (
          <>
            Create an account{" "}
            <a
              href="?mode=signup"
              onClick={(e) => {
                e.preventDefault();
                navigate("?mode=signup");
              }}
            >
              Click here
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a
              href="?mode=login"
              onClick={(e) => {
                e.preventDefault();
                navigate("?mode=login");
              }}
            >
              Log In
            </a>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
