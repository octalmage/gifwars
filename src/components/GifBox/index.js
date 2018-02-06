import React from 'react';
import {Col} from 'react-bootstrap';

class GifBox extends React.Component {

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    return (
      <Col md={3} xs={4} className={'gif-selector ' + (this.props.active ? 'selected' : '')} ><img src={this.props.gif.src} /></Col>
    );
  }
}

export default GifBox;
