import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";

export default function App(props) {
  return (
    <div className="App container">
      <Navbar collapseOnSelect>
        <Navbar.Brand>
          <Link to="/">Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar>
      <Routes />
    </div>
  );
}
