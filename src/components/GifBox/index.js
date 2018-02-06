import React from 'react';
import {Col} from 'react-bootstrap';

class GifBox extends React.Component {

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    return (
      <Col xs={3} className={'gif-selector ' + (this.props.active ? 'selected' : '')} ><img src={this.props.gif.src} /></Col>
    );
  }
}

export default GifBox;
