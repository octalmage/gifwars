import React from 'react';
import firebase from '../../services/Firebase';

const withFirebase = (WrappedComponent, roomcode) =>
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        game: {},
        moves: [],
        allMoves: [],
      };
    }

    componentDidMount() {
      const roomcode = this.props.match.params.id;
      const gameRef = firebase.database().ref(`games/${roomcode}`);

      gameRef.on('value', snapshot => {
        const game = snapshot.val();
        this.setState({
          game,
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

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }


export default withFirebase;
