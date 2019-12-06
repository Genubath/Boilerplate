import React, { useState } from "react";
import { Form, Button, Jumbotron } from "react-bootstrap";
// import { Auth } from "aws-amplify";
import "./Login.css";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // await Auth.signIn(email, password);
      props.userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="container">
      <Jumbotron className="jumbotron">
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
          </Form.Group>
          <Button block disabled={!validateForm()} type="submit" variant="dark">
            Login
          </Button>
        </Form>
      </Jumbotron>
    </div>
  );
}
