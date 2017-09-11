'use strict';

/**
 * @description Card Class
 *
 * @param {Object} el Card element/selector
 * @param {String} symbol Card's symbol
 * @param {Object} config Runtime configuration
 *
 * @returns {Card} Returns the object
 *
 * @constructor
 */
const Card = function(el, symbol, config) {
    this.element = el;
    this.config = config;
    // this.icon = this.el.getElementsByClassName(config.iconClassName)[0];
    this.symbol = symbol;
};

/**
 * @description Checks if this card is already a match
 *
 * @return {Boolean} Returns true if set to 'match'; else false.
 *
 * @method
 */
Card.prototype.isMatched = function() {
    return this.element.classList.contains('match');
};

/**
 * @description Checks if this card is showing face up
 *
 * @return {Boolean} Returns true is open; else false.
 *
 * @method
 */
Card.prototype.isShowing = function() {
    return this.element.classList.contains('open');
};

/**
 * @description Flip the card to reveal the symbol.
 *
 * @method
 */
Card.prototype.showCard = function() {
    this.element.classList.add('open', 'show');
};

/**
 * @description Flip the card back to hide it.
 *
 * @method
 */
Card.prototype.hideCard = function(){
    this.element.classList.add('mismatch');

    // Delay 1sec for the animation effect to visually
    // tell the player the cards are mismatched.
    window.setTimeout(function () {

        this.element.classList.remove('open', 'show', 'mismatch');

    }.bind(this), 1000);
};

/**
 * @description Set that the card matched
 *
 * @method
 */
Card.prototype.setMatched = function(){
    this.element.classList.add('match');
};