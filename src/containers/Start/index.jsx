import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

class Start extends Component {

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={12} ><h1 className="App-title">Start a Game</h1></Col>
        </Row>
      </Grid>
    );
  }
}

export default Start;
