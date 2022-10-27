import React from "react";
import { createRoot } from 'react-dom/client'

import { Provider } from "react-redux";
import store from "./store/store";

import App from "./components/App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>,
  //</React.StrictMode>,
);
