import React from 'react';
import {Grid, Row} from 'react-bootstrap';
import GifSearch from '../../components/GifSearch';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';
import background from './images/PoweredBy_200_Horizontal_Light-Backgrounds_With_Logo.gif';
import firebase from '../../services/Firebase';
import GameAPI from '../../services/Game';
import GifVote from '../../components/GifVote';

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.user = {
      name: props.location.state ? props.location.state.name : 'asdf'
    };
    this.state.currentMoves = [];
  }

  componentDidMount() {
    const roomcode = this.props.match.params.id;
    const gameRef = firebase.database().ref(`games/${roomcode}`);

    gameRef.on('value', (snapshot) => {
      const game = snapshot.val();
      this.setState({
        stage: game.stage,
        id: roomcode,
        round: game.round,
        rounds: game.rounds,
        currentRound: [],
        pairId: game.pair_id
      });
      if (game.rounds) {
        const roundRef = firebase.database().ref(`rounds/${game.rounds[game.round]}`);
        roundRef.on('value', (snapshot) => {
          const round = snapshot.val();
          if (round) {
            Object.values(round).map(
              (move) => {
                const moveRef = firebase.database().ref(`moves/${move}`);
                moveRef.on('value', (snapshot) => {
                  let moveBig = snapshot.val();
                  moveBig.id = move;
                  this.moveUpdate(moveBig);
                });
              }
            );
          }
        });
      }
    });
  }

  moveUpdate(move) {
    let currentMoves = this.state.currentMoves;
    let moveBuffer = [];
    if (move.player === this.state.user.name) {
      this.setState({
        myMove: move
      });
    }
    if (currentMoves.length > 0 && move !== undefined) {
      moveBuffer = this.state.currentMoves.filter( currentMove => currentMove.id !== move.id );
    }
    moveBuffer.push(move);
    this.setState(
      {
        currentMoves: moveBuffer
      }
    );
  }

  render() {
    const { stage } = this.state;
    return (
      <Grid>
        {stage === 'picking' &&
          <React.Fragment>
            <Row className="center">
              <h1> {this.state.user.name + ' in ' + this.state.id + ' on Round ' + this.state.round } </h1>
            </Row>
            <Row>
              <GifSearch user={this.state.user} move={this.state.myMove}/>
            </Row>
          </React.Fragment>
        }
        {stage === 'voting' &&
          <React.Fragment>
            <Row className="center">
              <h1> {'Voting in ' + this.state.id + ' on Round ' + this.state.round } </h1>
            </Row>
            <Row>
              <GifVote user={this.state.user} pair={this.state.pairId} moves={this.state.currentMoves}/>
            </Row>
          </React.Fragment>
        }
        {stage === 'waiting' &&
          <React.Fragment>
            Waiting for other players to join.
            <br />
            <br />
            <Button
              onClick={() => {
                new GameAPI().startGame(this.props.match.params.id)
              }}
              bsStyle="primary"
              bsSize="large">
              All players have joined
            </Button>
          </React.Fragment>
        }
        <Row>
          <br />
          <img src={background} />
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Game);
