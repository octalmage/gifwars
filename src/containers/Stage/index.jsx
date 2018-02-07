import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Game from '../../services/Game';
import MoveDisplay from '../../components/MoveDisplay';
import firebase from '../../services/Firebase';
import avatar8 from '../../images/dino_thumb.png';
import avatar1 from '../../images/crabby_thumb.png'
import avatar2 from '../../images/cat_thumb.png'
import avatar3 from '../../images/caterpillar_thumb.png'
import avatar4 from '../../images/doggo_thumb.png'
import avatar5 from '../../images/birb_thumb.png'
import avatar6 from '../../images/giraffe_thumb.png'
import avatar7 from '../../images/koaler_thumb.png'
import './stage.css'


class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      stage: 'waiting',
      round: 0,
      voting_stage: '',
      pair_id: 1,
      rounds: [],
      moves: [],
      allMoves: [],
      timer: 0,
    }

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
      const roomcode = this.props.match.params.id;
      this.setState({ roomcode });

      const gameRef = firebase.database().ref(`games/${roomcode}`);

      gameRef.on('value', snapshot => {
        const game = snapshot.val();

        this.setState({
          stage: game.stage,
          round: game.round,
          players: game.players ? Object.values(game.players) : [],
          voting_stage: game.voting_stage,
          rounds: game.rounds ? Object.values(game.rounds) : [],
          pair_id: game.pair_id,
          timer: game.timer,
        });

        if (game.rounds) {
          this.getMovesForRound(game.rounds[game.round])
          .then(moves => {
            const filteredMoves = moves.filter(move => move.pair_id === game.pair_id);
            this.setState({
              moves: filteredMoves,
            });
          })

          const getRounds = [];
          for (let x = 1; x <= 3; x++) {
            getRounds.push(this.getMovesForRound(game.rounds[x]));
          }

          Promise.all(getRounds).then(allMoves => {
            const flattened = [].concat.apply([], allMoves);
            this.setState({ allMoves: flattened });
          });
        }
      });
  }

  getMovesForRound(round) {
    const roundRef = firebase.database().ref(`rounds/${round}`);
    return new Promise(resolve => {
      roundRef.once('value', snapshot => {
        const round = snapshot.val();
        if (round) {
          let getMoves = Object.values(round).map(move => {
            return firebase.database().ref(`moves/${move}`).once('value').then(snapshot => snapshot.val());
          });

          return resolve(Promise.all(getMoves));
        } else {
          return resolve([]);
        }
      });
    });
  }

  getWinner(moves) {
    const scores = moves.map(move => {
      const newMove = {...move};
      newMove['score'] = move.vote ? Object.values(move.vote).length : 0;
      return newMove;
    });

    if (!scores.length) {
      return;
    }

    if (scores[0].score > scores[1].score) {
      return scores[0].player;
    } else {
      return scores[1].player;
    }
  }

  calculateScores(moves) {
    const scores = moves.map(move => {
      const newMove = {...move};
      newMove['score'] = move.vote ? Object.values(move.vote).length : 0;
      return newMove;
    });

    let groupedScores = [];
    scores.reduce(function (res, score) {
      if (!res[score.player]) {
        res[score.player] = {
          score: 0,
          player: score.player
        };

        groupedScores.push(res[score.player])
      }
      res[score.player].score += score.score
      return res;
    }, {});

    groupedScores.sort((a, b) => b.score - a.score);

    return groupedScores.map(score => <h3>{score.player}: {score.score}<br /></h3>)
  }

  render() {
    const { stage, voting_stage, moves, allMoves, timer } = this.state;
    const images = [avatar1,avatar2,avatar3,avatar4,avatar5,avatar6,avatar7,avatar8];
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={12}>
            {stage === 'waiting' &&
            <React.Fragment>
              <h1 className="App-title">Start a Game</h1>
              <p>Room Code: {this.state.roomcode}</p>
              <p>
                Players: <br />
                {this.state.players.map((player, i) =>
                <span key ={player}>
                  <span className= "playerText">{player}</span>
                <img alt="" src = {images[i]} className="playerImage"/>
                <br />
              </span>)}
              </p>
            </React.Fragment>
          }
          {stage === 'picking' &&
          <h1>
            Answer the prompts on your device.
          </h1>
          }
          {stage === 'voting' &&
          <React.Fragment>
            <h1>{moves[0] && moves[0].prompt}</h1>
            {voting_stage === 'score' &&
              <React.Fragment>
                <h1>{this.getWinner(moves)} is the winner!</h1>
              </React.Fragment>
            }
            <Row className="show-grid">
              { moves[0] && moves[0].gif &&
                <Col xs={6} md={6}>
                  <MoveDisplay
                    votes={moves[0].vote}
                    player={moves[0].player}
                    gif={moves[0].gif}
                  />
                </Col>
              }
              { moves[1] && moves[1].gif &&
                <Col xs={6} md={6}>
                  <MoveDisplay
                    votes={moves[1].vote}
                    player={moves[1].player}
                    gif={moves[1].gif}
                  />
                </Col>
              }
            </Row>
          </React.Fragment>
          }
          {stage === 'score' &&
            <div>
              <h1>Scores</h1>
              {this.calculateScores(allMoves)}</div>
          }
          {(timer && timer !== 0) ?
            <h2>Time left: {timer}</h2>
          : null}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Stage;
