import React from 'react';
import './GifSearch.css';
import {Row, Col, Button} from 'react-bootstrap';

import GifBox from '../GifBox';
import GiphyClient from '../../services/api/giphy';

class GifSearch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      gif: {}
    };
    this.client = new GiphyClient(this.props.game.prompt);
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
            gifs: this.gifs
          }
        );
      }
    )
  }

  setGif(gif) {
    this.setState(
      {
        gif: gif,
      }
    );
  }

  submit() {
    // send up this.state.gif to the server as the selected gif
  }

  shuffle() {
    this.setState({
      gif: this.client.shuffle(this.gifs)
    })
  }

  lucky() {
    this.setState(
      {luckyLoading: true}
    );
    this.client.lucky().then(
      (response) => {
        this.setState({
          gif: {
            gif: response.data.idea,
            src: response.data.images.fixed_width_downsampled.gif_url,
            og_src: response.data.images.original.gif_url
          },
          luckyLoading: false
        })
      }
    )
  }

  render() {
    return (
      <Row>
        <Col xs={7} className="gif-search-box">
          <Row>
            <div className="big-gif"><img src={this.state.gif.og_src} /></div>
          </Row>
          <Row>
            {this.gifs.map(
              (gif, key) => {
                let setGifBig = this.setGif.bind(this, gif, key)
                return (
                  <div onClick={setGifBig} key={gif.gif}>
                    <GifBox active={this.state.gif.gif === gif.gif} gif={gif} />
                  </div>
                );
              }
            )}
          </Row>
        </Col>
        <Col xs={5}>
          <Row className="center">
            <Button className="gif-search-buttons" bsStyle="info" bsSize="large" onClick={this.shuffle}>Shuffle</Button>
          </Row>
          <Row className="center">
            <Button className="gif-search-buttons" disabled={this.state.luckyLoading} bsStyle="info" bsSize="large" onClick={this.lucky}>I'm feeling lucky</Button>
          </Row>
          <Row className="center">
            <Button className="gif-search-buttons" bsStyle="primary" bsSize="large" onClick={this.submit}>Submit</Button>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default GifSearch;
