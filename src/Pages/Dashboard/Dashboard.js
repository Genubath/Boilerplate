import React from "react";
import { Jumbotron, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
          <Button variant="dark" to="/about" as={Link}>
            Learn more
          </Button>
        </p>
      </Jumbotron>
    </div>
  );
}
