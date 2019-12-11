import React from "react";

// import { Button, Spinner } from "react-bootstrap";
import "./AppFooter.css";

export default function AppFooter() {
  return (
    <footer className="footer">
      <div className="startContainer">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Genubath/boilerplate"
        >
          Boilerplate{" "}
        </a>
        <span>&copy; 2018 Me.</span>
      </div>
      <div className="endContainer">
        <span>Powered by</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://react-bootstrap.github.io/"
        >
          {" "}
          React Bootstrap
        </a>
      </div>
    </footer>
  );
}
