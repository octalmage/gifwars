import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Game from '../../services/Game';

class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomcode: '',
      players: [],
    }

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    new Game().createGame()
    .then(response => this.props.history.push(`/stage/${response.roomcode}`));
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={12} >
            <h1 className="App-title">Connecting...</h1>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Start;
