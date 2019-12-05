import React from "react";
import ReactDOM from "react-dom";
import About from "./About";
import { BrowserRouter as Router } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<About />, div);
  ReactDOM.unmountComponentAtNode(div);
});
