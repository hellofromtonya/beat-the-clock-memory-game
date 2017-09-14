'use strict';

const gameConfig = getGameConfig();

/**
 * @description Initialize the cards by looking up the `.card` nodes in the DOM,
 *              bind a click event, and then instantiating a new Card object.
 *
 * @param {Object} config Runtime configuration parameters
 * @function
 */
const buildCards = (config) => {
  // Array of game Card objects
  return Array.from(document.querySelectorAll('.card')).map((el, index) => {
    config.positionOnBoard = index;

    return new Card(
      el, // card element
      config
    );
  });
};

const gameApp = new GameController(
  gameConfig.gameController,
  buildCards(gameConfig.card)
);

gameApp.initialize(
  new GameClock(gameConfig.gameClock, gameApp),
  new Player(gameConfig.playerModel),
  new CardSymbols(gameConfig.cardSymbols),
  new View(gameConfig.view)
);

gameApp.registerEventListeners();
gameApp.startNewGame();
