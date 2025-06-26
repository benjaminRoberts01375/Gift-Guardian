import "../../style.css";
import CredentialsScreen from "./credentials.tsx";
import EmailStyles from "./checkEmail.module.css";
import { useLocation } from "react-router-dom";

interface LocationState {
	userEmail?: string;
}

const CheckEmail: React.FC = () => {
	const location = useLocation();
	const state = location.state as LocationState | null;
	const email = state?.userEmail;

	return (
		<CredentialsScreen title="Check Email">
			<p id={EmailStyles["explanation"]}>
				Check your email
				{email ? <span id={EmailStyles["bold"]}> {email}</span> : ""} for a verification link.
			</p>
		</CredentialsScreen>
	);
};

export default CheckEmail;
