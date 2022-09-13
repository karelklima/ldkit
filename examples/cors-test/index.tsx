import React from "https://esm.sh/react@17.0.2";
import ReactDOM from "https://esm.sh/react-dom@17.0.2";
import { LDkit } from "./ldkit.tsx";

function App() {
  return (
    <div>
      <div style={{ fontSize: "36px", fontWeight: "bold" }}>
        Hello from React/JSX
        <br />
        <LDkit />
      </div>
    </div>
  );
}

function main() {
  ReactDOM.render(React.createElement(App), document.querySelector("#main"));
}

addEventListener("DOMContentLoaded", () => {
  main();
});
