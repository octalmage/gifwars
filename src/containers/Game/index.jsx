import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';
import GifSearch from '../../components/GifSearch';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';
import background from './images/PoweredBy_200_Horizontal_Light-Backgrounds_With_Logo.gif';
import firebase from '../../services/Firebase';
import GameAPI from '../../services/Game';

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.user = {
      name: 'User1'
    }

    this.state.game = {
      id: 1,
      expire: (new Date()).getTime() + 3000,
      round: 1,
      prompt: 'trains',
      stage: 'waiting',
    }
  }

  componentDidMount() {
    const roomcode = this.props.match.params.id;
    const stateRef = firebase.database().ref(`games/${roomcode}`);

    stateRef.on('value', (snapshot) => {
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
        {stage === 'picking' &&
          <React.Fragment>
            <Row className="center">
              <h1> {this.state.user.name + ' in ' + this.state.game.id + ' on Round ' + this.state.game.round } </h1>
            </Row>
            <Row>
              <GifSearch user={this.state.user} game={this.state.game}/>
            </Row>
          </React.Fragment>
        }
        {!stage === 'waiting' &&
          <React.Fragment>
            Waiting for other players.
            <br />
            <Button
              onClick={() => {
                new GameAPI().startGame(this.props.match.params.id)
              }}
              bsStyle="primary"
              bsSize="normal">
              All players have joined
            </Button>
          </React.Fragment>
        }
        <Row>
          <img src={background} />
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Game);
