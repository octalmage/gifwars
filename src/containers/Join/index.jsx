import React from 'react';
import {Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

class Join extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.state = {
      value: ''
    };
  }

  getValidationState(value) {
    const length = value ? value.length : this.state.value.length;
    if (length >= 4) return 'success';
    else if (length < 4) return 'error';
    return null;
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
      valid: this.getValidationState(e.target.value)
    });
  }

  joinGame() {
    this.props.history.push(
      {
        pathname: '/game/' + this.state.value
      }
    );
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
                    value={this.state.value}
                    placeholder="Enter Code"
                    onChange={this.handleChange}
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
