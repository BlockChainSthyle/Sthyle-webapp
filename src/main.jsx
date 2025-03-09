import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticlePage from "./pages/ArticlePage";
import CheckPage from "./pages/CheckPage";
import UploadImage from "./pages/UploadImage";
import AddBlock from "./pages/AddBlock";
import "./style/index.css";
import { ToastContainer } from "react-toastify";
import AddUser from "./pages/AddUser";

const App = () => (
  <BrowserRouter>
    <Routes>
        <Route path="/article" element={<ArticlePage />} />
        <Route path="/check" element={<CheckPage />} />
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/addblock" element={<AddBlock/>} />
        <Route path="/adduser" element={<AddUser/>} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
