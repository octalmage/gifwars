import React from 'react';
import './GifSearch.css';
import {Row, Col, Button, Input} from 'reactstrap';

import GifBox from '../GifBox';
import firebase from '../../services/Firebase';
import GiphyClient from '../../services/api/giphy';

class GifSearch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      gif: {},
      search: '',
    };

    this.firebase = firebase.database();
    this.shuffle = this.shuffle.bind(this);
    this.lucky = this.lucky.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.search = this.search.bind(this);
    this.gifs = [];
    this.submit = this.submit.bind(this);
    this.state.countdown = 0;
    this.loading = false;
    this.client = new GiphyClient(props.move.prompt);

    if (this.gifs.length === 0) {
      this.buildList();
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

  setGif(gif) {
    this.setState(
      {
        gif: gif,
      }
    );
  }

  submit() {
    this.firebase.ref(`moves/${this.props.move.id}`).update({ gif: this.state.gif });
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
            gif: response.data.images.id,
            src: response.data.images.fixed_width_downsampled.gif_url,
            og_src: response.data.images.original.gif_url
          },
          luckyLoading: false
        })
      }
    )
  }

  updateSearch(e) {
    this.setState({
      search: e.target.value,
    });
  }

  search() {
    this.gifs = [];
    this.client = new GiphyClient(this.state.search);
    this.buildList();
  }

  render() {
    return (
      <Row>
        <Col md={12} sm={12} className="center">
          <h2>{ this.props.countdown } seconds remaining</h2>
        </Col>
        <Col md={7} xs={12} className="gif-search-box">
        <Row className="center">
          {this.props.move &&
            <h2>Prompt: "{this.props.move.prompt}"</h2>
          }
        </Row>
          <Row>
            <Input
              type="text"
              value={this.state.search}
              onChange={this.updateSearch}
            />
            <Button
              className="gif-search-buttons"
              color="info"
              size="sm"
              onClick={this.search}
            >
              Search
            </Button>
          </Row>
          <Row>
            <div className="big-gif"><img alt="" src={this.state.gif.og_src} /></div>
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
            <Button className="gif-search-buttons" color="primary" size="lg" onClick={this.submit}>Submit</Button>
          </Row>
          <Row className="center">
            <Button className="gif-search-buttons" color="info" size="lg" onClick={this.shuffle}>Shuffle</Button>
          </Row>
          <Row className="center">
            <Button className="gif-search-buttons" disabled={this.state.luckyLoading} color="info" size="lg" onClick={this.lucky}>I'm feeling lucky</Button>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default GifSearch;
