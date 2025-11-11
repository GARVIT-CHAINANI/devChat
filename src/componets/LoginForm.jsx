import { useState } from "react";
import { Button, message } from "antd";
import { signup, login } from "../config/firebase"; // ✅ import both
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [isLoginState, setIsLoginState] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLoginState && !userName)) {
      return message.warning("Please fill all fields!");
    }

    try {
      setLoading(true);

      if (isLoginState) {
        // ✅ LOGIN
        await login(email, password);
        message.success("Logged in successfully!");
      } else {
        // ✅ SIGNUP
        await signup(userName, email, password);
        message.success("Account created successfully!");
      }

      // Reset form
      setUserName("");
      setEmail("");
      setPassword("");

      navigate("/chat");
    } catch (err) {
      message.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={submitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "250px",
          margin: "0 auto",
        }}
      >
        {!isLoginState && (
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
        )}

        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <Button type="primary" htmlType="submit" loading={loading}>
          {isLoginState ? "Log In" : "Sign Up"}
        </Button>
      </form>

      <Button
        type="link"
        onClick={() => setIsLoginState(!isLoginState)}
        style={{ display: "block", margin: "20px auto" }}
      >
        {isLoginState
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </Button>
    </>
  );
};

export default LoginForm;
