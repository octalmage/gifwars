const functions = require('firebase-functions');
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const values = require('object.values');
const cors = require('cors')({ origin: true });

const { isOdd, makeid } = require('./src/Utils');

// TODO: Read these from the file.
const prompts = ["What's the Mona Lisa smiling about?"];

admin.initializeApp(functions.config().firebase);

// Enable cors support.
app.use(cors);

app.post('/', (request, response) => {
  createGame(request.body).then((roomcode) => {
    response.send({ roomcode });
  })
});

app.post('/:id/join', (request, response) => {
  response.send(joinGame(request.params.id, request.body))
});


app.post('/:id/start', (request, response) => {
  const roomcode = request.params.id;
  startGame(roomcode).then(() => response.send({}));
});

exports.games = functions.https.onRequest(app);

exports.gameRound = functions.database.ref('/games/{roomcode}/stage')
    .onWrite(event => {
      const roomcode = event.params.roomcode;
      const stage = event.data.val();

      return admin.database().ref(`/games/${roomcode}/round`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(round => {

        if (!round || !stage) {
          return;
        }

        if (round === 3 && stage === 'score') {
          return;
        }

        let newStage = '';
        let timer = 15;

        if (stage === 'waiting') {
          return;
        } else if (stage === 'picking') {
          newStage = 'voting';
        } else if (stage === 'voting') {
          return admin.database().ref(`/games/${roomcode}`)
          .update({
            pair_id: 1,
            voting_stage: 'voting',
          });
        } else if (stage === 'score') {
          newStage = 'picking';
          round += 1;
        }

        return startTimer(roomcode, timer)
        .then(() => admin.database().ref(`/games/${roomcode}`).update({ round, stage: newStage }));
      });
    });

exports.gameVoting = functions.database.ref('/games/{roomcode}/voting_stage')
  .onWrite(event => {
    const voting_stage = event.data.val();
    const timer = voting_stage === 'voting' ? 15 : 5;
    const roomcode = event.params.roomcode;
    return startTimer(roomcode, timer)
    .then(() => {
      return Promise.all([getPairCount(roomcode), getPairId(roomcode)])
      .then(result => {
        let [count, pair_id] = result;
        if (voting_stage === 'voting') {
          return admin.database().ref(`/games/${roomcode}`).update({ voting_stage: 'score' });
        }
        else if (pair_id < count && voting_stage === 'score') {
          pair_id = parseInt(pair_id) + 1;
          return admin.database().ref(`/games/${roomcode}`).update({ pair_id, voting_stage: 'voting' });
        } else {
          return updateValue(`/games/${roomcode}`, { stage: 'score' });
        }
      })
    });
  });

const getVotingStage = roomcode => getValue(`/games/${roomcode}/voting_stage`);
const getPairId = roomcode => getValue(`/games/${roomcode}/pair_id`);
const getPlayers = roomcode => getValues(`/games/${roomcode}/players`);
const getRound = roomcode => getValue(`/games/${roomcode}/round`);

const getValue = path =>
  admin.database()
  .ref(path)
  .once('value')
  .then(snapshot =>
    snapshot.val())

const getValues = path =>
  admin.database()
  .ref(path)
  .once('value')
  .then(snapshot =>
    values(snapshot.val()))

const updateValue = (path, value) =>
  admin.database().ref(path).update(value)

const setValue = (path, value) =>
  admin.database().ref(path).set(value)

const getPairCount = roomcode => getPlayers(roomcode)
.then(players => Math.ceil(players.length / 2));

const startTimer = (roomcode, time) => [...Array(time+1)].reduce( (p, _, i) =>
p.then(_ => new Promise(resolve =>
  setTimeout(() => {
    admin.database().ref(`/games/${roomcode}/timer`).once('value').then((snapshot) => {
      let timer = snapshot.val();
      if (timer) {
        timer = timer - 1;
      } else {
        timer = time;
      }
      return admin.database().ref(`/games/${roomcode}/timer`).set(timer);
    }).then(resolve);
  }, 1000)
)), Promise.resolve());

const createGame = (owner) => {
  return new Promise((resolve) => {
    const roomcode = makeid(4);
    admin.database().ref(`/games/${roomcode}`)
    .set({
      players: [owner],
      round: 0,
      stage: 'waiting',
    }).then(() => {
      return resolve(roomcode);
    });
  });
};

const joinGame = (roomcode, player) => admin.database().ref(`/games/${roomcode}/players`).push(player);

const startGame = roomcode => {
  return startRound(roomcode, 1)
  .then(() => startRound(roomcode, 2))
  .then(() => startRound(roomcode, 3))
};

const startRound = (roomcode, round) => {
  return new Promise((resolve) => {
    return admin.database().ref(`/games/${roomcode}`).update({
      round: 1,
      stage: 'picking',
    }).then(resolve);
  })
  .then(() => {
    const roomKey = admin.database().ref('/rounds').push();
    const getRoomKey = admin.database().ref(`/games/${roomcode}/rounds/${round}`).set(roomKey.key).then(() => roomKey.key);

    return Promise.all([getRoomKey, getPlayers(roomcode)]);
  })
  .then(result => {
    const [roomKey, players] = result;
    return generateMoves({ players, roomcode, round: round, roomKey });
  });
};

const generateMoves = ({ players, round, roomcode, roomKey }) => {
  // TODO: Generate prompt.
  const prompt = prompts[0];
  let pair_id = 1;
  for (let x = 0; x < players.length; x += 2) {
    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      pair_id,
      player: players[x],
    });
    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      pair_id,
      player: players[x+1],
    });

    pair_id++;
  }

  if (isOdd(players.length)) {
    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      pair_id,
      player: players[players.length],
    });

    addMove({
      round,
      roomcode,
      prompt,
      roomKey,
      pair_id,
      player: players[0],
    });
  }
};

const addMove = ({ round, roomcode, prompt, player, roomKey, pair_id }) => {
  return new Promise(resolve => {
    return admin.database().ref('/moves').push(
      generateMove({
        round,
        roomcode,
        prompt,
        player,
        pair_id,
      })
    )
    // Add the move key to the moves list.
    .then(result => admin.database().ref(`/rounds/${roomKey}`).push(result.getKey()));
  });
};

const generateMove = ({ round, roomcode, player, prompt, pair_id }) => ({
  pair_id: pair_id,
  round: round,
  game: roomcode,
  prompt: prompt,
  player: player,
  gif: '',
  votes: [],
});
