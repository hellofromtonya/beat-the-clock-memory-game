"use strict";

const PlayerModel = function(config) {
    this.config = config;

    this.resetStats();
};

/**
 * @description Resets the player's model.
 *
 * @method
 */
PlayerModel.prototype.resetStats = function() {
    this._numberMoves = 0;
    this._numberMatches = 0;
    this._numberConsecutiveMatches = 0;
    this._numberConsecutiveMisses = 0;
    this._ratio = 1;
    this._numberStars = 3;
    this._haveStarsChanged = false;

    this._score = 0;
    this._level = 1;
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
 * @description Retuns the number of matches for the current game.
 *
 * @returns {Number}
 *
 * @method
 */
PlayerModel.prototype.getNumberMatches = function() {
    return this._numberMatches;
};

/**
 * @description Returns the number of matches for the current game.
 *
 * @returns {Number}
 *
 * @method
 */
PlayerModel.prototype.getNumberMoves = function() {
    return this._numberMoves;
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
    return this._numberStars;
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
 * @param {Number} gameClock Running game clock of time left on the clock
 *
 * @method
 */
PlayerModel.prototype.setMismatched = function(gameClock) {
    this._numberMoves++;
    this._numberConsecutiveMisses++;
    this._numberConsecutiveMatches = 0;

    if (this._numberConsecutiveMisses >= this.config.thresholds.consecutiveMisses) {
        this._score += this.config.scoring.consecutiveMisses;
    }

    if (this._score <= 0) {
        this._score = 0;
    }

    this.setStars(gameClock);
};

/**
 * @description Sets a card match.
 *
 * @param {Number} gameClock Running game clock of time left on the clock
 *
 * @method
 */
PlayerModel.prototype.setMatched = function(gameClock) {
    this._numberMoves++;
    this._numberMatches++;
    this._numberConsecutiveMatches++;
    this._numberConsecutiveMisses = 0;

    this._score = this.config.scoring.match;

    // Once player reaches consecutive match threshold, award the progressive points.
    if (this._numberConsecutiveMatches >= this.config.thresholds.consecutiveMatch) {
        this._score += this.config.scoring.consecutiveMatch * this._numberConsecutiveMatches;
    }

    // Once player reaches the bonus round, award the progressive bonus points.
    if (this._numberConsecutiveMatches >= this.config.thresholds.consecutiveMatchBonus) {
        this._score += this.config.scoring.consecutiveMatchBonus * (this.config.thresholds.consecutiveMatchBonus - this._numberConsecutiveMatches + 1);
    }

    this.setStars(gameClock);
};

/**
 * @description Sets the number of stars, i.e. player performance indicator.
 *
 * TODO - Integrate the time into the performance calculator.
 *
 * @param {Number} percentageTimeRemaining Running game clock of time left on the clock
 *
 * @method
 */
PlayerModel.prototype.setStars = function(percentageTimeRemaining) {
    if (this._numberMoves < 4) {
        return;
    }

    this._ratio = (this._numberMatches / this._numberMoves) * percentageTimeRemaining;

    console.log(this._ratio, this._numberMoves, percentageTimeRemaining);

    let newStars = 3;

    if (this._numberMoves < 7) {
        newStars = 2;

    } else {

        if (this._ratio >= 0.5) {
            newStars = 2;
        } else if (this._ratio >= 0.25) {
            newStars = 1;
        } else if (this._ratio < 0.25) {
            newStars = 0;
        }
    }

    this._haveStarsChanged = newStars !== this._numberStars;

    if (this._haveStarsChanged) {
        this._numberStars = newStars;
    }
};