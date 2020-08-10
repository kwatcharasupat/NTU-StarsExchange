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
      var requests = this.props.wanted;
      var colRef = this.db.collection("requests");
      var matches = {};

      for (let r in requests) {
        matches[r] = {};
        colRef
          .where("course", "==", r)
          // .where("curr_idx", "in", Array.from(requests[r].wanted_idx))
          .get()
          .then((results) => {
            console.log(results);
            results.forEach((doc) => {
              let d = doc.data();

              if (d.username !== this.props.username) {
                if (!(d.curr_idx in matches[r])) {
                  matches[r][d.curr_idx] = new Set();
                }

                matches[r][d.curr_idx].add(d.username);
              }
            });

            console.log(matches[r]);

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
                r: items, // update the value of specific key
              },
            }));

            console.log(items);
          });
      }
    };

    this.getRequests();
  }

  unRollData = () => {
    var allItems = [];

    for (let r in this.state.data) {
      allItems.push(...this.state.data.r);
    }

    return allItems;
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
            style={{
              textAlign: "center !important",
            }}
            onClick={(e) => this.getRequests()}
          >
            Click me to see who matched with you!
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
