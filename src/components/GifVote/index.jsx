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
    this.firebase = firebase.database();
    this.submit = this.submit.bind(this);
    this.randomWinner = this.randomWinner.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.moves.length > 1) {
      console.log('wtf');
      console.log(nextProps);
      this.getPair(nextProps.moves);
    }
  }

  submit() {
    try {
      this.setState(
        {
          submitted: true
        }
      );
      this.firebase.ref(`moves/${this.state.pickedMove.id}/vote`).push(this.props.user.name);
    }
    catch(e) {
      this.setState(
        {
          submitted: false
        }
      );
    }
  }

  randomWinner() {
    let randomMove = this.props.currentPair[Math.round(Math.random()*1)];
    this.setMove(randomMove);
    this.submit();
  }

  getPair(moves) {
    const currentPairId = this.props.pair;
    const currentPair = moves.filter( move => move.pair_id === currentPairId);
    if (currentPair.length === 2) {
      console.log('set currentpair');
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
    return (
      <div className="gif-vote">
      {this.state && this.state.currentPair && this.state.currentPair.length > 1 &&
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
      }
      </div>
    );
  }
}

export default GifVote;
