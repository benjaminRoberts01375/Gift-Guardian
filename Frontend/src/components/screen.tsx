import screenStyles from "./screen.module.css";
import "../style.css";
import companyLogo from "../assets/Wide.png";

type ScreenProps = {
  content: React.ReactNode;
  title: string;
};

const Screen = ({ content, title }: ScreenProps) => {
  return (
    <div id={screenStyles["screen"]}>
      <div id={screenStyles["header"]}>
        <img
          src={companyLogo}
          alt="GG Logo"
          draggable="false"
          id={screenStyles["gg-logo"]}
        />
        <h1 id={screenStyles["title"]}>{title}</h1>
        <p id={screenStyles["profile"]}>Placeholder</p>
      </div>
      <div id={screenStyles["content"]}>{content}</div>
    </div>
  );
};

export default Screen;
