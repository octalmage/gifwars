import React from 'react';
import {Container as Grid, Row, Col} from 'reactstrap';
import ConnectFirebase from '../../components/ConnectFirebase';
import MoveDisplay from '../../components/MoveDisplay';
import './stage.css';


class Stage extends React.PureComponent {
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
    const { game, moves, allMoves, match } = this.props;
    const { stage, voting_stage, timer, players, round } = game;
    const { id: roomcode } = match.params;

    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} md={12}>
            <h1 className="title">Gif Wars</h1>
            {stage === 'waiting' &&
            <React.Fragment>
            <div className="waiting">
              <h2>
                <span className="textBackground">
                  Go to <span className="domain">gifwars.party</span> on your mobile device to join in using room code
                  <span className="roomcode"> {roomcode}</span>
                </span>
              </h2>
              <h3>
                <span className="textBackground">
                  Press <span className="everyone">All players have joined</span> to start the game!
                </span>
              </h3>
          </div>
          <h3>
            <center>
            <span>
              {players.map((player, i) =>
                <span key={player + i}>
                  <span className="playerText textBackground">{player}</span>
                </span>)}
              </span>
            </center>
            </h3>
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
                <Col xs={12} md={6}>
                  <MoveDisplay
                    votes={moves[0].vote}
                    player={moves[0].player}
                    gif={moves[0].gif}
                  />
                </Col>
              }
              { moves[1] && moves[1].gif &&
                <Col xs={12} md={6}>
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
              {round === 3 &&
                <h1>Game Over!</h1>
              }
              <h1>Scores</h1>
              {this.calculateScores(allMoves)}
            </div>
          }
          {timer ?
            <h2>Time left: {timer}</h2>
          : null}
          </Col>
        </Row>
        {stage === 'waiting' &&
          <audio autoPlay tabIndex="0" loop>
            <source type="audio/mpeg" src="/sounds/elevator.mp3"></source>
          </audio>
        }
        {stage !== 'waiting' &&
          <audio autoPlay tabIndex="0" loop>
            <source type="audio/mpeg" src="/sounds/psychedelic.mp3"></source>
          </audio>
        }
      </Grid>
    );
  }
}

export default ConnectFirebase(Stage);
