import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import './App.css';

class App extends Component {
  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={12}><h1 class="center">GifWars</h1></Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
