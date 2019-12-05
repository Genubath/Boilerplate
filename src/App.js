import React from "react";
import { Navbar, Container } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";

export default function App(props) {
  return (
    <Container fluid bg="dark" variant="dark">
      <Navbar collapseOnSelect bg="dark" variant="dark">
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar>
      <Routes />
    </Container>
  );
}
