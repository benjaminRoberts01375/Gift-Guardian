import "../../style.css";
import CredentialsStyles from "./credentials.module.css";
import companyLogo from "../../assets/Wide.png";
import { ReactNode } from "react";

interface CredentialsScreenProps {
	title: string;
	children: ReactNode;
}

const CredentialsScreen = ({ title, children }: CredentialsScreenProps) => {
	return (
		<div id={CredentialsStyles["container"]}>
			<div id={CredentialsStyles["wrapper"]}>
				<div id={CredentialsStyles["lid"]}>
					<img src={companyLogo} alt="GG Logo" draggable="false" id={CredentialsStyles["logo"]} />
				</div>
				<h1 id={CredentialsStyles["title"]}>{title}</h1>
				<div id={CredentialsStyles["content"]}>{children}</div>
			</div>
		</div>
	);
};

export default CredentialsScreen;
