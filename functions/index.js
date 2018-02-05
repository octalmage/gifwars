const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.games = functions.https.onRequest((request, response) => {
  switch (req.method) {
    case 'POST':
      startGame(request.query.player);
      break;
    default:
      res.status(418).send({ error: "I'M A TEAPOT" });
      break;
  }
});

function startGame(owner) {
  const roomcode = makeid(4);
  admin.database().ref(`/games/${roomcode}`).set({ players: [owner] }).then(() => {
    response.send({ roomcode: roomcode });
  });
}

function makeid(len) {
  const text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
