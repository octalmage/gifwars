import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Game from '../../services/Game';
import firebase from '../../services/Firebase';
import avatar8 from '../../images/dino_thumb.png';
import avatar1 from '../../images/crabby_thumb.png'
import avatar2 from '../../images/cat_thumb.png'
import avatar3 from '../../images/caterpillar_thumb.png'
import avatar4 from '../../images/doggo_thumb.png'
import avatar5 from '../../images/birb_thumb.png'
import avatar6 from '../../images/giraffe_thumb.png'
import avatar7 from '../../images/koaler_thumb.png'
import './stage.css'


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
    const images = [avatar1,avatar2,avatar3,avatar4,avatar5,avatar6,avatar7,avatar8];
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
                {this.state.players.map((player, i) =>
                <span key ={player}>
                  <span className= "playerText">{player}</span>
                <img alt="" src = {images[i]} className="playerImage"/>
                <br />
              </span>)}
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
