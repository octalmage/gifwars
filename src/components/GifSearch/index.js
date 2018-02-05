import React from 'react';
import './GifSearch.css';
import {Row, Col, Button} from 'react-bootstrap';

import GiphyClient from '../../services/api/giphy';

class GifSearch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      gif: {}
    };
    this.client = new GiphyClient(this.props.prompt);
    this.shuffle = this.shuffle.bind(this);
    this.lucky = this.lucky.bind(this);
    this.gifs = [];
    this.buildList();
  }

  componentDidMount() {
    this.setState({search: this.props.prompt});
  }

  buildList() {
    this.client.retrieve().then(
      (response) => {
        response.data.forEach((gifObject) => {
          this.gifs.push(this.client.convert(gifObject));
        });
        this.setState(
          {
            list: this.gifs.map(
              (gif, key) => {
                let setGifBig = this.setGif.bind(this, gif)
                return (
                  <Col xs={3} className="gif-selector" onClick={setGifBig} key={gif.gif}><img src={gif.src} /></Col>
                )
              }
            )
          }
        );
        console.log('finished');
        console.log(this.state);
      }
    )
  }

  setGif(gif) {
    console.log('test', gif);
    this.setState(
      {
        gif: gif
      }
    );
  }

  shuffle() {
    console.log(this.client.shuffle());
    this.setState({
      gif: this.client.shuffle().src
    })
  }

  lucky() {
    this.client.lucky().then(
      (response) => {
        console.log(response);
        this.setState({
          gif: {
            gif: response.data.idea,
            src: response.data.images.fixed_width_downsampled.gif_url,
            og_src: response.data.images.original.gif_url
          }
        })
      }
    )
  }

  render() {
    return (
      <Row>
        <Col xs={6} className="gif-search-box">
          <Row>
            <div className="big-gif"><img src={this.state.gif.og_src} /></div>
          </Row>
          <Row>
            {this.state.list}
          </Row>
        </Col>
        <Col xs={2}>
          <Row>
            <Button bsStyle="primary" className="center" onClick={this.shuffle}>Shuffle</Button>
          </Row>
          <Row>
            <Button bsStyle="primary" className="center" onClick={this.lucky}>I'm feeling lucky</Button>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default GifSearch;
