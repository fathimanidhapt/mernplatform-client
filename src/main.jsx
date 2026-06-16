import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import MainProvider from "./pages/Maincontext";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

axios.interceptors.request.use((config) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  if (config.url && config.url.startsWith("http://localhost:3000")) {
    config.url = config.url.replace("http://localhost:3000", apiUrl);
  }
  return config;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MainProvider>
        <App />
      </MainProvider>
    </BrowserRouter>
  </StrictMode>
);
