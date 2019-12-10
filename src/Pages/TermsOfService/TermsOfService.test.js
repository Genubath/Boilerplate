import React from "react";
import ReactDOM from "react-dom";
import TermsOfService from "./TermsOfService";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<TermsOfService />, div);
  ReactDOM.unmountComponentAtNode(div);
});
