import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CredentialsScreen from "./screens/login/credentials.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/login/login.tsx";
import SignUp from "./screens/login/signup.tsx";
import ForgotPassword from "./screens/login/forgotPassword.tsx";
import CheckEmail from "./screens/login/checkEmail.tsx";
import Screen from "./components/screen.tsx";
import Dashboard from "./screens/dashboard.tsx";
import { ListsProvider } from "./context.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ListsProvider>
				<Routes>
					<Route path="/" element={<CredentialsScreen content={<Login />} />} />
					<Route path="/login" element={<CredentialsScreen content={<Login />} />} />
					<Route path="/sign-up" element={<CredentialsScreen content={<SignUp />} />} />
					<Route
						path="/forgot-password"
						element={<CredentialsScreen content={<ForgotPassword />} />}
					/>
					<Route path="/check-email" element={<CredentialsScreen content={<CheckEmail />} />} />
					<Route path="/dashboard" element={<Screen content={<Dashboard />} title="Dashboard" />} />
				</Routes>
			</ListsProvider>
		</BrowserRouter>
	</StrictMode>,
);
