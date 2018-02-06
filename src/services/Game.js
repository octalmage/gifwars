export default class Game {
  constructor() {
    this.host = 'http://localhost:5000/gif-war/us-central1/games';
  }

  route(route) {
    return `${this.host}/${route}`;
  }

  startGame() {
    return fetch(this.host, { method: 'post' })
    .then(response => response.json());
  }

  joinGame(roomcode, name) {
    return fetch(this.route(`${roomcode}/join`), { body: name, method: 'post' })
    .then(response => response.json());
  }
}
