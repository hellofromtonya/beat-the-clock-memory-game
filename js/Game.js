"use strict";

/**
 * @description Memory Game Controller
 *
 * @param {Object} config Runtime configuration parameters
 * @param {Array} cards Array of card objects
 *
 * @constructor
 */
const GameController = function(config, cards) {
    this.config = config;
    this._cards = cards;

    this.elements = {
        body: document.getElementsByTagName('body')[0]
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
 * @param {PlayerModel} player Instance of the Player's Model
 * @param {CardSymbols} cardSymbols Instance of the Card Symbols
 * @param {View} view Instance of the View
 *
 * @method
 */
GameController.prototype.initialize = function(gameClock, player, cardSymbols, view) {
    this.gameClock = gameClock;
    this.player = player;
    this.cardSymbols = cardSymbols;
    this.view = view;
};

/**
 * @description Register event listeners.
 *              We have one event listener that monitors for click events
 *              and then routes the right events to their task.
 *
 * @method
 */
GameController.prototype.registerEventListeners = function() {

    this.elements.body.addEventListener('click', function(event){
        event.stopPropagation();

        // Bail out as these are not game clicks.
        if (event.target === event.currentTarget ||
            ! event.target.matches('.game-control, I, .card, button')) {
            return false;
        }

        // A game control was clicked.
        if (event.target.classList.contains('game-control') ||
            event.target.nodeName == 'I' && event.target.parentNode.classListcontains('game-control') ) {

            const el = event.target.nodeName == 'I'
                ? event.target.parentNode
                : event.target;

            if (el.hasAttribute('data-section-id')) {
                this.loadSection(el.getAttribute('data-section-id'));

            // Call the method.
            } else if ( el.hasAttribute('data-control')) {
                this[el.getAttribute('data-control')]();
            }

            return false;
        }

        // A card was clicked.
        if (event.target.classList.contains('card') && ! event.target.classList.contains('match')) {
            const index = Array.from(event.target.parentNode.children).indexOf(event.target);

            if (! this.gameClock.isRunning()) {
                this.gameClock.start();
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
    this.gameClock.reset();

    this._cardsInPlay = [];

    this.player.resetStats();

    this.view.resetGame();

    // shuffle
    this.cardSymbols.shuffleCardSymbols(this._numberCards, this._requiredMatches);

    // Update symbol cards.
    this._cards.forEach(function(card, index){
        card.setSymbol( this.cardSymbols.symbols[index] );
    }, this);
};

GameController.prototype.pauseGame = function() {
    console.log('pausing the game');

    // TODO - Add code to pause game.
};

/**
 * @description Start a new game. Handles the tasks to reset everything and
 *              shuffle the card symbols, and then update the cards.
 *
 * @method
 */
GameController.prototype.resumeGame = function() {
    this.startNewGame();
};

GameController.prototype.loadSection = function(sectionID) {
    console.log('loading ' + sectionID);

    // TODO - Add code to load the new section.
};


/************************
 * Game Handlers
 ***********************/

/**
 * @description Flips the card. If there are 2 in play, then triggers
 *              the checkMatch() method.
 *
 * @param {number} index Card index, i.e. position on the board
 *
 * @method
 */
GameController.prototype.flipCard = function (index) {
    const card = this._cards[index];

    if (card.isMatched() || card.isShowing()) {
        return false;
    }

    card.showCard();

    this._cardsInPlay.push(index);

    if (this._cardsInPlay.length === this._requiredMatches) {
        window.setTimeout(this.checkMatch.bind(this), 500);
    }
};

/**
 * @description Handles the card match checking tasks.
 *
 * @method
 */
GameController.prototype.checkMatch = function () {
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

    let symbol = this._cards[cardsInPlay[0]].getSymbol();

    for (let index = 1; index < cardsInPlay.length; index++) {
        let cardIndex = cardsInPlay[index];

        if (symbol !== this._cards[cardIndex].getSymbol()) {
            return false;
        }
    }

    return true;
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
    this.player.setMatched(this.gameClock.getTimeRemaining());

    cardsInPlay.forEach(function(index){
        this._cards[index].setMatched();
    }, this);
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
    this.player.setMismatched(this.gameClock.getTimeRemaining());

    cardsInPlay.forEach(function(index){
        this._cards[index].hideCard();
    }, this);
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

    this.view.showGameOver(this.player.getNumberMatches(), this.player.getStars(), this.gameClock.getGameTime());

    // hide all cards
    this.cards.forEach(function(index){
        this._cards[index].hideCard(false);
    }, this);
};

/**
 * @description Game time out handler.
 *
 * @method
 */
GameController.prototype.timeOut = function() {
    this.view.showTimedOut();

    // hide all cards
    this.cards.forEach(function(index){
        this._cards[index].hideCard(false);
    }, this);
};