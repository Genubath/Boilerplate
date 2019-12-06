import React from "react";
import { Jumbotron, Button } from "react-bootstrap";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="container">
      <Jumbotron className="jumbotron">
        <h1>Dashboard</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for
          calling extra attention to featured content or information.
        </p>
        <p>
          <Button variant="dark" href="/about">
            Learn more
          </Button>
        </p>
      </Jumbotron>
    </div>
  );
}
