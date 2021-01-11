import React, { Component, Fragment } from "react";

import firebase from "../firebaseInit";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Navbar,
  Card,
} from "react-bootstrap";

class MyMatches extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.db = firebase.firestore();

    this.state = {
      data: {},
    };

    this.getRequests = () => {
      this.refreshText(true);
      var requests = this.props.wanted;
      var colRef = this.db.collection("requests");
      var matches = {};

      for (let r in requests) {
        matches[r] = {};
        colRef
          .where("course", "==", r)
          .where("curr_idx", "in", Array.from(requests[r].wanted_idx))
          .where("wanted_idx", "==", requests[r].curr_idx)
          .get()
          .then((results) => {
            results.forEach((doc) => {
              let d = doc.data();

              if (d.username !== this.props.username) {
                if (!(d.curr_idx in matches[r])) {
                  matches[r][d.curr_idx] = new Set();
                }

                matches[r][d.curr_idx].add(d.username);
              }
            });

            var items = [];

            for (let idx in matches[r]) {
              console.log(idx);
              var thisItem = (
                <Fragment key={idx.toString()}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{r}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Index: {idx}
                      </Card.Subtitle>
                      <Card.Text>
                        {Array.from(matches[r][idx]).map((item, i) => {
                          return <p key={i}>{item}</p>;
                        })}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <div>
                    <br></br>
                  </div>
                </Fragment>
              );
              items.push(thisItem);
            }

            this.setState((prevState) => ({
              data: {
                // object that we want to update
                ...prevState.data, // keep all other key-value pairs
                [r]: items, // update the value of specific key
              },
            }));

            console.log(items);
          });
      }
      setTimeout(() => {
        this.refreshText(false);
      }, 100);
    };

    this.getRequests();
  }

  unRollData = () => {
    var allItems = [];

    for (let r in this.state.data) {
      allItems.push(...this.state.data[r]);
    }

    if (allItems.length == 0) {
      return (
        <Fragment>
          <Card>
            <Card.Body>
              <Card.Title>Sorry!</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                There is currently no match for you.
              </Card.Subtitle>
              <Card.Text>Click Refresh above to check again.</Card.Text>
            </Card.Body>
          </Card>
          <div>
            <br></br>
          </div>
        </Fragment>
      );
    }

    return allItems;
  };

  refreshText = (b) => {
    let elem = document.getElementById("match-refresh-text");

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
            My Matches
          </Col>
        </Row>

        <Row>
          <Col
            id="match-refresh-text"
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
          <Col>{this.unRollData()}</Col>
        </Row>
      </Fragment>
    );
  }
}

export default MyMatches;
