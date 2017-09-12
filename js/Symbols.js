"use strict";

/**
 * @description Card Symbols Handler
 *
 * @param {Object} config Runtime configuration parameters
 *
 * @constructor
 */
const CardSymbols = function(config) {
    this.config = config;
    this.symbols = [];
};

/**
 * @description Shuffles the cards.  Plucks the symbols from the configuration,
 *              duplicates them, and then shuffles them to generate a new game.
 *
 * @param {Number} numberCards Number of cards to generate and shuffle
 * @return {Array} Array of shuffled card symbols
 *
 * @method
 */
CardSymbols.prototype.shuffleCardSymbols = function(numberCards = 16, numberMatches = 2) {
    // Step 1: Generate a new set of symbols
    const currentSymbols = this.buildSymbolsSet(numberCards, numberMatches);

    // Step 2: Let's shuffle our symbols set
    this.symbols = this.shuffle(currentSymbols);

    return this.symbols;
};

/**
 * @description Get a new symbols set.  A unique set of symbols is repeated in the
 *              set based upon the number of matches required.
 *
 * @param {Number} setSize Total number of symbols to be generated
 * @param {Number} uniqueSetMultipler Indicates how many times to duplicate the unique set
 * @return {Array} Array of symbols
 *
 * @method
 */
CardSymbols.prototype.buildSymbolsSet = function(setSize, uniqueSetMultipler = 2) {
    const uniqueSymbols = this.getUniqueSetOfSymbols(setSize / uniqueSetMultipler);

    // We know that we want at least the unique symbols set.
    let symbolsSet = uniqueSymbols;

    /**
     * Next, add another set to our final set as many times as requested.
     *
     * For example, if the request is for a set that contains the 3 sets of
     * matching symbols, then this loop runs 2 times.
     */
    for (let i = 1; i < uniqueSetMultipler; i++) {
        symbolsSet = symbolsSet.concat(uniqueSymbols);
    }

    return symbolsSet;
};

/**
 * @description Get a unique set of non-repeating symbols
 *
 * @param {Number} numberSymbols Number of symbols to return
 * @returns {Array} Returns a unique set of symbols
 *
 * @method
 */
CardSymbols.prototype.getUniqueSetOfSymbols = function(numberSymbols) {
    this.shuffle(this.config.symbols);

    return this.config.symbols.slice(0, numberSymbols);
};


/**
 * @description Shuffle the given array
 *
 * Credit: Shuffle function from http://stackoverflow.com/a/2450976
 *
 * @param {Array} array Collection to be shuffled
 * @returns {Array} Returns a shuffled array
 *
 * @method
 */
CardSymbols.prototype.shuffle = function(array){
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};