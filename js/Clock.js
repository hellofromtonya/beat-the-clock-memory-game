"use strict";

/**
 * @description Memory Game Controller
 *
 * @param {Object} config Runtime configuration parameters
 * @param {GameController} Controller Instance of the Game Controller
 *
 * @constructor
 */
const GameClock = function(config, Controller) {
    this._config = config;
    this.controller = Controller;
    this._timeInterval = null;
    this.setTimeouts(1);

    this.elements = {
        timeRemaining: document.getElementsByClassName('time-remaining')[0]
    };
};

/**
 * @description Returns the actual game time in seconds,
 *              i.e. Allowable time - time remaining.
 *
 * @returns {Number}
 */
GameClock.prototype.getActualTime = function() {
    return this._allowableTime - this._timeRemaining;
};

/**
 * @description Returns the percentage of time remaining.
 *
 * @returns {Number}
 */
GameClock.prototype.getPercentTimeRemaining = function() {
    return Math.ceil((this._timeRemaining / this._allowableTime) * 100);
};

/**
 * @description Returns the time remaining on the game clock.
 *
 * @returns {Number}
 */
GameClock.prototype.getTimeRemaining = function() {
    return this._timeRemaining;
};

/**
 * @description Checks if the game clock is running.
 *
 * @returns {Boolean}
 */
GameClock.prototype.isRunning = function() {
    return this._timeInterval !== null;
};

/**
 * @description Get the starting clock's timeout.
 *
 * @param {Number} playerLevel Player's current level: 1-10
 *
 * @return {Number}
 *
 * @method
 */
GameClock.prototype.setTimeouts = function(playerLevel = 1) {
    this._allowableTime = this._config.timeOuts[playerLevel - 1];
    this._timeRemaining = this._allowableTime;
};

/**
 * @description Starts the game clock.
 *
 * @param {Number} playerLevel Player's current level: 1-10
 *
 * @method
 */
GameClock.prototype.start = function(playerLevel = 1) {
    this.setTimeouts(playerLevel);

    this._timeInterval = setInterval(function(){
        this._timeRemaining--;

        this.elements.timeRemaining.innerHTML = this._timeRemaining.toString();

        if (this._timeRemaining <= 0) {
            this.reset(playerLevel);
            this.controller.timeOut();
        }

    }.bind(this), 1000);
};

/**
 * @description Stops the game clock.
 *
 * @method
 */
GameClock.prototype.stop = function() {
    clearInterval(this._timeInterval);
};

/**
 * @description Resets the game clock.
 *
 * @param {Number} playerLevel Player's current level: 1-10
 *
 * @method
 */
GameClock.prototype.reset = function(playerLevel = 1) {
    this.stop();

    this.setTimeouts(playerLevel);

    this.elements.timeRemaining.innerHTML = this._allowableTime.toString();

    this._timeInterval = null;
};