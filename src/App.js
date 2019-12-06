import React, { useState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  FormControl
} from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import "./App.css";
import Routes from "./Routes";

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  function handleLogout() {
    userHasAuthenticated(false);
    props.history.push("/login");
  }
  return (
    <div className="App">
      <Navbar collapseOnSelect bg="dark" variant="dark">
        <Navbar.Brand to="/" as={Link}>Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav className="mr-auto">
            <Nav.Link to="/about" as={Link}>
              Why boilerplate?
            </Nav.Link>
            <Nav.Link to="/dashboard" as={Link}>Dashboard</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item to="#action/3.1" as={Link}>Action</NavDropdown.Item>
              <NavDropdown.Item to="#action/3.2" as={Link}>
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item to="#action/3.3" as={Link}>Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item to="#action/3.4" as={Link}>
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link to="/signup" as={Link}>Signup</Nav.Link>
                <Nav.Link to="/login" as={Link}>Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}

export default withRouter(App);