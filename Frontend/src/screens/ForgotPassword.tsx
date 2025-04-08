import forgotPasswordStyles from "./forgotPassword.module.css";
import credentialsStyles from "./Credentials.module.css";
import "../style.css";
import { useState, FormEvent } from "react";

const ForgotPassword = () => {
  const [attemptedLogin, setAttemptedReset] = useState<
    "fresh" | "failed" | "error"
  >("fresh");

  // Define the onSubmit handler as a separate function with proper type for event
  const handleForgotSubmission = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Extract values from the form
    const payload = {
      username: formData.get("email") as string,
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

      if (!response.ok) {
        console.error("Password failed:", response.status);
        setAttemptedReset("failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAttemptedReset("error");
    }
  };

  return (
    <form
      className="frosty"
      id={credentialsStyles["login-form"]}
      onSubmit={(event) => {
        handleForgotSubmission(event);
      }}
    >
      <LoginText attemptedLogin={attemptedLogin} />
      <div id={credentialsStyles["contents"]}>
        <h2 className={credentialsStyles["textfield-label"]}>E-Mail Address</h2>
        <input
          className={credentialsStyles["field"]}
          name="username"
          placeholder="Username"
        />
        <div id={credentialsStyles["submit-container"]}>
          <input
            id={credentialsStyles["primary"]}
            className={forgotPasswordStyles["submit"]}
            type="submit"
            value="Forgot Password"
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
      <h1 className="error title" id={credentialsStyles["title"]}>
        Email Sent
      </h1>
    );
  }
  return <h1 id={credentialsStyles["title"]}>Forgot Password</h1>;
}

export default ForgotPassword;
