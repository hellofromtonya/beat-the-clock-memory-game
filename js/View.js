"use strict";

/**
 * @description Game View
 *
 * @param {Object} config Runtime configuration parameters
 *
 * @constructor
 */
const View = function(config) {
    this.config = config;

    this.elements = {
        body: document.getElementsByTagName('body')[0],
        deck: document.getElementsByClassName(this.config.cardParentClassName)[0],
        moves: document.getElementsByClassName('moves')[0],
        score: document.getElementsByClassName('score')[0],
        gameOverModal: document.getElementById('game-over-modal'),
        timedOutModal: document.getElementById('timed-out'),
        stars: document.querySelectorAll('.stars li'),
        gameSetup: document.getElementById('game-setup-sidebar')
    };
};

/**
 * @description Reset the Game Board.
 *
 * @method
 */
View.prototype.resetGame = function() {
    this.elements.moves.innerHTML = '0';
    this.updateStars(3);

    // if the modal is showing, delay before hiding to let the
    // board reset itself.
    if (this.elements.gameOverModal.classList.contains('active') ||
        this.elements.timedOutModal.classList.contains('active')) {
        window.setTimeout(this.hideModal.bind(this), 1100);
    }
};

View.prototype.updateMoves = function(numberMoves) {
    this.elements.moves.innerHTML = numberMoves;
};

View.prototype.updateScore = function(score) {
    this.elements.score.innerHTML = score;
};

View.prototype.showGameOver = function (numberMoves = 0, numberStars = 3, gameTime = 0) {
    const movesEl = this.elements.gameOverModal.getElementsByClassName('modal-number-moves')[0];
    const starEl = this.elements.gameOverModal.getElementsByClassName('modal-number-stars')[0];
    const gameTimeEl = this.elements.gameOverModal.getElementsByClassName('modal-game-time')[0];

    movesEl.innerHTML = numberMoves;
    starEl.innerHTML = numberStars == 1 ? '1 star' : `${numberStars} stars`;
    gameTimeEl.innerHTML = gameTime;

    // Show the modal
    this.elements.gameOverModal.classList.add('active');
};

View.prototype.showTimedOut = function () {
    this.elements.timedOutModal.classList.add('active');
};

View.prototype.updateStars = function(numberStars) {
    this.elements.stars.forEach(function(star, index){
        let methodName = index < numberStars ? 'remove' : 'add';

        star.classList[methodName]('hide');
    });

};

View.prototype.hideModal = function() {
    this.elements.gameOverModal.classList.remove('active');
    this.elements.timedOutModal.classList.remove('active');
};

View.prototype.renderCards = function(symbols){
    let html = '';

    symbols.forEach(function (symbol) {
        html += this.config.cardHTML.replace(this.config.PLACEHOLDER, symbol);

    }, this);

    this.elements.deck.innerHTML = html;

    this.elements.body.classList.add('playing');
};
