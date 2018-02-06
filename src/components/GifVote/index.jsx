import React from 'react';
import './GifVote.css';
import {Row, Col, Button} from 'react-bootstrap';

class GifVote extends React.Component {
  /*
  Descr: vote for gif (stage = 'voting')
  props:
    game: GameObject
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
  }

  submit() {
    /* submit users vote */
  }

  randomWinner() {
    let randomGif = this.props.round.users[Math.round(Math.random()*1)].gif;
    this.setGif(randomGif);
    this.submit();
  }

  setGif(gif) {
    console.log(gif);
    this.setState(
      {pickedGif: gif}
    );
  }

  render() {
    const round = this.props.round;
    return (
      <div className="gif-vote">
        <Row className="center">
          <h2>Prompt: "{round.prompt}"</h2>
        </Row>
        <Row className="center">
         <h3>{this.state.countdown} time remaining</h3>
        </Row>
        <Row>
          {round.users.map(
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
