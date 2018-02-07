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
    this.state.userTotal = 0;
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
      if ((game.round === this.state.round + 1)) {
        this.calcUserTotal();
      }
      this.setState({
        stage: game.stage,
        id: roomcode,
        round: game.round,
        rounds: game.rounds,
        currentRound: [],
        pairId: game.pair_id,
        votingStage: game.voting_stage,
        currentMoves: [],
      });
      if (game.rounds) {
        const roundRef = firebase.database().ref(`rounds/${game.rounds[game.round]}`);
        roundRef.once('value', (snapshot) => {
          const round = snapshot.val();
          if (round) {
            Object.values(round).map(
              (move) => {
                const moveRef = firebase.database().ref(`moves/${move}`);
                return moveRef.once('value', (snapshot) => {
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
    if (move.player === this.state.user.name && move.round === this.state.round) {
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

  calcUserTotal() {
    let total = this.state.userTotal ? this.state.userTotal : 0;
    total += this.state.myMove && this.state.myMove.vote ? Object.values(this.state.myMove.vote).length : 0
    this.setState({
      userTotal: total
    });
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
              {this.state.myMove && <GifSearch user={this.state.user} move={this.state.myMove}/>}
            </Row>
          </React.Fragment>
        }
        {stage === 'voting' && this.state.votingStage === 'voting' &&
          <React.Fragment>
            <Row className="center">
              <h1> {'Voting in ' + this.state.id + ' on Round ' + this.state.round } </h1>
            </Row>
            <Row>
              <GifVote user={this.state.user} pair={this.state.pairId} moves={this.state.currentMoves}/>
            </Row>
          </React.Fragment>
        }
        {stage === 'voting' && this.state.votingStage === 'score' &&
          <React.Fragment>
            <Row className="center">
              <h1> {'Voting in ' + this.state.id + ' on Round ' + this.state.round } </h1>
            </Row>
            <Row>
              <h1>Results are being tallied up on the main stage!</h1>
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
        {stage === 'score' && this.state.myMove &&
          <React.Fragment>
            <Row className="center">
              <h1> {'Score for ' + this.state.user.name + ' in Room '+ this.state.id + ' on Round ' + this.state.round } </h1>
            </Row>
            <Row>
              <div className="big-gif"><img alt="" src={this.state.myMove.gif.og_src} /></div>
            </Row>
            <Row className="center">
              <h1>Round {this.state.round}: {this.state.myMove.vote ? Object.values(this.state.myMove.vote).length : 0} </h1>
              <h1>Total: {this.state.userTotal + (this.state.myMove.vote ? Object.values(this.state.myMove.vote).length : 0)}</h1>
            </Row>
          </React.Fragment>
        }
      </Grid>
    );
  }
}

export default withRouter(Game);
