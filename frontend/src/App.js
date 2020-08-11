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
          <Navbar.Brand xs={12} md={6}>
            NTU StarsExchange
          </Navbar.Brand>
          {this.state.authState === "toMain" && (
            <Navbar.Collapse xs={12} md={6} className="justify-content-end">
              <Navbar.Text>
                Signed in as: {this.state.username} |{" "}
                <span
                  onClick={(e) => {
                    firebase
                      .auth()
                      .signOut()
                      .then(() => {
                        // Sign-out successful.
                        this.setState({ authState: "toSignIn" });
                      })
                      .catch(function (error) {
                        // An error happened.
                      });
                  }}
                >
                  Log out
                </span>
              </Navbar.Text>
            </Navbar.Collapse>
          )}
        </Navbar>

        <Row style={{ padding: "60px" }} />
        <Row>
          <Col xs={1} md={3} />
          <Col xs={10} md={6}>
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
              Add the course and the index you currently have, and the index you want.
              We will look for people who might want to swap indices with you.
              You can then contact them via email!
            </div>
          </Col>
          <Col xs={1} md={3} />
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
              </a>{" "}
              |{" "}
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
