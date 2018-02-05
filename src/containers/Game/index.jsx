import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';

const Home = () => (
  <Grid>
    <Row className="show-grid">
      <Col xs={12} md={12}><GifComponent /></Col>
    </Row>
  </Grid>
)

export default Home;
