import { Game } from './core/Game.js';

const canvas = document.getElementById('c');
const game = new Game(canvas);
game.start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    game.destroy();
  });
}
