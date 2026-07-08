import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { DarkModeProvider } from "./hooks/useDarkMode";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </HashRouter>
  </React.StrictMode>
);