import React, { Component, Fragment } from "react";
import { Container, Row, Col, Form, Button, Navbar } from "react-bootstrap";
import firebase from "./../firebaseInit";

class AddRequest extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.db = firebase.firestore();

    this.state = {
      course: "",
      curr_idx: "",
      wanted_idx: "",
    };
  }

  validateIndex = (idx) => {
    return /^\d{5}$/.test(idx);
  };

  validateCourseCode = (cc) => {
    return /^[A-Z]{2}\d{4}$/.test(cc.toUpperCase());
  };

  addToDb = () => {
    var reqRef = this.db.collection("requests");

    var flag = false;

    reqRef
      .where("username", "==", this.props.username)
      .where("course", "==", this.state.course)
      .get()
      .then((results) => {
        results.forEach((doc) => {
          if (doc.data().curr_idx !== this.state.curr_idx) {
            this.db
              .collection("requests")
              .doc(doc.id)
              .delete()
              .then(function () {
                //console.log("Document successfully deleted!");
              })
              .catch(function (error) {
                //console.error("Error removing document: ", error);
              });
          }

          if (
            doc.data().curr_idx === this.state.curr_idx &&
            doc.data().wanted_idx === this.state.wanted_idx
          ) {
            flag = true;
          }
        });
      });

    if (!flag) {
      reqRef
        .add({
          username: this.props.username,
          course: this.state.course,
          curr_idx: this.state.curr_idx,
          wanted_idx: this.state.wanted_idx,
        })
        .then(function () {
          //console.log("Document successfully updated!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          //console.error("Error updating document: ", error);
        });
    }

    this.props.forceRefresh();
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Col
            style={{
              textAlign: "center !important",
              fontSize: "200%",
              fontWeight: "bold",
            }}
          >
            Add new request
          </Col>
        </Row>
        <Row>
          <Col xs={3} />
          <Col xs={6}>
            <Form>
              <Form.Group controlId="formCourseCode">
                <Form.Label>Course code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="EE2001"
                  onChange={(e) => {
                    if (e.target.value.length === 6) {
                      if (this.validateCourseCode(e.target.value)) {
                        this.setState({
                          course: e.target.value.toUpperCase(),
                        });
                      } else {
                        alert("Invalid course code!");
                      }
                    }
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formCurrIndex">
                <Form.Label>Your current index</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="30123"
                  onChange={(e) => {
                    if (e.target.value.length === 5) {
                      if (this.validateIndex(e.target.value)) {
                        this.setState({ curr_idx: e.target.value });
                      } else {
                        alert("Invalid index!");
                      }
                    }
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formWantedIndex">
                <Form.Label>Index you want</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="30124"
                  onChange={(e) => {
                    if (e.target.value.length === 5) {
                      if (this.validateIndex(e.target.value)) {
                        this.setState({ wanted_idx: e.target.value });
                      } else {
                        alert("Invalid index!");
                      }
                    }
                  }}
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={(e) => {
                  if (
                    this.validateCourseCode(this.state.course) &&
                    this.validateIndex(this.state.curr_idx) &&
                    this.validateIndex(this.state.wanted_idx) &&
                    this.state.curr_idx !== this.state.wanted_idx
                  ) {
                    this.addToDb();
                  } else {
                    alert("Invalid input!");
                  }
                }}
              >
                Submit
              </Button>
            </Form>
          </Col>
          <Col xs={3} />
        </Row>
      </Fragment>
    );
  }
}

export default AddRequest;
