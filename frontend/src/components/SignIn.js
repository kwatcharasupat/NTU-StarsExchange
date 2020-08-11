import React, { Component } from "react";
import { Form, Button, Container, Col, Row } from "react-bootstrap";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  render() {
    const { onSignIn } = this.props;

    const validateEmail = (email) => {
      if (/@e.ntu.edu.sg\s*$/.test(email)) {
        return true;
      } else {
        alert("Only NTU email is allowed!");
        return false;
      }
    };

    return (
      <Container fluid="sm">
        <Row>
          <br />
        </Row>
        <Row>
          <Col xs={1} md={3}/>
          <Col xs={10} md={6}>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  onChange={(e) => {
                    this.setState({ username: e.target.value });
                  }}
                  type="email"
                  placeholder="NTU Email"
                />
                <Form.Text className="text-muted">
                  Only use NTU email ending with 'e.ntu.edu.sg'.<br/>If you don't
                  have an account, we will create one for you!
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                  type="password"
                  placeholder="Password"
                />
                <Form.Text className="text-muted">
                  This is different from your 'normal' NTU account!
                </Form.Text>
              </Form.Group>

              

              <Button
                variant="primary"
                onClick={(e) => {
                  if (validateEmail(this.state.username)) {
                    onSignIn(this.state.username, this.state.password);
                  } else {
                    console.log("Error");
                  }
                }}
              >
                Sign In / Sign Up
              </Button>

              <Form.Text>
                By signing up, you are agreeing to the{" "}
                <a href="https://www.termsfeed.com/live/98dd1422-dac6-4fed-aad4-f3c3c7ac37eb">
                  Privacy Policy
                </a>
                .
              </Form.Text>
            </Form>
          </Col>
          <Col xs={1} md={3} />
        </Row>
      </Container>
    );
  }
}
export default SignIn;
