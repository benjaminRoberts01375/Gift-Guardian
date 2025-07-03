import "../../style.css";
import SignupStyles from "./signup.module.css";
import CredentialsStyles from "./credentials.module.css";
import CredentialsScreen from "../../screens/login/credentials.tsx";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const navigate = useNavigate();
	const [failedSignUp, setFailedSignUp] = useState<boolean>(false);

	const handleSignUpSubmission = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		// Extract values from the form
		const payload = {
			username: formData.get("username") as string,
			password: formData.get("password") as string,
			first_name: formData.get("first-name") as string,
			last_name: formData.get("last-name") as string,
		};
		console.log(payload);
		console.log(formData.getAll("first-name"));
		if (
			payload.first_name.length < 2 || // First name too short
			payload.last_name.length < 2 || // Last name too short
			!payload.username.includes("@") || // Email missing @ symbol
			!payload.username.includes(".") || // Email missing . symbol
			payload.username.length < 5 || // Email too short
			payload.password.length < 8 // Password too short
		) {
			console.error("Missing required fields");
			setFailedSignUp(true);
			return;
		}

		try {
			const response = await fetch("/db/userCreate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
				credentials: "include", // Cookies
			});

			if (response.ok) {
				navigate("/check-email", { state: { userEmail: payload.username } });
			} else {
				console.error("Signup failed:", response.status);
				throw new Error("Signup failed");
			}
		} catch (error) {
			console.error("Error during login:", error);
			setFailedSignUp(true);
		}
	};

	return (
		<CredentialsScreen title={failedSignUp ? "Sign Up Failed" : "Welcome"}>
			<form onSubmit={handleSignUpSubmission}>
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
					<label htmlFor="first-name" className={CredentialsStyles["label"]}>
						Your Name
					</label>
					<div id={SignupStyles["name-container"]}>
						<input
							className={CredentialsStyles["field"]}
							name="first-name"
							placeholder="First Name"
						/>
						<input
							className={CredentialsStyles["field"]}
							name="last-name"
							placeholder="Last Name"
						/>
					</div>
				</div>
				<div id={CredentialsStyles["actions"]}>
					<button className={CredentialsStyles["primary"]} type="submit">
						Sign Up
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

export default SignUp;
