import React from 'react';
import { Col } from 'reactstrap';

class GifBox extends React.Component {

  render() {
    return (
      <Col md={3} xs={4} className={'gif-selector ' + (this.props.active ? 'selected' : '')} >
        <img onClick={this.props.onClick} src={this.props.gif.src} alt={this.props.gif.gif} />
      </Col>
    );
  }
}

export default GifBox;
