export default class Game {
  constructor() {
    this.host = 'https://us-central1-gif-war.cloudfunctions.net/games/';
  }

  route(route) {
    return `${this.host}${route}`;
  }

  createGame() {
    return fetch(this.host, { method: 'post' })
    .then(response => response.json());
  }

  joinGame(roomcode, name) {
    return fetch(this.route(`${roomcode}/join`), { body: name, method: 'post' })
    .then(response => response.json());
  }

  startGame(roomcode) {
    return fetch(this.route(`${roomcode}/start`), { method: 'post' })
    .then(response => response.json());
  }
}
