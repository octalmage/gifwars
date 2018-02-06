import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';
import GifSearch from '../../components/GifSearch';
import { withRouter } from 'react-router'
import background from './images/PoweredBy_200_Horizontal_Light-Backgrounds_With_Logo.gif';

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.user = {
      name: 'User1'
    }
    this.state.game = {
      id: 1,
      expire: (new Date()).getTime() + 30000,
      round: 1,
      prompt: 'trains'
    }
    this.state.countdown = 0;
    this.setupTimer();
  }

  updateTime() {
    //cloud function for time
    return (new Date()).getTime();
  }

  setupTimer() {
    this.setState(
      {currentTime: this.updateTime(),
      countdown: Math.round((this.state.game.expire - this.updateTime())/1000)}
    );
    this.timerInterval = setInterval(
      () => {
        if (this.state.game.expire < this.state.currentTime) {
          this.setState(
            {currentTime: this.updateTime(),
            countdown: 0}
          );
          clearInterval(this.timerInterval);
          return;
        }
        this.setState(
          {currentTime: this.updateTime(),
          countdown: Math.round((this.state.game.expire - this.updateTime())/1000)}
        );
      }, 500
    );
  }

  render() {
    return (
      <Grid>
        <Row className="center">
          <h1> {this.state.user.name + ' in ' + this.state.game.id + ' on Round ' + this.state.game.round } </h1>
        </Row>
        <Row className="center">
          <h2>{ this.state.countdown } seconds remaining</h2>
        </Row>
        <Row>
          <GifSearch user={this.state.user} game={this.state.game}/>
        </Row>
        <Row>
          <img src={background} />
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Game);
