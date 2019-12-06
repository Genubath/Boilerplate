import React, { useState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  FormControl
} from "react-bootstrap";

import "./App.css";
import Routes from "./Routes";

export default function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  function handleLogout() {
    userHasAuthenticated(false);
  }
  return (
    <div className="App">
      <Navbar collapseOnSelect bg="dark" variant="dark">
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav className="mr-auto">
            <Nav.Link href="/about">Why boilerplate?</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link href="/signup">Signup</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}
