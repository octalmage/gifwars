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
          this.getMovesForRound(game.rounds[game.round])
          .then(moves => {
            const filteredMoves = moves.filter(move => move.pair_id === game.pair_id);
            const myMoves = moves.filter(move => move.pair_id === game.pair_id);
            this.setState({
              moves: filteredMoves,
            });

            if (this.props.location.state && this.props.location.state.name) {
              const myMoves = filteredMoves.filter(move => move.player === this.props.location.state.name);
              this.setState({
                myMove: myMoves[0],
              });
            }
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

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }


export default ConnectFirebase;
