import "../../style.css";
import CredentialsStyles from "./credentials.module.css";
import CredentialsScreen from "../../screens/login/credentials.tsx";
import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useList } from "../../context-hook.tsx";

const Login = () => {
	const { userRequestData } = useList();
	const [failedLogin, setSetFailedLogin] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleLoginSubmission = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		// Extract values from the form
		const payload = {
			username: formData.get("username") as string,
			password: formData.get("password") as string,
		};

		try {
			const response = await fetch("/db/userSignIn", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
				credentials: "include",
			});

			if (response.ok) {
				userRequestData(); // Setup the context
				navigate("/dashboard");
			} else {
				console.error("Login failed:", response.status);
				throw new Error("Login failed");
			}
		} catch (error) {
			console.error("Error during login:", error);
			setSetFailedLogin(true);
		}
	};

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			try {
				const response = await fetch("/db/userJWTSignIn", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				if (response.ok) {
					userRequestData(); // Setup the context
					navigate("/dashboard");
				}
			} catch (error) {
				console.error("Error during login:", error);
			}
		};

		checkIfLoggedIn();
	}, [navigate, userRequestData]);

	return (
		<CredentialsScreen title={failedLogin ? "Login Failed" : "Welcome"}>
			<form onSubmit={handleLoginSubmission}>
				<div id={CredentialsStyles["inputs"]}>
					<label htmlFor="username" className={CredentialsStyles["label"]}>
						Username
					</label>
					<input
						type="text"
						className={CredentialsStyles["field"]}
						name="username"
						placeholder="E-Mail Address"
					/>
					<label htmlFor="password" className={CredentialsStyles["label"]}>
						Password
					</label>
					<input
						type="password"
						className={CredentialsStyles["field"]}
						name="password"
						placeholder="Password"
					/>
				</div>
				<div id={CredentialsStyles["actions"]}>
					<button className={CredentialsStyles["primary"]} type="submit">
						Login
					</button>
					<div id={CredentialsStyles["secondary-actions"]}>
						<button
							className={CredentialsStyles["secondary"]}
							onClick={event => {
								event.preventDefault();
								navigate("/forgot-password");
							}}
						>
							Forgot Password?
						</button>
						<button
							className={CredentialsStyles["secondary"]}
							onClick={event => {
								event.preventDefault();
								navigate("/signup");
							}}
						>
							Sign Up
						</button>
					</div>
				</div>
			</form>
		</CredentialsScreen>
	);
};

export default Login;
