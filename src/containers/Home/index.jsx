import React from 'react';
import {Container as Grid, Row, Col, Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import './Home.css';

const Home = () => (
  <Grid>
    <Row>
      <Col xs={12} md={12}><h1 className="center title">Gif Wars</h1></Col>
    </Row>
    <Row>
      <Col xs={12} md={12} className="center">
        <Link to="/start">
        <Button size="lg" outline>Start a game</Button>
      </Link>
    </Col>
    </Row>
    <Row>
      <Col xs={12} md={12} className="center home-buttons">
        <Link to="/join">
        <Button size="lg">Join a game</Button>
      </Link>
  </Col>
    </Row>
  </Grid>
)

export default Home;
