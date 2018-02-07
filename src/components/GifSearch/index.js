import React from 'react';
import './GifSearch.css';
import {Row, Col, Button} from 'react-bootstrap';

import GifBox from '../GifBox';
import firebase from '../../services/Firebase';
import GiphyClient from '../../services/api/giphy';

class GifSearch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      gif: {}
    };

    this.shuffle = this.shuffle.bind(this);
    this.lucky = this.lucky.bind(this);
    this.gifs = [];
    this.submit = this.submit.bind(this);
    this.state.countdown = 0;
    this.loading = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.move && (nextProps.move !== this.props.move)) {
      console.log(nextProps);
      this.client = new GiphyClient(nextProps.move.prompt);
      if (this.gifs.length === 0) {
        this.buildList();
      }
    }
  }

  buildList() {
    if (!this.loading) {
      this.loading = true;
      this.client.retrieve().then(
        (response) => {
          response.data.forEach((gifObject) => {
            this.gifs.push(this.client.convert(gifObject));
          });
          this.setupTimer();
          this.setState(
            {
              gifs: this.gifs
            }
          );
          this.loading = false;
        }
      );
    }
  }

  setupTimer() {
    const roomcode = this.props.move.game
    const gameRef = firebase.database().ref(`games/${roomcode}`);

    gameRef.on('value', (snapshot) => {
      const game = snapshot.val();
      this.setState({
        countdown: game.timer
      });
    });
  }


  setGif(gif) {
    this.setState(
      {
        gif: gif,
      }
    );
  }

  submit() {
    firebase.database().ref(`moves/${this.props.move.id}`).update({gif: this.state.gif});
  }

  shuffle() {
    this.setState({
      gif: this.client.shuffle(this.gifs)
    })
  }

  lucky(nsfw) {
    this.setState(
      {luckyLoading: true}
    );
    this.client.lucky(nsfw).then(
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
        <Col md={12} xs={12} className="center">
          <h2>{ this.state.countdown } seconds remaining</h2>
        </Col>
        <Col md={7} xs={12} className="gif-search-box">
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
        <Col xs={12} md={5}>
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
