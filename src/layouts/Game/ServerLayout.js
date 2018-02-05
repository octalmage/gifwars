import React from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import GifComponent from '../../components/GifComponent';

const ServerLayout = (users) => {
  let userList = users.map(
    (user) => {
        return (<Col xs={2} md={2}><GifComponent user={user} /></Col>)
    }
  )
  return (
    <Row>
      {userList}
    </Row>
  )
}

export default ServerLayout
