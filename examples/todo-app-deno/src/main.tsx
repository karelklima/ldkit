import React from "react";
import { render } from "react-dom";

import { App } from "./components/App.tsx";

//const App = () => <>Whoaaaa</>;

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);

export const x = 2;
