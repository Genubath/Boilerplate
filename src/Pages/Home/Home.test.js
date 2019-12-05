import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home";
import { BrowserRouter as Router } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Home />, div);
  ReactDOM.unmountComponentAtNode(div);
});
