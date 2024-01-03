import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { AnimatePresence } from "framer-motion";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import ScrollToTop from "./components/scrollToTop.jsx";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AnimatePresence>
      <App />
      <ScrollToTop />
    </AnimatePresence>
  </Provider>
);
