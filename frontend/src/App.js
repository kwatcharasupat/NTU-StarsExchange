import React, { Component, Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./components/SignIn";
import Main from "./components/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Row, Col } from "react-bootstrap";
import firebase from "./firebaseInit";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: "toSignIn",
      username: "",
    };
  }

  onSignedIn = (username, password) => {
    //console.log(username);
    //console.log(password);
    this.setState({ username: username });
    //console.log(this.state.username);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((user) => {
        if (user) {
          this.setState({ authState: "toMain" });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;

        if (errorCode === "auth/user-not-found") {
          alert("Signing you up...");
          firebase
            .auth()
            .createUserWithEmailAndPassword(username, password)
            .then((user) => {
              if (user) {
                this.setState({ authState: "toMain" });
              }
            })
            .catch(function (error) {
              var errorMessage = error.message;
              alert(errorMessage);
            });
        } else {
          var errorMessage = error.message;
          alert(errorMessage);
        }
      });
  };

  render() {
    return (
      <Fragment>
        <Navbar fixed="top" bg="dark" variant="dark">
          <Navbar.Brand>NTU StarsExchange</Navbar.Brand>
          {this.state.authState === "toMain" && (
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>Signed in as: {this.state.username}</Navbar.Text>
            </Navbar.Collapse>
          )}
        </Navbar>

        <Row style={{ padding: "45px" }} />
        <Row>
          <Col xs={3} />
          <Col xs={6}>
            <div
              style={{
                textAlign: "center !important",
                fontSize: "150%",
                fontWeight: "bold",
              }}
            >
              How it works
            </div>
            <div>
              Add the course and index you current have, and the index you want.
              We will look for people who might want to swap indices with you.
              You can then contact them via email!
            </div>
          </Col>
          <Col xs={3} />
        </Row>
        <Row style={{ padding: "15px" }} />
        <div className="App">
          {this.state.authState === "toSignIn" && (
            <SignIn onSignIn={this.onSignedIn} />
          )}
          {this.state.authState === "toMain" && (
            <Main username={this.state.username} />
          )}
        </div>
        <Row style={{ padding: "60px" }} />
        <Navbar fixed="bottom" bg="dark" variant="dark">
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Made by{" "}
              <a href="https://github.com/karnwatcharasupat">
                Karn Watcharasupat
              </a>
              , 2020 |{" "}
              <a href="https://paypal.me/karnwatcharasupat">
                Buy me a coffee :)
              </a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </Fragment>
    );
  }
}

export default App;
