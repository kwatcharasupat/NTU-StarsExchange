import React, { Component } from "react";
import { compose } from 'recompose';
import { Container, Row, Col } from "react-bootstrap";

import { withAuthorization, withEmailVerification } from '../Session';
import Messages from '../Messages';

import Firebase from "./../Firebase";
import AddRequest from "./../AddRequest";
import MyRequests from "./../MyRequests";
import MyMatches from "./../MyMatches";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.db = Firebase.firestore();

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
        <Messages />
        <Container fluid="sm">
          <Row>
            <Col xs={12} md={6}>
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
            <Col xs={12} md={6}>
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

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
