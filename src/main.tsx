import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.scss";
import App from "./App.tsx";
import { Theme } from "@carbon/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme theme="g100">
      <App />
    </Theme>
  </StrictMode>
);
