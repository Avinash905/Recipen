import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { AnimatePresence } from "framer-motion";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

disableReactDevTools();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AnimatePresence>
        <App />
      </AnimatePresence>
    </Provider>
  </React.StrictMode>
);
