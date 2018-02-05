import React from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';

const ClientLayout = (user) => {
  return (
    <Row className="show-grid">
      <Col xs={12} md={12}><GifComponent user={user} /></Col>
    </Row>
  );
}

export default ClientLayout
