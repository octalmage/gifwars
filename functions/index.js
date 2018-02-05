const functions = require('firebase-functions');
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const values = require('object.values');

const prompts = ["What's the Mona Lisa smiling about?"];

admin.initializeApp(functions.config().firebase);

app.post('/', (request, response) => {
  createGame(request.body).then((roomcode) => {
    response.send({ roomcode });
  })
});

app.post('/:id/join', (request, response) => {
  response.send(joinGame(request.params.id, request.body))
});

app.post('/:id/start', (request, response) => {
  response.send(startGame(request.params.id))
});

exports.games = functions.https.onRequest(app);

const createGame = (owner) => {
  return new Promise((resolve) => {
    const roomcode = makeid(4);
    admin.database().ref(`/games/${roomcode}`).set({ players: [owner] }).then(() => {
      return resolve(roomcode);
    });
  });
};

const joinGame = (roomcode, player) => {
  return new Promise((resolve) => {
    admin.database().ref(`/games/${roomcode}/players`).push(player).then(() => {
      return resolve();
    });
  });
};

const startGame = (roomcode) => {
  return new Promise((resolve) => {
    return admin.database().ref(`/games/${roomcode}/round`).set(1).then(resolve);
  })
  .then(() => {

    const roomKey = admin.database().ref('/rounds').push();
    const getRoomKey = admin.database().ref(`/games/${roomcode}/rounds/1`).set(roomKey.key).then(() => roomKey.key);

    const getPlayers = admin.database().ref(`/games/${roomcode}/players`).once('value').then((snapshot) => {
      return values(snapshot.val());
    });

    return Promise.all([getRoomKey, getPlayers]);
  })
  .then(result => {
    const [roomKey, players] = result;
    return generateMoves({ players, roomcode, round: 1, roomKey });
  });
};

const generateMoves = ({ players, round, roomcode, roomKey }) => {
  // TODO: Generate prompt.
  const prompt = prompts[0];
  for (let x = 0; x <= players.length; x += 2) {
    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      player: players[x]
    });
    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      player: players[x+1]
    });
  }

  if (isOdd(players.length)) {
    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      player: players[players.length]
    });

    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      player: players[0]
    });
  }
};

const isOdd = num => { return num % 2; }

const addMove = ({ round, roomcode, prompt, player, roomKey}) => {
  return new Promise(resolve => {
    admin.database().ref('/moves').push(
      generateMove({
        round,
        roomcode,
        prompt,
        player,
      })
    )
    // Add the move key to the moves list.
    .then(result => admin.database().ref(`/rounds/${roomKey}`).push(result.getKey()));
  });
};

const generateMove = ({ round, roomcode, player, prompt }) => ({
  round: round,
  game: roomcode,
  prompt: prompt,
  player: player,
  gif: '',
  votes: [],
});

const makeid = (len) => {
  var text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
