import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import { Provider } from "react-redux";

import { store } from "./modules";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
