import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import "./i18n"; // Initialize i18n before rendering App
import { store } from "@/store/store";
import { startAuthListener } from "./store/authListener";

// Leaflet CSS and icon configuration
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

startAuthListener(store);
createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
