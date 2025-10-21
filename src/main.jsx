import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import "./i18n"; // Initialize i18n before rendering App
import { store } from "@/store/store";
import { startAuthListener } from "@/store/authListener";
startAuthListener(store);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
