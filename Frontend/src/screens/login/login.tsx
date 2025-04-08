import loginStyles from "./login.module.css";
import credentialStyles from "./Credentials.module.css";
import "../style.css";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [attemptedLogin, setAttemptedLogin] = useState<
    "fresh" | "failed" | "error"
  >("fresh");

  // Define the onSubmit handler as a separate function with proper type for event
  const handleLoginSubmission = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Extract values from the form
    const payload = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/staffLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        console.error("Login failed:", response.status);
        setAttemptedLogin("failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAttemptedLogin("error");
    }
  };

  return (
    <form
      className="frosty"
      id={loginStyles["login-form"]}
      onSubmit={(event) => {
        handleLoginSubmission(event);
      }}
    >
      <LoginText attemptedLogin={attemptedLogin} />
      <div id={credentialStyles["contents"]}>
        <h2 className={credentialStyles["textfield-label"]}>E-Mail Address</h2>
        <input
          className={credentialStyles["field"]}
          name="username"
          placeholder="Username"
        />
        <h2 className={credentialStyles["textfield-label"]}>Password</h2>
        <input
          className={credentialStyles["field"]}
          name="password"
          placeholder="Password"
          type="password"
        />
        <div id={credentialStyles["submit-container"]}>
          <button
            type="button"
            onClick={() => {
              navigate("/forgot-password");
            }}
            className={credentialStyles["secondary"]}
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/sign-up");
            }}
            className={credentialStyles["secondary"]}
            id={loginStyles["signUp"]}
          >
            Sign Up
          </button>
          <input
            id={credentialStyles["primary"]}
            type="submit"
            value="Sign In"
          />
        </div>
      </div>
    </form>
  );
};

// Define interface for LoginText props
interface LoginTextProps {
  attemptedLogin: "fresh" | "failed" | "error";
}

function LoginText({ attemptedLogin }: LoginTextProps) {
  if (attemptedLogin === "failed") {
    return (
      <h1 className="error title" id={loginStyles["login-text"]}>
        Login Failed
      </h1>
    );
  }
  return <h1 id={credentialStyles["title"]}>Welcome</h1>;
}

export default Login;
