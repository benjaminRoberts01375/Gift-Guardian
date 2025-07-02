import "../../style.css";
import CredentialsStyles from "./credentials.module.css";
import CredentialsScreen from "../../screens/login/credentials.tsx";
import { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

interface ResetPasswordParams {
	token?: string;
	[key: string]: string | undefined;
}

const ForgotPasswordSet = () => {
	const navigate = useNavigate();
	const { token } = useParams<ResetPasswordParams>();

	useEffect(() => {
		(async () => {
			console.log("triggered");
			if (!token) {
				// TODO: Redirect to login page with error message
				navigate("/login");
				return;
			}

			try {
				const response = await fetch("/db/user-reset-password-check/" + token, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "omit",
				});
				if (!response.ok) {
					throw new Error("Token is invalid");
				}
				console.log("Token is valid");
			} catch (error) {
				console.error("Error during token check:", error);
				// TODO: Redirect to login page with error message
				navigate("/login");
				return;
			}
		})();
	}, [token, navigate]);

	const handleResetPasswordSubmission = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!token) {
			return;
		}
		const formData = new FormData(event.currentTarget);
		const password = formData.get("Password") as string;

		try {
			const response = await fetch("/db/user-reset-password-confirmation/" + token, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(password),
			});

			if (response.ok) {
				navigate("/login");
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
			</form>
		</CredentialsScreen>
	);
};

export default ForgotPasswordSet;
