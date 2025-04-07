import credentialStyles from "./Credentials.module.css";
import "../style.css";
import companyLogo from "../assets/Wide.png";
import { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./ForgotPassword";

const CredentialsScreen = () => {
  const [credentialsType, setCredentialsType] = useState<
    "login" | "signup" | "forgot"
  >("login");

  return (
    <div id={credentialStyles["container"]}>
      <div id={credentialStyles["center-box"]}>
        <div className="frosty">
          <div id={credentialStyles["lid"]}>
            <img
              src={companyLogo}
              alt="GG Logo"
              draggable="false"
              id={credentialStyles["gg-logo"]}
            />
          </div>
          {credentialsType === "login" ? (
            <Login
              signUp={() => setCredentialsType("signup")}
              forgotPassword={() => setCredentialsType("forgot")}
            />
          ) : null}
          {credentialsType === "signup" ? (
            <Signup signIn={() => setCredentialsType("login")} />
          ) : null}
          {credentialsType === "forgot" ? <ForgotPassword /> : null}
        </div>
      </div>
    </div>
  );
};

export default CredentialsScreen;
