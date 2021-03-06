'use strict';

/**
 * @description Memory Game Controller
 *
 * @param {Object} config Runtime configuration parameters
 * @param {Array} cards Array of card objects
 *
 * @constructor
 */
const GameController = function(config, cards) {
  this._config = config;
  this._cards = cards;

  this.elements = {
    body: document.getElementsByTagName('body')[0],
  };

  this._numberCards = config.numCards;
  this._requiredMatches = config.numMatches;
  this._numberCardSets = this._numberCards / this._requiredMatches;
  this._cardsInPlay = [];
};

/************************
 * Initializers
 ***********************/

/**
 * @description Initialize the remaining objects
 *
 * @param {GameClock} gameClock Instance of the Game Clock
 * @param {Player} player Instance of the Player's Model
 * @param {CardSymbols} cardSymbols Instance of the Card Symbols
 * @param {View} view Instance of the View
 *
 * @method
 */
GameController.prototype.initialize = function(
    gameClock, player, cardSymbols, view) {
  this.gameClock = gameClock;
  this.player = player;
  this.cardSymbols = cardSymbols;
  this.view = view;
  this._inPlay = false;
};

/**
 * @description Register event listeners.
 *              We have one event listener that monitors for click events
 *              and then routes the right events to their task.
 *
 * @method
 */
GameController.prototype.registerEventListeners = function() {
  this.elements.body.addEventListener('click', function(event) {
    event.stopPropagation();

    // Bail out as these are not game clicks.
    if (event.target === event.currentTarget ||
        !event.target.matches('.game-control, I, .card, button')) {
      return false;
    }

    // A game control was clicked.
    if (event.target.classList.contains('game-control') ||
        event.target.nodeName == 'I' &&
        event.target.parentNode.classList.contains('game-control')) {

      const el = event.target.nodeName == 'I'
          ? event.target.parentNode
          : event.target;

      if (el.hasAttribute('data-section-id')) {
        this.loadSection(el.getAttribute('data-section-id'));

        // Call the method.
      } else if (el.hasAttribute('data-control')) {
        this[el.getAttribute('data-control')]();
      }

      return false;
    }

    // A card was clicked.
    if (event.target.classList.contains('card') &&
        !event.target.classList.contains('match')) {
      const index = Array.from(event.target.parentNode.children).
          indexOf(event.target);

      // Prevent flipping cards over when 2 cards are in play.
      if (this._inPlay) {
        return false;
      }

      if (!this.gameClock.isRunning()) {
        this.gameClock.start(this.player.getLevel());
      }

      this.flipCard(index);

      return false;
    }

  }.bind(this), false);

};

/************************
 * Game Controls
 ***********************/

/**
 * @description Start a new game. Handles the tasks to reset everything and
 *              shuffle the card symbols, and then update the cards.
 *
 * @method
 */
GameController.prototype.startNewGame = function() {
  this.gameClock.reset(this.player.getLevel());

  this._cardsInPlay = [];

  this.view.resetGame(this.player.resetStats());

  // shuffle
  this.cardSymbols.shuffleCardSymbols(this._numberCards, this._requiredMatches);

  // Update symbol cards.
  this._cards.forEach((card, index) => {
    card.setSymbol(this.cardSymbols.symbols[index]);
  });
};

/**
 * @description Displays the selected screen.
 *
 * @param {String} sectionID ID attribute of the screen to display
 *
 * @method
 */
GameController.prototype.loadSection = function(sectionID) {
  Array.from(document.querySelectorAll('.screen')).map((el) => {
    // if this is the right screen, remove the .hide
    if (el.id === sectionID) {
      el.classList.remove('hide');
    } else {
      // else, hide the screen.
      el.classList.add('hide');
    }
  });
};

/************************
 * Game Handlers
 ***********************/

/**
 * @description Flips the card. If there are 0.0.5 in play, then triggers
 *              the checkMatch() method.
 *
 * @param {number} index Card index, i.e. position on the board
 *
 * @method
 */
GameController.prototype.flipCard = function(index) {
  const card = this._cards[index];

  if (card.isMatched() || card.isShowing()) {
    return false;
  }

  card.showCard();

  this._cardsInPlay.push(index);

  if (this._cardsInPlay.length === this._requiredMatches) {
    this._inPlay = true;
    window.setTimeout(this.checkMatch.bind(this), 500);
  }
};

/**
 * @description Handles the card match checking tasks.
 *
 * @method
 */
GameController.prototype.checkMatch = function() {
  let cardsInPlay = this._cardsInPlay;

  if (this.areMatched(cardsInPlay)) {
    this.setMatched(cardsInPlay);

  } else {
    this.setMismatched(cardsInPlay);
  }

  this.view.updateScore(this.player.getScore());
  this.view.updateMoves(this.player.getNumberMoves());

  if (this.player.haveStarsChanged()) {
    this.view.updateStars(this.player.getStars());
  }

  if (this.isGameOver()) {
    this.gameOver();
  }

  // reset the cards in play array.
  this._inPlay = false;
  this._cardsInPlay = [];
};

/**
 * @description Check if the cards in play match each other.
 *
 * @param {Array} cardsInPlay Array of cards in play
 *
 * @returns {boolean}
 */
GameController.prototype.areMatched = function(cardsInPlay) {
  if (cardsInPlay.length < this._requiredMatches) {
    return false;
  }

  const symbol = this._cards[cardsInPlay[0]].getSymbol();

  return cardsInPlay.every(cardIndex => symbol === this._cards[cardIndex].getSymbol());
};

/**
 * @description Handles when the cards match by updating
 *              the player's model, view, and each card as well as
 *              checking if the game is over.
 *
 * @param {Array} cardsInPlay Array of cards in play
 *
 * @method
 */
GameController.prototype.setMatched = function(cardsInPlay) {
  this.player.setMatched();

  cardsInPlay.forEach((index) => {
    this._cards[index].setMatched();
  });
};

/**
 * @description Handles the mismatched tasks to reset the cards and
 *              update the player's model and view.
 *
 * @param {Array} cardsInPlay Array of cards in play
 *
 * @method
 */
GameController.prototype.setMismatched = function(cardsInPlay) {
  this.player.setMismatched();

  cardsInPlay.forEach((index) => {
    this._cards[index].hideCard();
  });
};

/**
 * @description Checks if the game is over. How? By comparing the
 *              number of matches to the number of cards in the set.
 *
 * @return {Boolean} Returns true if all the cards are showing.
 *
 * @method
 */
GameController.prototype.isGameOver = function() {
  return this.player.getNumberMatches() >= this._numberCardSets;
};

/**
 * @description Handles the tasks for when the game is over.
 *
 * @method
 */
GameController.prototype.gameOver = function() {
  this.gameClock.stop();

  this.view.showGameOver(
      this.player.tallyGameStats(this.gameClock.getActualTime()));

  this.hideAllCards();
};

/**
 * @description Game time out handler.
 *
 * @method
 */
GameController.prototype.timeOut = function() {
  this.view.showTimedOut();

  this.hideAllCards();
};

/**
 * @description Hides all of the cards.
 *
 * @method
 */
GameController.prototype.hideAllCards = function() {
  this._cards.forEach((card) => {
    card.hideCard(false);
  });
};