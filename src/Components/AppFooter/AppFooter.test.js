import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import AppFooter from "./AppFooter";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Router><AppFooter /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
