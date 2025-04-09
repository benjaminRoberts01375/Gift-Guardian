import credentialStyles from "./credentials.module.css";
import "../../style.css";
import companyLogo from "../../assets/Wide.png";

type CredentialsProps = {
  content: React.ReactNode;
};

const CredentialsScreen = ({ content }: CredentialsProps) => {
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
          {content}
        </div>
      </div>
    </div>
  );
};

export default CredentialsScreen;
