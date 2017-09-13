"use strict";

/**
 * @description Player's Model
 *
 * @param {Object} config Runtime configuration parameters
 *
 * @constructor
 */
const PlayerModel = function(config) {
    this._config = config;
    this._level = 1;
    this._score = 0;

    this.resetStats();
};

/**
 * @description Resets the player's model.
 *
 * @param {Boolean} hardReset When true, player is reset to level 1.
 *
 * @method
 */
PlayerModel.prototype.resetStats = function(hardReset = false) {
    this._moves = 0;
    this._matches = 0;
    this._consecutiveMatches = 0;
    this._consecutiveMisses = 0;
    this._ratio = 1;
    this._stars = 3;
    this._score = 0;
    this._haveStarsChanged = false;
    this.playing = false;

    if (hardReset === true) {
        this._level = 1;
    }

    // Leveling Up Rules
    this._levelUpRules = {
        timeout: this._config.levelUpRules.timeouts[this._level - 1],
        moves: this._config.levelUpRules.moves,
        score: this._config.levelUpRules.score,
        stars: this._config.levelUpRules.stars,
    };

    return this.tallyGameStats(0, true);
};

/**
 * @description Tallies the Player's Game Statistics
 *
 * @param {Number} gameTimeSeconds Player's game time in seconds
 * @param {Boolean} skipLevelUp When true, skips the level up checker
 * @returns {{moves: number, stars: (number|*), seconds: *, score: (number|*), levelingUp, level: number}}
 *
 * @method
 */
PlayerModel.prototype.tallyGameStats = function(gameTimeSeconds, skipLevelUp = false) {
    const canLevelUp = ! skipLevelUp ? this.canLevelUp() : false;

    if (canLevelUp) {
        this._level++;
    }

    return {
        moves: this._moves,
        stars: this._stars,
        seconds: gameTimeSeconds,
        score: this._score,
        leveledUp: canLevelUp,
        level: this._level,
        timeout: this._config.levelUpRules.timeouts[this._level - 1]
    }
};

/**
 * @description Checks if the player can level up
 *
 * @returns {Boolean}
 *
 * @method
 */
PlayerModel.prototype.canLevelUp = function() {
    return this._moves <= this._levelUpRules.moves &&
        this._score >= this._levelUpRules.score &&
        this._stars >= this._levelUpRules.stars;
};

/**
 * @description Returns the player's current level.
 *
 * @returns {Number}
 *
 * @method
 */
PlayerModel.prototype.getLevel = function() {
    return this._level;
};

/**
 * @description Returns the number of matches for the current game.
 *
 * @returns {Number}
 *
 * @method
 */
PlayerModel.prototype.getNumberMatches = function() {
    return this._matches;
};

/**
 * @description Returns the number of matches for the current game.
 *
 * @returns {Number}
 *
 * @method
 */
PlayerModel.prototype.getNumberMoves = function() {
    return this._moves;
};

/**
 * @description Returns the player's total score.
 *
 * @returns {Number}
 *
 * @method
 */
PlayerModel.prototype.getScore = function() {
    return this._score;
};

/**
 * @description Returns the number of stars.
 *              Note: Stars are indicator of performance as
 *              they measure the number of matches to moves.
 *
 * @returns {Number}
 *
 * @method
 */
PlayerModel.prototype.getStars = function() {
    return this._stars;
};

/**
 * @description Checks if stars have changed.
 *
 * @returns {Boolean}
 *
 * @method
 */
PlayerModel.prototype.haveStarsChanged = function() {
    return this._haveStarsChanged;
};

/**
 * @description Sets a card mismatch.
 *
 * @method
 */
PlayerModel.prototype.setMismatched = function() {
    this._moves++;
    this._consecutiveMisses++;
    this._consecutiveMatches = 0;

    // Once the player misses the consecutive miss threshold, deduct points.
    if (this._consecutiveMisses >= this._config.thresholds.consecutiveMisses) {
        this._score += this._config.scoring.consecutiveMisses;
    }

    if (this._score <= 0) {
        this._score = 0;
    }

    this.setStars();
};

/**
 * @description Sets a card match.
 *
 * @method
 */
PlayerModel.prototype.setMatched = function() {
    this._moves++;
    this._matches++;
    this._consecutiveMatches++;
    this._consecutiveMisses = 0;

    // Add the matching points to the player's score.
    this._score += this._config.scoring.match;

    // Once player reaches consecutive match threshold, award the progressive points.
    if (this._consecutiveMatches >= this._config.thresholds.consecutiveMatch) {
        this._score += this._config.scoring.consecutiveMatch * this._consecutiveMatches;
    }

    // Once player reaches the bonus round, award the progressive bonus points.
    if (this._consecutiveMatches >= this._config.thresholds.consecutiveMatchBonus) {
        this._score += this._config.scoring.consecutiveMatchBonus * (this._config.thresholds.consecutiveMatchBonus - this._consecutiveMatches + 1);
    }

    this.setStars();
};

/**
 * @description Sets the number of stars, i.e. player performance indicator.
 *
 * @method
 */
PlayerModel.prototype.setStars = function() {
    // Player at minimum. Bail out as there's nothing to do.
    if (this._stars === 0) {
        return;
    }

    // Reset that the stars changed.
    if (this._haveStarsChanged) {
        this._haveStarsChanged = false;
    }
    // Player is not at the next minimum moves threshold. Bail out.
    if (this._moves !== this._config.starsRules[this._stars - 1].minMoves) {
        return;
    }

    // Check if the player's score is < the required minimum.
    // If yes, decrement the stars.
    if (this._score < this._config.starsRules[this._stars - 1].minScore) {
        this._stars--;

        // Cheap notifier that is used to alert the game
        // that the star rating has changed.
        this._haveStarsChanged = true;
    }
};