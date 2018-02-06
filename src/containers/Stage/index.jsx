import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Game from '../../services/Game';
import firebase from '../../services/Firebase';

class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      stage: 'waiting',
      round: 0,
    }

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
      const roomcode = this.props.match.params.id;
      this.setState({ roomcode });

      const playersRef = firebase.database().ref(`games/${roomcode}/players`);

      playersRef.on('child_added', (data) => {
        const players = this.state.players;
        players.push(data.val());
        this.setState({ players });
      });

      const gameRef = firebase.database().ref(`games/${roomcode}`);

      gameRef.on('value', snapshot => {
        const game = snapshot.val();
        this.setState({
          stage: game.stage,
          round: game.round,
        });
      });
  }

  render() {
    const { stage } = this.state;
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={12}>
            {stage === 'waiting' &&
            <React.Fragment>
              <h1 className="App-title">Start a Game</h1>
              <p>Room Code: {this.state.roomcode}</p>
              <p>
                Players: <br />
                {this.state.players.map(player => <span key={player}>{player}<br /></span>)}
              </p>
            </React.Fragment>
          }
          {stage === 'picking' &&
          <React.Fragment>
            Answer the prompts on your device.
          </React.Fragment>
          }
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Stage;
