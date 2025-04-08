import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CredentialsScreen from "./screens/Credentials.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/login";
import SignUp from "./screens/signup";
import ForgotPassword from "./screens/forgotPassword.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CredentialsScreen content={<Login />} />} />
        <Route
          path="/login"
          element={<CredentialsScreen content={<Login />} />}
        />
        <Route
          path="/sign-up"
          element={<CredentialsScreen content={<SignUp />} />}
        />
        <Route
          path="/forgot-password"
          element={<CredentialsScreen content={<ForgotPassword />} />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
