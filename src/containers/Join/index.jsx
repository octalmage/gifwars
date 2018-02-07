import React from 'react';
import {Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import Game from '../../services/Game';

class Join extends React.Component {
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
    this.game.joinGame(this.state.roomcode, this.state.name)
    .then(response => {
      this.props.history.push(`/game/${this.state.roomcode}`, {name: this.state.name});
    });
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
            <Form horizontal>
              <FormGroup
                controlId="formBasicText"
                validationState={this.getValidationState()}
              >
                <Col componentClass={ControlLabel} sm={2}>
                  Game Code
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={this.state.name}
                    placeholder="Enter Name"
                    onChange={this.handleChange}
                    name="name"
                  />
                  <FormControl
                    type="text"
                    value={this.state.roomcode}
                    placeholder="Enter Code"
                    onChange={this.handleChange}
                    name="roomcode"
                  />
                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup className="center">
                <Button bsStyle="primary" disabled={ this.state.valid !== 'success'} onClick={this.joinGame}>Submit</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Join;
