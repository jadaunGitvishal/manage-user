import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReactDOM from "react-dom";
import LoginForm from "./LoginForm";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      {/* Redirect to App component after successful login */}
      <Route path="/App" element={<App />} />
      {/* Redirect to App component if user is authenticated */}
      <Route path="/login" element={<Navigate to="/App" />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
