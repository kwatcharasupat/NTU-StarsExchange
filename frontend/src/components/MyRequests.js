import React, { Component, Fragment } from "react";

import firebase from "./../firebaseInit";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Navbar,
  Card,
} from "react-bootstrap";

class MyRequests extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      data: [],
    };

    this.db = firebase.firestore();

    this.getRequests = () => {
      this.refreshText(true);
      var reqRef = this.db
        .collection("requests")
        .where("username", "==", this.props.username);

      reqRef.get().then((results) => {
        var courseMap = {};
        var reqItems = [];

        ////console.log(results);

        results.forEach((doc) => {
          let data = doc.data();
          let course = data.course;
          if (course in courseMap) {
            courseMap[course].wanted_idx.add(data.wanted_idx);
            courseMap[course].id.add(doc.id);
          } else {
            courseMap[course] = {};
            courseMap[course].curr_idx = data.curr_idx;
            courseMap[course].wanted_idx = new Set();
            courseMap[course].wanted_idx.add(data.wanted_idx);
            courseMap[course].id = new Set();
            courseMap[course].id.add(doc.id);
          }
        });
        ////console.log(courseMap);

        if (Object.keys(courseMap).length > 0) {
          for (var item in courseMap) {
            var thisItem = (
              <Fragment key={item.toString()}>
                <Card>
                  <Card.Body>
                    <Card.Title>{item}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      My Index: {courseMap[item].curr_idx}
                    </Card.Subtitle>
                    <Card.Text>
                      Indices I want:{" "}
                      {Array.from(courseMap[item].wanted_idx).join(", ")}
                    </Card.Text>
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        Array.from(courseMap[item].id).forEach((doc_id) => {
                          this.db
                            .collection("requests")
                            .doc(doc_id)
                            .delete()
                            .then(() => {
                              this.getRequests();
                              document.location.reload();
                            });
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
                <div>
                  <br></br>
                </div>
              </Fragment>
            );
            reqItems.push(thisItem);
          }
          this.setState({ data: reqItems });
          this.props.onNewData(courseMap);
        } else {
          this.setState({
            data: [
              <Fragment key="-1">
                <Card>
                  <Card.Body>
                    <Card.Title>:)</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      You currently have no requests.
                    </Card.Subtitle>
                    <Card.Text>
                      Click Refresh above if you just added a request!
                    </Card.Text>
                  </Card.Body>
                </Card>
                <div>
                  <br></br>
                </div>
              </Fragment>,
            ],
          });
        }
        this.refreshText(false);
      });
    };

    this.getRequests();
  }

  refreshText = (b) => {
    let elem = document.getElementById("req-refresh-text");

    if (elem == null) {
      return;
    }

    if (b) {
      elem.innerHTML = "Refreshing...";
    } else {
      elem.innerHTML = "Refresh";
    }
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
            My Requests
          </Col>
        </Row>

        <Row>
          <Col
            id="req-refresh-text"
            style={{
              textAlign: "center !important",
            }}
            onClick={(e) => {
              this.getRequests();
            }}
          >
            Refresh
          </Col>
        </Row>

        <Row>
          <Col>{this.state.data}</Col>
        </Row>
      </Fragment>
    );
  }
}

export default MyRequests;
