import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LoginScreen from "./screens/login.tsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpScreen from "./screens/signup.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
