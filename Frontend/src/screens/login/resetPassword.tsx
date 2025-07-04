import "../../style.css";
import CredentialsStyles from "./credentials.module.css";
import CredentialsScreen from "../../screens/login/credentials.tsx";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useList } from "../../context-hook.tsx";

const ResetPassword = () => {
	const navigate = useNavigate();
	const { userLogout } = useList();

	const handleResetPasswordSubmission = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const password = formData.get("Password") as string;

		try {
			const response = await fetch("/db/user-reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(password),
				credentials: "include",
			});

			if (response.ok) {
				navigate("/login");
				userLogout();
			}
		} catch (error) {
			console.error("Error during login:", error);
		}
	};

	return (
		<CredentialsScreen title="Set a New Password">
			<form onSubmit={handleResetPasswordSubmission}>
				<div id={CredentialsStyles["inputs"]}>
					<label htmlFor="Password" className={CredentialsStyles["label"]}>
						Password
					</label>
					<input
						type="password"
						className={CredentialsStyles["field"]}
						name="Password"
						placeholder="Password"
					/>
				</div>
				<div id={CredentialsStyles["actions"]}>
					<button className={CredentialsStyles["primary"]} type="submit">
						Reset Password
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

export default ResetPassword;
