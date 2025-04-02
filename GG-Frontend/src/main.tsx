import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LoginScreen from "./screens/login.tsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
