import signupStyles from "./signup.module.css";
import credentialsStyles from "./Credentials.module.css";
import "../style.css";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type SignupProps = {
  signIn: () => void;
};

const SignUp: React.FC<SignupProps> = ({ signIn }) => {
  const navigate = useNavigate();
  const [attemptedLogin, setAttemptedLogin] = useState<"fresh" | "failed">(
    "fresh",
  );

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
      setAttemptedLogin("failed");
    }
  };

  return (
    <form
      className="frosty"
      id={credentialsStyles["login-form"]}
      onSubmit={(event) => {
        handleLoginSubmission(event);
      }}
    >
      <TitleText attemptedLogin={attemptedLogin} />
      <div id={credentialsStyles["contents"]}>
        <h2 className={credentialsStyles["textfield-label"]}>E-Mail Address</h2>
        <input
          className={credentialsStyles["field"]}
          name="username"
          placeholder="Username"
        />
        <h2 className={credentialsStyles["textfield-label"]}>Password</h2>
        <input
          className={credentialsStyles["field"]}
          name="password"
          placeholder="Password"
          type="password"
        />
        <div id={signupStyles["name-container"]}>
          <div className={signupStyles["name-field"]}>
            <h2 className={credentialsStyles["textfield-label"]}>First Name</h2>
            <input
              placeholder="First Name"
              name="firstName"
              type="text"
              className={credentialsStyles["field"]}
            />
          </div>
          <div
            className={signupStyles["name-field"]}
            id={signupStyles["last-name-field"]}
          >
            <h2 className={credentialsStyles["textfield-label"]}>Last Name</h2>
            <input
              placeholder="Last Name"
              name="lastName"
              type="text"
              className={credentialsStyles["field"]}
            />
          </div>
        </div>
        <div id={credentialsStyles["submit-container"]}>
          <button
            type="button"
            onClick={signIn}
            className={credentialsStyles["secondary"]}
            id={signupStyles["account-exists"]}
          >
            Already have an account?
          </button>
          <input
            id={credentialsStyles["primary"]}
            type="submit"
            value="Sign Up"
          />
        </div>
      </div>
    </form>
  );
};

// Define interface for LoginText props
interface TitleTextProps {
  attemptedLogin: "fresh" | "failed";
}

function TitleText({ attemptedLogin }: TitleTextProps) {
  if (attemptedLogin === "failed") {
    return (
      <h1 className="error title" id={credentialsStyles["title"]}>
        Login Failed
      </h1>
    );
  }
  return <h1 id={credentialsStyles["title"]}>Sign Up</h1>;
}

export default SignUp;
