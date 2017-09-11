"use strict";

/**
 * @description Memory Game Controller
 *
 * @param {Array} config Runtime configuration parameters
 * @param {UserModel} userModel User Model object
 * @param {View} view View object
 * @param {CardSymbols} cardSymbols Card Symbols object
 *
 * @constructor
 */
const MemoryGame = function(config, userModel, view, cardSymbols) {
    this.config = config;
    this.user = userModel;
    this.view = view;
    this.cardSymbols = cardSymbols;
    this._numberCards = config.numCards;
    this._requiredMatches = config.numMatches;
    this._numberCardSets = this._numberCards / this._requiredMatches;
    this._cardsInPlay = [];
};

/**
 * @description Initialize the cards by looking up the `.card` nodes in the DOM,
 *              bind a click event, and then instantiating a new Card object.
 * @method
 */
MemoryGame.prototype.initCards = function() {
    // As there are multiple occurrences where we need to retain the
    // reference to the game's instance, we're caching the instance as
    // it'll be faster than calling .bind() over and over again.
    const game = this;
    const cardConfig = game.config.card;

    // Array of game Card objects
    this.cards = Array.from(document.querySelectorAll('.card')).map(function (el, index) {
        cardConfig.positionOnBoard = index;

        return new Card(
            el, // card element
            game.cardSymbols.symbols[index], // symbol
            cardConfig
        );
    });
};

/**
 * @description Start a new game. Handles the tasks to reset everything and
 *              shuffle the card symbols, and then update the cards.
 *
 * @method
 */
MemoryGame.prototype.startNewGame = function() {
    this._cardsInPlay = [];

    // reset the user's stats
    this.user.resetStats();

    // reset the HTML
    this.view.resetGame();

    // shuffle
    this.cardSymbols.shuffleCardSymbols(this._numberCards, this._requiredMatches);

    // build the card's HTML
    this.view.renderCards(this.cardSymbols.symbols);

    // Create the card objects and bind to DOM
    this.initCards();
};

/**
 * @description Flips the card. If there are 2 in play, then triggers
 *              the checkMatch() method.
 *
 * @param {number} index Card index, i.e. position on the board
 *
 * @method
 */
MemoryGame.prototype.flipCard = function (index) {
    let card = this.cards[index];

    if (card.isMatched() || card.isShowing()) {
        return false;
    }

    card.showCard();

    this._cardsInPlay.push(index);

    if (this._cardsInPlay.length == this._requiredMatches) {
        window.setTimeout(this.checkMatch.bind(this), 500);
    }
};

/**
 * @description Handles the card match checking tasks.
 *
 * @method
 */
MemoryGame.prototype.checkMatch = function () {
    let cardsInPlay = this._cardsInPlay;

    if (this.areMatched(cardsInPlay)) {
        this.setMatched(cardsInPlay);

    } else {
        this.setMismatched(cardsInPlay);
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
MemoryGame.prototype.areMatched = function(cardsInPlay) {
    if (cardsInPlay.length < this._requiredMatches) {
        return false;
    }

    let symbol = this.cards[cardsInPlay[0]].symbol;

    for (let index = 1; index < cardsInPlay.length; index++) {
        let cardIndex = cardsInPlay[index];

        if (symbol !== this.cards[cardIndex].symbol) {
            return false;
        }
    }

    return true;
};

/**
 * @description Handles when the cards match by updating
 *              the user's model, view, and each card as well as
 *              checking if the game is over.
 *
 * @param {Array} cardsInPlay Array of cards in play
 *
 * @method
 */
MemoryGame.prototype.setMatched = function(cardsInPlay) {
    this.user.setMatched();

    cardsInPlay.forEach(function(index){
        this.cards[index].setMatched();
    }, this);

    this.view.updateMoves(this.user.numberMoves);

    if (this.isGameOver()) {
        this.gameOver();
    }
};

/**
 * @description Handles the mismatched tasks to reset the cards and
 *              update the user's model and view.
 *
 * @param {Array} cardsInPlay Array of cards in play
 *
 * @method
 */
MemoryGame.prototype.setMismatched = function(cardsInPlay) {
    this.user.setMismatched();

    cardsInPlay.forEach(function(index){
        this.cards[index].hideCard();
    }, this);

    this.view.updateMoves(this.user.numberMoves);
};

/**
 * @description Checks if the game is over. How? By comparing the
 *              number of matches to the number of cards in the set.
 *
 * @return {bool} Returns true if all the cards are showing.
 *
 * @method
 */
MemoryGame.prototype.isGameOver = function() {
    return this.user.numberMatches >= this._numberCardSets;
};

/**
 * @description Handles the tasks for when the game is over.
 *
 * @method
 */
MemoryGame.prototype.gameOver = function() {
    this.view.showGameOver(this.user.numberMoves, this.user.numberStars);
};