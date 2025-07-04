import "../../style.css";
import CredentialsStyles from "./credentials.module.css";
import CredentialsScreen from "../../screens/login/credentials.tsx";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
	const navigate = useNavigate();
	function handleResetPasswordSubmission(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		email.trim();
		fetch("/db/user-forgot-password-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(email),
		});
		navigate("/check-email");
	}

	return (
		<CredentialsScreen title="Forgot Your Password?">
			<form onSubmit={handleResetPasswordSubmission}>
				<div id={CredentialsStyles["inputs"]}>
					<label htmlFor="email" className={CredentialsStyles["label"]}>
						Username
					</label>
					<input
						type="text"
						className={CredentialsStyles["field"]}
						name="email"
						placeholder="E-Mail Address"
					/>
				</div>
				<div id={CredentialsStyles["actions"]}>
					<button className={CredentialsStyles["primary"]} type="submit">
						Send Reset Link
					</button>
					<div id={CredentialsStyles["secondary-actions"]}>
						<button
							className={CredentialsStyles["secondary"]}
							onClick={event => {
								event.preventDefault();
								navigate("/login");
							}}
						>
							Back to Login
						</button>
					</div>
				</div>
			</form>
		</CredentialsScreen>
	);
};

export default ForgotPassword;
