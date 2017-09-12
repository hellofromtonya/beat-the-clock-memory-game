'use strict';

/**
 * @description Card Class
 *
 * @param {Object} el Card element/selector
 * @param {Object} config Runtime configuration
 *
 * @returns {Card} Returns the object
 *
 * @constructor
 */
const Card = function(el, config) {
    this.elements = {
        card: el,
        icon: el.getElementsByClassName(config.iconClassName)[0]
    };
    this.config = config;
    this._symbol = this.elements.icon.classList[1];
};

/**
 * @description Checks if this card is already a match
 *
 * @return {Boolean} Returns true if set to 'match'; else false.
 *
 * @method
 */
Card.prototype.isMatched = function() {
    return this.elements.card.classList.contains('match');
};

/**
 * @description Checks if this card is showing face up
 *
 * @return {Boolean} Returns true is open; else false.
 *
 * @method
 */
Card.prototype.isShowing = function() {
    return this.elements.card.classList.contains('open');
};

/**
 * @description Get the current symbol
 *
 * @returns {String}
 *
 * @function
 */
Card.prototype.getSymbol = function() {
    return this._symbol;
};

/**
 *
 * @param {String} symbol New symbol
 */
Card.prototype.setSymbol = function(symbol) {
    const currentSymbol = this._symbol;
    this._symbol = symbol;

    this.elements.icon.classList.replace(currentSymbol, symbol);

    this.resetCardClassName();
};

/**
 * @description Flip the card to reveal the symbol.
 *
 * @method
 */
Card.prototype.showCard = function() {
    this.elements.card.classList.add('open', 'show');
};

/**
 * @description Flip the card back to hide it.
 *
 * @param {Boolean} animateHide When true, card is animated for the player.
 *                  Default is true.
 *
 * @method
 */
Card.prototype.hideCard = function(animateHide = true){
    if (! animateHide) {
        this.resetCardClassName();
        return;
    }

    this.elements.card.classList.add('mismatch');

    // Delay 1sec for the animation effect to visually
    // tell the player the cards are mismatched.
    window.setTimeout(function () {
        this.resetCardClassName();
    }.bind(this), 1000);
};

/**
 * @description Reset card element's class name.
 *
 * @method
 */
Card.prototype.resetCardClassName = function() {
    this.elements.card.classList.remove('match', 'mismatch', 'open', 'show');
};

/**
 * @description Set that the card matched
 *
 * @method
 */
Card.prototype.setMatched = function(){
    this.elements.card.classList.add('match');
};