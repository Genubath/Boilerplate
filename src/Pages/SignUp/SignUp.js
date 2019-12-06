import React, { useState } from "react";
import { Form, FormGroup, FormControl, Jumbotron } from "react-bootstrap";
import LoaderButton from "../../Components/LoaderButton/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import "./SignUp.css";

export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: ""
  });
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    setNewUser("test");

    setIsLoading(false);
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <FormControl
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          {/* <HelpBlock>Please check your email for the code.</HelpBlock> */}
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
          variant="dark"
        >
          Verify
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
        <Jumbotron className="jumbotron">
          <h2>Signup</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="email">
              <Form.Label>Email</Form.Label>
              <FormControl
                autoFocus
                type="email"
                value={fields.email}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="password">
              <Form.Label>Password</Form.Label>
              <FormControl
                type="password"
                value={fields.password}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <FormControl
                type="password"
                onChange={handleFieldChange}
                value={fields.confirmPassword}
              />
            </FormGroup>
            <LoaderButton
              block
              type="submit"
              isLoading={isLoading}
              disabled={!validateForm()}
              variant="dark"
            >
              Signup
            </LoaderButton>
          </Form>
        </Jumbotron>
    );
  }

  return (
    <div className="container">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
