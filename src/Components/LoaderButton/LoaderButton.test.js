import React from "react";
import ReactDOM from "react-dom";
import LoaderButton from "./LoaderButton";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LoaderButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});
