import React, { useState } from "react";
import { Form, Jumbotron, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
// import { Auth } from "aws-amplify";
import "./Login.css";
import LoaderButton from "../../Components/LoaderButton/LoaderButton";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      // await Auth.signIn(email, password);
      props.userHasAuthenticated(true);
      props.history.push("/");
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e.message);
      }
      setIsLoading(false);
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
          <LoaderButton
            block
            isLoading={isLoading}
            disabled={!validateForm()}
            type="submit"
            variant="dark"
          >
            Login
          </LoaderButton>
          <Nav.Link to="/login/reset" as={Link}>
            Forgot password?
          </Nav.Link>
        </Form>
      </Jumbotron>
    </div>
  );
}
