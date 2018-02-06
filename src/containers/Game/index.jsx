import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';
import GifSearch from '../../components/GifSearch';
import { withRouter } from 'react-router'

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
      prompt: 'trains'
    }
  }

  render() {
    return (
      <Grid>
        <Row className="center">
          <h1> {this.state.user.name + ' in ' + this.state.game.id + ' on Round ' + this.state.game.round } </h1>
        </Row>
        <Row>
          <GifSearch user={this.state.user} game={this.state.game}/>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Game);
