import React from "react";
import ReactDOM from "react-dom";
import ResetPassword from "./ResetPassword";
import { BrowserRouter as Router } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Router>
      <ResetPassword />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
