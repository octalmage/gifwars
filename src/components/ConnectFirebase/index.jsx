import React from 'react';
import firebase from '../../services/Firebase';

const ConnectFirebase = WrappedComponent =>
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        game: {},
        moves: [],
        allMoves: [],
        myMove: [],
      };
    }

    componentDidMount() {
      const roomcode = this.props.match.params.id;
      const gameRef = firebase.database().ref(`games/${roomcode}`);

      gameRef.on('value', snapshot => {
        let game = snapshot.val();

        // Firebase arrays have unique keys, we just want an array.
        game.players = game.players ? Object.values(game.players) : [];

        this.setState({
          game,
        });

        if (game.rounds) {
          const getRounds = [];
          for (let x = 1; x <= 3; x++) {
            getRounds.push(this.getMovesForRound(game.rounds[x]));
          }

          Promise.all(getRounds)
          // Flatten array.
          .then(allMoves => [].concat.apply([], allMoves))
          // Lookup player names by uid.
          .then(this.correctPlayerNames)
          .then(allMoves => {
            let newState = {
              allMoves,
            };
            const movesForRound = allMoves.filter(move => move.round === game.round);
            const filteredMoves = movesForRound.filter(move => move.pair_id === game.pair_id);
            newState['moves'] = filteredMoves;
            if (this.props.location.state && this.props.location.state.name) {
              newState['myMove'] = filteredMoves.filter(move => move.playerId === firebase.auth().currentUser.uid)[0];
            }
            this.setState(newState);
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
            let getMoves = Object.values(round).map(moveId => {
              return firebase.database().ref(`moves/${moveId}`).once('value').then(snapshot => snapshot.val())
              .then(move => {
                // Append moveId to the move object for submitting and voting.
                const newMove = {...move};
                newMove.id = moveId;
                return newMove;
              });
            });

            return resolve(Promise.all(getMoves));
          } else {
            return resolve([]);
          }
        });
      });
    }

    correctPlayerNames(moves) {
      if (!moves.length) {
        return Promise.resolve(moves);
      }

      return firebase.database().ref(`games/${moves[0].game}/players`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(players => {
        for (let x in moves) {
          moves[x].playerId = moves[x].player;
          moves[x].player = players[moves[x].player];
        }
        return moves;
      });
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }


export default ConnectFirebase;
