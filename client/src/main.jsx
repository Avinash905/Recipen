import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence } from "framer-motion";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AnimatePresence>
          <App />
        </AnimatePresence>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
