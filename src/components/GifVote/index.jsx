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
    this.state = {
      pickedMove: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.moves.length > 1) {
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
      this.firebase.ref(`moves/${this.state.pickedMove.id}/vote/${firebase.auth().currentUser.uid}`).set(this.props.user.name);
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
    return moves.filter(move => move.pair_id === currentPairId);
  }

  setMove(move) {
    this.setState(
      {pickedMove: move}
    );
  }

  render() {
    const { moves, countdown } = this.props;
    const currentPair = this.getPair(moves);
    return (
      <div className="gif-vote">
      { currentPair && currentPair.length > 1 &&
        <React.Fragment>
          <Row className="center">
            <h2>Prompt: "{currentPair[0].prompt}"</h2>
          </Row>
          <Row className="center">
           <h3>{countdown} time remaining</h3>
          </Row>
          <Row>
            {currentPair.map(
              (move, key) => {
                let setPickedMove = this.setMove.bind(this, move);
                return (
                  <Col key={key} xs={12} md={4} className={'vote-box ' + (this.state.pickedMove.id === move.id ? 'selected' : '')} onClick={setPickedMove}>
                    <div className="center">{move.player}</div>
                    <img src={move.gif.src} alt={move.gif.gif} />
                  </Col>
                );
              }
            )}
            <Col xs={12} md={4} className="center vote-button">
              <Button bsSize="large" bsStyle="primary" disabled={this.state.submitted} onClick={this.submit}>Vote</Button>
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
