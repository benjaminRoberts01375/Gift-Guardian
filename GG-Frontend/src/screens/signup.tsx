import loginStyles from "./login.module.css";
import signupStyles from "./signup.module.css";
import "../style.css";
import companyLogo from "../assets/Wide.png";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const SignUpScreen = () => {
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
        credentials: "include", // Add this line to handle cookies
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

  const signIn = () => {
    navigate("/");
  };

  return (
    <div id={loginStyles["container"]}>
      <div id={loginStyles["center-box"]}>
        <form
          className="frosty"
          id={loginStyles["login-form"]}
          onSubmit={(event) => {
            handleLoginSubmission(event);
          }}
        >
          <div id={loginStyles["lid"]}>
            <img
              src={companyLogo}
              alt="GG Logo"
              draggable="false"
              id={loginStyles["gg-logo"]}
            />
          </div>
          <LoginText attemptedLogin={attemptedLogin} />
          <div id={loginStyles["contents"]}>
            <h2 className={loginStyles["textfield-label"]}>E-Mail Address</h2>
            <input
              className={loginStyles["field"]}
              name="username"
              placeholder="Username"
            />
            <h2 className={loginStyles["textfield-label"]}>Password</h2>
            <input
              className={loginStyles["field"]}
              name="password"
              placeholder="Password"
              type="password"
            />
            <div id={signupStyles["name-container"]}>
              <div className={signupStyles["name-field"]}>
                <h2 className={loginStyles["textfield-label"]}>First Name</h2>
                <input
                  placeholder="First Name"
                  name="firstName"
                  type="text"
                  className={loginStyles["field"]}
                />
              </div>
              <div
                className={signupStyles["name-field"]}
                id={signupStyles["last-name-field"]}
              >
                <h2 className={loginStyles["textfield-label"]}>Last Name</h2>
                <input
                  placeholder="Last Name"
                  name="lastName"
                  type="text"
                  className={loginStyles["field"]}
                />
              </div>
            </div>
            <div id={loginStyles["submit-container"]}>
              <button onClick={signIn} id={loginStyles["switch"]}>
                Already have an account?
              </button>
              <input id={loginStyles["submit"]} type="submit" value="Sign Up" />
            </div>
          </div>
        </form>
      </div>
    </div>
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
  return <h1 id={loginStyles["login-text"]}>Sign Up</h1>;
}

export default SignUpScreen;
