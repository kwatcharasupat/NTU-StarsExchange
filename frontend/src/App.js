import React, { Component, Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./components/SignIn";
import Main from "./components/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "react-bootstrap";
import firebase from "./firebaseInit";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: "toSignIn",
      username: "test@e.ntu.edu.sg",
    };
  }

  onSignedIn = (username, password) => {
    console.log(username);
    console.log(password);
    this.setState({ username: username });
    console.log(this.state.username);
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
          alert('Signing you up...')
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
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">NTU StarsExchange</Navbar.Brand>
        </Navbar>
        <div className="App">
          {this.state.authState === "toSignIn" && (
            <SignIn onSignIn={this.onSignedIn} />
          )}
          {this.state.authState === "toMain" && <Main username={this.state.username}/>}
        </div>
      </Fragment>
    );
  }
}

export default App;
