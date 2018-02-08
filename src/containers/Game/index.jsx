import React from 'react';
import {Grid, Row} from 'react-bootstrap';
import GifSearch from '../../components/GifSearch';
import ConnectFirebase from '../../components/ConnectFirebase';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';
import background from './images/PoweredBy_200_Horizontal_Light-Backgrounds_With_Logo.gif';
import firebase from '../../services/Firebase';
import GameAPI from '../../services/Game';
import GifVote from '../../components/GifVote';

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.userTotal = 0;
    this.state.user = {
      name: props.location.state ? props.location.state.name : '',
    };

    this.state.currentMoves = [];
  }

  componentDidMount() {
    if (!this.props.location.state || !this.props.location.state.name) {
      this.props.history.push('/join');
      return;
    }
  }

  calcUserTotal(myMove) {
    let total = 0;
    total += myMove && myMove.vote ? Object.values(myMove.vote).length : 0;
    this.setState({
      userTotal: total
    });
  }

  render() {
    const { myMove, game, moves } = this.props;
    const { stage, voting_stage, round, pair_id, timer } = game;
    const roomcode = this.props.match.params.id;
    return (
      <Grid>
        {stage === 'picking' &&
          <React.Fragment>
            <Row className="center">
              <h1> {this.state.user.name + ' in ' + roomcode + ' on Round ' + round } </h1>
            </Row>
            <Row>
              {myMove && <GifSearch user={this.state.user} move={myMove} countdown={timer} />}
            </Row>
          </React.Fragment>
        }
        {stage === 'voting' && voting_stage === 'voting' &&
          <React.Fragment>
            <Row className="center">
              <h1> {'Voting in ' + this.state.id + ' on Round ' + round } </h1>
            </Row>
            <Row>
              <GifVote user={this.state.user} pair={pair_id} moves={moves} countdown={timer} />
            </Row>
          </React.Fragment>
        }
        {stage === 'voting' && voting_stage === 'score' &&
          <React.Fragment>
            <Row className="center">
              <h1> {'Voting in ' + roomcode + ' on Round ' + round } </h1>
            </Row>
            <Row>
              <h1>Results are being tallied up on the main stage!</h1>
            </Row>
          </React.Fragment>
        }
        {stage === 'waiting' &&
          <React.Fragment>
            Waiting for other players to join.
            <br />
            <br />
            <Button
              onClick={() => {
                new GameAPI().startGame(this.props.match.params.id)
              }}
              bsStyle="primary"
              bsSize="large">
              All players have joined
            </Button>
          </React.Fragment>
        }
        {stage === 'score' && myMove &&
          <React.Fragment>
            <Row className="center">
              <h1> {'Score for ' + this.state.user.name + ' in Room '+ roomcode + ' on Round ' + round } </h1>
            </Row>
            <Row>
              <div className="big-gif"><img alt="" src={myMove.gif.og_src} /></div>
            </Row>
            <Row className="center">
              <h1>Round {round}: {myMove.vote ? Object.values(myMove.vote).length : 0} </h1>
              {/* <h1>Total: {this.state.userTotal + (this.state.myMove.vote ? Object.values(this.state.myMove.vote).length : 0)}</h1> */}
            </Row>
          </React.Fragment>
        }
      </Grid>
    );
  }
}

export default withRouter(ConnectFirebase(Game));
