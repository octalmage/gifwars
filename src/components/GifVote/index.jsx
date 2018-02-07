import React from 'react';
import firebase from '../../services/Firebase';
import {Row, Col, Button} from 'react-bootstrap';

import './GifVote.css';

class GifVote extends React.Component {
  /*
  Descr: vote for gif (stage = 'voting')
  props:
    move: GameObject
    user: UserObject
  state:
    pickedGif: GifObject
  */

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.pickedGif = {};
    this.firebase = firebase.database();
    this.state.pickedMove = {};
    this.submit = this.submit.bind(this);
    this.randomWinner = this.randomWinner.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.moves.length > 1 && nextProps.moves.length !== this.props.moves.length) {
      this.getPair(nextProps.moves);
    }
  }

  submit() {
    this.setState(
      {
        submitted: true
      }
    );
    this.firebase.ref(`moves/${this.state.pickedMove.id}/vote`).push(this.props.user.name);
  }

  randomWinner() {
    let randomMove = this.props.currentPair[Math.round(Math.random()*1)];
    this.setMove(randomMove);
    this.submit();
  }

  getPair(moves) {
    const currentPairId = this.props.pair;
    const currentPair = moves.map(
      (move) => {
        if (move.pair_id === currentPairId) {
          return move;
        }
      }
    );
    if (currentPair.length === 2) {
      this.setTimer(currentPair[0].game)
      this.setState({
        currentPair: currentPair
      });
    }
  }

  setTimer(code) {
    const gameRef = firebase.database().ref(`games/${code}`);

    gameRef.on('value', (snapshot) => {
      const game = snapshot.val();
      this.setState({
        countdown: game.timer
      });
    });
  }

  setMove(move) {
    this.setState(
      {pickedMove: move}
    );
  }

  render() {
    const pair = this.state.currentPair && this.state.currentPair.length > 1 ? (
      <React.Fragment>
        <Row className="center">
          <h2>Prompt: "{this.state.currentPair[0].prompt}"</h2>
        </Row>
        <Row className="center">
         <h3>{this.state.countdown} time remaining</h3>
        </Row>
        <Row>
          {this.state.currentPair.map(
            (move, key) => {
              let setPickedMove = this.setMove.bind(this, move);
              return (
                <Col key={key} xs={12} md={5} className={'vote-box ' + (this.state.pickedMove.id === move.id ? 'selected' : '')} onClick={setPickedMove}>
                  <div className="center">{move.player}</div>
                  <img src={move.gif.src} alt={move.gif.gif} />
                </Col>
              );
            }
          )}
          <Col xs={12} md={1} className="center">
            <Button bsSize="large" bsStyle="primary" disabled={this.state.submitted} onClick={this.submit}>Vote</Button>
          </Col>
          <Col xs={12} md={1} className="center">
            <Button bsSize="large" bsStyle="primary" disabled={this.state.submitted} onClick={this.randomWinner}>Make my mind for me</Button>
          </Col>
        </Row>
      </React.Fragment>
    ) : '';
    return (
      <div className="gif-vote">
        {pair}
      </div>
    );
  }
}

export default GifVote;
