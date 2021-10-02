import React from "react";
import { render } from "react-dom";

import { App } from "./components/App";

// import { main } from "./test-todo";

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);

// main();
