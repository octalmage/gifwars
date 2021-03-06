import React from 'react';
import {Container as Grid, Row, Col} from 'reactstrap';
import Game from '../../services/Game';

class Start extends React.PureComponent {
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
