export default class Game {
  constructor() {
    this.host = process.env.NODE_ENV === 'production'
      ? 'https://us-central1-gif-war.cloudfunctions.net/games/'
      : 'http://localhost:5000/gif-war/us-central1/games/';
  }

  route(route) {
    return `${this.host}${route}`;
  }

  createGame() {
    return fetch(this.host, { method: 'post' })
    .then(response => response.json());
  }

  joinGame(roomcode, name, id) {
    return fetch(this.route(`${roomcode}/join`), { body: JSON.stringify({ name, id }), method: 'post' })
    .then(response => response.json());
  }

  startGame(roomcode) {
    return fetch(this.route(`${roomcode}/start`), { method: 'post' })
    .then(response => response.json());
  }
}
