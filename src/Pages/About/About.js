import React from "react";
import { Jumbotron } from "react-bootstrap";

import "./About.css";

export default function About() {
  return (
    <div className="container">
      <Jumbotron className="jumbotron">
        <h1>Here's why:</h1>
        <p>
          By cloning this webpage, you can create a serverless frontend with
          different features such as user authentication and database CRUD
          actions
        </p>
      </Jumbotron>
    </div>
  );
}
