import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import ConnectFirebase from '../../components/ConnectFirebase';
import MoveDisplay from '../../components/MoveDisplay';
import avatar8 from '../../images/dino_thumb.png';
import avatar1 from '../../images/crabby_thumb.png'
import avatar2 from '../../images/cat_thumb.png'
import avatar3 from '../../images/caterpillar_thumb.png'
import avatar4 from '../../images/doggo_thumb.png'
import avatar5 from '../../images/birb_thumb.png'
import avatar6 from '../../images/giraffe_thumb.png'
import avatar7 from '../../images/koaler_thumb.png'
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
    const { stage, voting_stage, timer, players } = game;
    const { id: roomcode } = match.params;

    const images = [avatar1,avatar2,avatar3,avatar4,avatar5,avatar6,avatar7,avatar8];
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} md={12}>
            <h1 className="title">Gif Wars</h1>
            {stage === 'waiting' &&
<React.Fragment>
            <div className="waiting">
              <h2>
                Go to <span className="domain">gifwars.party</span> on your mobile device to join in using room code
                <span className="roomcode"> {roomcode}</span>
              </h2>
              <h3>
                Press <span className="everyone">All players have joined</span> to start the game!
              </h3>

          </div>
          <h3>
            Players: <br />
            {players.map((player, i) =>
            <span key ={player}>
              <span className= "playerText">{player}</span>
            <img alt="" src = {images[i]} className="playerImage"/>
            <br />
          </span>)}
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
              <h1>Scores</h1>
              {this.calculateScores(allMoves)}</div>
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
