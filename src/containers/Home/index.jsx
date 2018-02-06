import React from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './Home.css';

const Home = () => (
  <Grid>
    <Row className="show-grid">
      <Col xs={12} md={12}><h1 className="center">GifWars</h1></Col>
    </Row>
    <Row className="show-grid">
      <Col xs={12} md={12} className="center home-buttons"><Link to="/start"><Button bsStyle="primary" bsSize="large">Start a game</Button></Link></Col>
    </Row>
    <Row className="show-grid">
      <Col xs={12} md={12} className="center home-buttons"><Link to="/join"><Button bsStyle="primary" bsSize="large">Join a game</Button></Link></Col>
    </Row>
  </Grid>
)

export default Home;
