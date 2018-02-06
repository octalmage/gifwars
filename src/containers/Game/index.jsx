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
      id: '1',
      expire: (new Date()).getTime() + 3000
    }
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
        </Row>
        <Row>
          <GifSearch prompt="everything is fine" user={this.state.user} game={this.state.game}/>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Game);
