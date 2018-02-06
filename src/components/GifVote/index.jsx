import React from 'react';
import './GifVote.css';
import {Row, Col, Button} from 'react-bootstrap';
import FirebaseHelper from '../../helper/FirebaseHelper';

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
    this.state.pickedGif = {}
    this.state.expireTime = (new Date()).getTime() + 15 * 1000;
    this.state.coundown = 0;
    this.submit = this.submit.bind(this);
    this.randomWinner = this.randomWinner.bind(this);
    this.state.currentPair = [
      (new FirebaseHelper()).emptyMove(),
      (new FirebaseHelper()).emptyMove()
    ]
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.moves.length > 1) {
      this.getPair(nextProps.moves);
    }
  }

  submit() {
    /* submit users vote */
  }

  randomWinner() {
    let randomGif = this.props.currentPair[Math.round(Math.random()*1)].gif;
    this.setGif(randomGif);
    this.submit();
  }

  getPair(moves) {
    //update voting to handle pairs
    // const currentPairId = this.props.pair;
    // const currentPair = this.props.moves.map(
    //   (move) => {
    //     if (move.pair_id === currentPairId) {
    //       return move;
    //     }
    //   }
    // );
    // Use props.pair to compare against pair ids
    const currentPair = [
      moves[0],
      moves[1]
    ]
    this.setState({
      currentPair: currentPair
    });
  }

  setGif(gif) {
    this.setState(
      {pickedGif: gif}
    );
  }

  render() {
    return (
      <div className="gif-vote">
        <Row className="center">
          <h2>Prompt: "{this.state.currentPair[0].prompt}"</h2>
        </Row>
        <Row className="center">
         <h3>{this.state.countdown} time remaining</h3>
        </Row>
        <Row>
          {this.state.currentPair.map(
            (user, key) => {
              let setPickedGif = this.setGif.bind(this, user.gif, key)
              return (
                <Col key={key} xs={12} md={5} className={'vote-box ' + (this.state.pickedGif.gif === user.gif.gif ? 'selected' : '')} onClick={setPickedGif}>
                  <div className="center">{user.player}</div>
                  <img src={user.gif.src} alt={user.gif.gif} />
                </Col>
              );
            }
          )}
          <Col xs={12} md={1} className="center">
            <Button bsSize="large" bsStyle="primary" onClick={this.submit}>Vote</Button>
          </Col>
          <Col xs={12} md={1} className="center">
            <Button bsSize="large" bsStyle="primary" onClick={this.randomWinner}>Make my mind for me</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GifVote;
