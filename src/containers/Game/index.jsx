import React from 'react';
import {Container as Grid} from 'reactstrap';
import GifSearch from '../../components/GifSearch';
import ConnectFirebase from '../../components/ConnectFirebase';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';
import firebase from '../../services/Firebase';
import GameAPI from '../../services/Game';
import GifVote from '../../components/GifVote';

class Game extends React.PureComponent {
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
    // Redirect the user to the join screen if they don't have a user name.
    if (!this.props.location.state || !this.props.location.state.name) {
      this.props.history.push('/join');
      return;
    }
  }

  calcUserTotal(moves) {
    const currentUser = firebase.auth().currentUser;
    let total = 0;
    for (let x in moves) {
      if (moves[x].playerId === currentUser.uid) {
        total += moves[x] && moves[x].vote ? Object.values(moves[x].vote).length : 0;
      }
    }

    return total;
  }

  render() {
    const { myMove, game, moves, allMoves } = this.props;
    const { stage, voting_stage, round, pair_id, timer } = game;
    const roomcode = this.props.match.params.id;
    return (
      <Grid fluid>
        {stage === 'picking' &&
          <React.Fragment>
            <div className="center">
              <h1> {this.state.user.name + ' in ' + roomcode + ' on Round ' + round } </h1>
            </div>
            <div>
              {myMove && <GifSearch user={this.state.user} move={myMove} countdown={timer} />}
            </div>
          </React.Fragment>
        }
        {stage === 'voting' && voting_stage === 'voting' &&
          <React.Fragment>
            <div className="center">
              <h1> {'Voting in ' + roomcode + ' on Round ' + round } </h1>
            </div>
            <div>
              <GifVote user={this.state.user} pair={pair_id} moves={moves} countdown={timer} />
            </div>
          </React.Fragment>
        }
        {stage === 'voting' && voting_stage === 'score' &&
          <React.Fragment>
            <div>
              <h1>Results are being tallied up on the main stage!</h1>
            </div>
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
              color="primary"
              size="lg">
              All players have joined
            </Button>
          </React.Fragment>
        }
        {stage === 'score' && myMove &&
          <React.Fragment>
            <div className="center">
              <h1> {'Score for ' + this.state.user.name + ' in Room '+ roomcode + ' on Round ' + round } </h1>
            </div>
            <div>
              {myMove.gif &&
                <div className="big-gif"><img alt="" src={myMove.gif.og_src} /></div>
              }
            </div>
            <div className="center">
              <h1>
                Round {round}: {myMove.vote ? Object.values(myMove.vote).length : 0}
                <br />
                Total: {this.calcUserTotal(allMoves)}
              </h1>
            </div>
          </React.Fragment>
        }
      </Grid>
    );
  }
}

export default withRouter(ConnectFirebase(Game));
