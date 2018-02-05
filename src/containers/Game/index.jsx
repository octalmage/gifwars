import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';
import ClientLayout from '../../layouts/Game/ClientLayout'
import ServerLayout from '../../layouts/Game/ServerLayout'
import { withRouter } from 'react-router'

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    //test data
    let users = [
      {
        id: 'user1',
        gif: 'https://media.giphy.com/media/VOq7iem25Z94Y/giphy.gif'
      },
      {
        id: 'user2',
        gif: ''
      }
    ];
    let user = users[1];
    if (this.props.location.state.layout) {
      if (this.props.location.state.layout === 'server') {
        this.layout = ServerLayout(users);
      } else {
        this.layout = ClientLayout(user);
      }
    } else {
      this.layout = ServerLayout(users);
    }
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          {this.layout}
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Game);
