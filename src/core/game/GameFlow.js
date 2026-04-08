export class GameFlow {
  constructor({ events, state, gameState, levelManager, transition }) {
    this._events = events;
    this._state = state;
    this._gs = gameState;
    this._levelManager = levelManager;
    this._transition = transition;

    this._wireEvents();
  }

  _wireEvents() {
    this._events.on('input:tap', () => this._handleTap());
    this._events.on('input:pause', () => this._togglePause());
    this._events.on('input:sound', () => this._toggleSound());
    this._events.on('game:autopause', () => this._autoPause());
    this._events.on('state:force', (nextState) => this._forceState(nextState));
  }

  _handleTap() {
    if (this._transition.tryConfirm()) {
      return;
    }

    if (this._transition.isActive) {
      return;
    }

    if (this._state.is('pause')) {
      this._resumeGame();
      return;
    }

    if (this._state.is('play') && this._gs.ball?.stuck) {
      this._events.emit('ball:launch');
      return;
    }

    if (this._state.is('title') || this._state.is('gameover') || this._state.is('win')) {
      this._restartRun();
    }
  }

  _togglePause() {
    if (this._state.is('play')) {
      this._pauseGame();
      return;
    }

    if (this._state.is('pause')) {
      this._resumeGame();
    }
  }

  _toggleSound() {
    this._gs.soundOn = !this._gs.soundOn;
  }

  _autoPause() {
    if (!this._state.is('play')) {
      return;
    }

    this._pauseGame();
  }

  _forceState(nextState) {
    this._state.reset(nextState);

    if (nextState === 'play') {
      this._gs.paused = false;
    }
  }

  _pauseGame() {
    this._state.go('pause');
    this._gs.paused = true;
  }

  _resumeGame() {
    this._state.go('play');
    this._gs.paused = false;
  }

  _restartRun() {
    this._gs.resetGame();
    this._levelManager.initLevel();
    this._state.reset('play');
    this._gs.paused = false;
  }
}
