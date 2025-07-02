import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/login/login.tsx";
import SignUp from "./screens/login/signup.tsx";
import ForgotPassword from "./screens/login/forgotPassword.tsx";
import ForgotPasswordSet from "./screens/login/forgotPasswordSet.tsx";
import CheckEmail from "./screens/login/checkEmail.tsx";
import Screen from "./components/screen.tsx";
import Dashboard from "./screens/dashboard.tsx";
import { ListsProvider } from "./context.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ListsProvider>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password/:token" element={<ForgotPasswordSet />} />
					<Route path="/check-email" element={<CheckEmail />} />
					<Route path="/dashboard" element={<Screen content={<Dashboard />} title="Dashboard" />} />
				</Routes>
			</ListsProvider>
		</BrowserRouter>
	</StrictMode>,
);
