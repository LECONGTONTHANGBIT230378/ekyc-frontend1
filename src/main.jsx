import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import BrowserRouter
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    // 2. Bọc toàn bộ App bên trong BrowserRouter (Đã gỡ bỏ StrictMode)
    <BrowserRouter>
        <App />
    </BrowserRouter>
);