import firebase from '../services/Firebase';

class FirebaseHelper {
  constructor() {
    this.firebase = firebase.database();
  }

  emptyMove() {
    return {
      game: '',
      gif: '',
      player: '',
      prompt: '',
      round: ''
    };
  }

  vote(user, move) {
    this.firebase.ref(`moves/${move}`).update({vote: user.name});
  }

  submit(gif, move) {
    this.firebase.ref(`moves/${move}`).set({gif: gif});
  }
}

export default FirebaseHelper;
