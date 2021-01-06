import React, { Component, Fragment } from "react";
import { Container, Row, Col, Form, Button, Navbar } from "react-bootstrap";
import firebase from "./Firebase";
import courses from "./../2020S2_courses.json";
import indices from "./../2020S2_indices.json"

class AddRequest extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.db = firebase.firestore();

    this.state = {
      course: courses.courses[0],
      curr_idx: indices[courses.courses[0]][0],
      wanted_idx: ""
    };

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

  get_indices_list_without = (course, curr) => {

    return indices[course].filter((i) => i !== curr).map((classindex, index) => {
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
                    curr_idx: indices[e.target.value.toUpperCase()][0]
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
                  var curr = e.target.value.toUpperCase();
                  this.setState({
                    curr_idx: curr
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
                  {this.get_indices_list_without(this.state.course, this.state.curr_idx)}
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                onClick={(e) => {
                  if (
                    (this.state.wanted_idx !== "") &&
                    (this.state.curr_idx !== this.state.wanted_idx)
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
