import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import firebase from "./../firebaseInit";
import AddRequest from "./AddRequest";
import MyRequests from "./MyRequests";
import MyMatches from "./MyMatches";

class Main extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.db = firebase.firestore();

    this.state = {
      data: [],
      refresh: false,
    };
  }

  onNewData = (reqItems) => {
    this.setState({ data: reqItems });
  };

  forceRefresh = () => {
		this.state.refresh = !this.state.refresh;
		this.forceUpdate();
  };

  render() {
    const { refresh } = this.state;

    return (
      <div>
        <Container fluid="sm">
          <Row>
            <Col xs={6}>
              <AddRequest
                username={this.props.username}
								forceRefresh={this.forceRefresh}
								refresh = {refresh}
              />

              <div>
                <br></br>
              </div>

              <MyRequests
                username={this.props.username}
								onNewData={this.onNewData}
								refresh = {refresh}
              />
            </Col>
            <Col xs={6}>
              <MyMatches
                username={this.props.username}
								wanted={this.state.data}
								refresh = {refresh}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Main;
