import React, { Component, Fragment } from "react";
import { Container, Row, Col, Form, Button, Navbar } from "react-bootstrap";
import firebase from "./../firebaseInit";
import courses from "./../2020S1_courses.json";
import indices from "./../2020S1_indices.json"

class AddRequest extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.db = firebase.firestore();

    this.state = {
      course: "RE6012",
      curr_idx: "",
      wanted_idx: ""
    };

    console.log(courses)
    console.log(indices)
  }

  get_course_list = () => {
    return courses.courses.sort().map((course, index) => {
      return (
        <option key={index} value={course}>
          {course}
        </option>
      );
    });
  };

  get_indices_list = (course) => {
    return indices[course].map((classindex, index) => {
      return (
        <option key={index} value={classindex}>
          {classindex}
        </option>
      );
    });
  }


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
          <Col xs={1} md={3} />
          <Col xs={10} md={6}>
            <Form>
              <Form.Group controlId="formCourseCode">
                <Form.Label>Course code</Form.Label>
                <Form.Control
                as="select"
                onChange={(e) => {
                  this.setState({
                    course: e.target.value.toUpperCase(),
                  });
                }}>
                  {this.get_course_list()}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formCurrIndex">
                <Form.Label>Your current index</Form.Label>
                <Form.Control
                as="select"
                onChange={(e) => {
                  this.setState({
                    curr_idx: e.target.value.toUpperCase(),
                  });
                }}>
                  {this.get_indices_list(this.state.course)}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formWantedIndex">
                <Form.Label>Index you want</Form.Label>
                <Form.Control
                as="select"
                onChange={(e) => {
                  this.setState({
                    wanted_idx: e.target.value.toUpperCase(),
                  });
                }}>
                  {this.get_indices_list(this.state.course)}
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                onClick={(e) => {
                  if (
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
          <Col xs={1} md={3} />
        </Row>
      </Fragment>
    );
  }
}

export default AddRequest;
