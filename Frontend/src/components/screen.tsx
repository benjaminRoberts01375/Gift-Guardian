import React, { useState, useEffect } from "react"; // Import useState and useEffect
import screenStyles from "./screen.module.css";
import "../style.css";
import companyLogo from "../assets/Wide.png";
import { useList } from "../context-hook.tsx";

type ScreenProps = {
	content: React.ReactNode;
	title: string;
};

const Screen = ({ content, title }: ScreenProps) => {
	const [isTitleVisible, setIsTitleVisible] = useState(window.innerWidth > 700);
	const { userLogout } = useList();
	useEffect(() => {
		const handleResize = () => {
			setIsTitleVisible(window.innerWidth > 700);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div id={screenStyles["screen"]}>
			<div id={screenStyles["header"]} className="primary">
				<img src={companyLogo} alt="GG Logo" draggable="false" id={screenStyles["gg-logo"]} />
				{isTitleVisible ? <h1 id={screenStyles["title"]}>{title}</h1> : null}
				<button id={screenStyles["profile"]} onClick={() => userLogout()}>
					Logout
				</button>
			</div>
			<div id={screenStyles["content"]}>{content}</div>
		</div>
	);
};

export default Screen;
