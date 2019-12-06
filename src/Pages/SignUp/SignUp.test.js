import React from "react";
import ReactDOM from "react-dom";
import SignUp from "./SignUp";
import { BrowserRouter as Router } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
