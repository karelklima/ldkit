import React from "react";
import { render } from "react-dom";

import { main } from "./test";

render(
  <React.StrictMode>"Whoa"</React.StrictMode>,
  document.getElementById("app")
);

main();

console.log("WHOOOOOOOA");

/*if (import.meta.hot) {
  import.meta.hot.accept();
}
*/
