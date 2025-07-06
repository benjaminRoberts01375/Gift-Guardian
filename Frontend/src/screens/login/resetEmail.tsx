import "../../style.css";
import CredentialsStyles from "./credentials.module.css";
import CredentialsScreen from "./credentials.tsx";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useList } from "../../context-hook.tsx";

const ResetEmail = () => {
	const navigate = useNavigate();
	const { userLogout } = useList();

	const handleResetEmailSubmission = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const username = formData.get("Username") as string;

		try {
			const response = await fetch("/db/user-reset-email-request", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(username),
				credentials: "include",
			});

			if (response.ok) {
				navigate("/check-email", { state: { userEmail: username } });
				userLogout();
			}
		} catch (error) {
			console.error("Error during login:", error);
		}
	};

	return (
		<CredentialsScreen title="Set a New Username">
			<form onSubmit={handleResetEmailSubmission}>
				<div id={CredentialsStyles["inputs"]}>
					<label htmlFor="Username" className={CredentialsStyles["label"]}>
						Username
					</label>
					<input
						type="username"
						className={CredentialsStyles["field"]}
						name="Username"
						placeholder="E-Mail"
					/>
				</div>
				<div id={CredentialsStyles["actions"]}>
					<button className={CredentialsStyles["primary"]} type="submit">
						Reset Username
					</button>
				</div>
				<div id={CredentialsStyles["secondary-actions"]}>
					<button
						className={CredentialsStyles["secondary"]}
						onClick={event => {
							event.preventDefault();
							navigate("/dashboard");
						}}
					>
						Back to Dashboard
					</button>
				</div>
			</form>
		</CredentialsScreen>
	);
};

export default ResetEmail;
