import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';
import GifSearch from '../../components/GifSearch';
import { withRouter } from 'react-router'

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    //test data
    this.state.users = [
      {
        id: 'user1',
        gif: ''
      },
      {
        id: 'user2',
        gif: ''
      }
    ];

    this.state.userList = this.state.users.map(
      (user, key) => {
        return (
          <Col xs={2} md={2} key={user.id}><GifComponent user={this.state.users[key]} /></Col>
        )
      }
    )

    setTimeout(
      () => {
        this.setState(
          {users: [
            {
              id: 'user1',
              gif: ''
            },
            {
              id: 'user2',
              gif: 'https://media.giphy.com/media/VOq7iem25Z94Y/giphy.gif'
            }
          ]}
        );
        this.setState(
          {userList: this.state.users.map(
            (user, key) => {
              return (
                <Col xs={2} md={2} key={user.id}><GifComponent user={this.state.users[key]} /></Col>
              )
            })});
      },
      3000
    );
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          {this.state.userList}
        </Row>
        <Row>
          <GifSearch prompt="everything is fine" />
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Game);
