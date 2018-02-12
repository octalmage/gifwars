import React from 'react';
import {Container as Grid, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import Game from '../../services/Game';
import firebase from '../../services/Firebase';

class Join extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.state = {
      roomcode: '',
      name: '',
    };

    this.game = new Game();
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user && user.displayName) {
        this.setState({ name: user.displayName });
      }
    });

    firebase.auth().signInAnonymously();
  }

  getValidationState(value) {
    const length = value ? value.length : this.state.roomcode.length;
    if (length >= 4) return 'success';
    else if (length < 4) return 'error';
    return null;
  }

  handleChange(e) {
    let value = e.target.value;

    if (e.target.name === 'roomcode') {
      value = value.toUpperCase();
    }

    this.setState({
      [e.target.name]: value,
      valid: this.getValidationState(e.target.value)
    });
  }

  joinGame() {
    const currentUser = firebase.auth().currentUser;
    currentUser.updateProfile({
      displayName: this.state.name,
    })
    .then(() =>
      this.game.joinGame(this.state.roomcode, this.state.name, currentUser.uid)
      .then(response => {
        this.props.history.push(`/game/${this.state.roomcode}`, { name: this.state.name });
      })
    )
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} md={12} className="center">
            <h1>Join a game</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <Form>
                  <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    value={this.state.name}
                    placeholder="Enter Name"
                    onChange={this.handleChange}
                    name="name"
                    id="name"
                  />
                </FormGroup>
                 <FormGroup>
                  <Label for="name">Roomcode</Label>
                  <Input
                    type="text"
                    value={this.state.roomcode}
                    placeholder="Enter Code"
                    onChange={this.handleChange}
                    name="roomcode"
                    id="roomcode"
                  />
                </FormGroup>
              <FormGroup className="center">
                <Button color="primary" disabled={ this.state.valid !== 'success'} onClick={this.joinGame}>Submit</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Join;
