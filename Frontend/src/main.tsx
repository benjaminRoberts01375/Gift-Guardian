import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CredentialsScreen from "./screens/Credentials.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CredentialsScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
