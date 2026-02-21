import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from "react-redux";
import { store } from "../src/APIS/store/store";
import { ToastContainer } from "react-toastify";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
      <ToastContainer />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
