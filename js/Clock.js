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
    this._timeRemaining = config.timeOut;

    this.elements = {
        timeRemaining: document.getElementsByClassName('time-remaining')[0]
    };
};

/**
 * @description Returns the game time.
 *
 * @returns {Number}
 */
GameClock.prototype.getGameTime = function() {
    return this._config.timeOut - this._timeRemaining;
};

/**
 * @description Returns the percentage of time remaining.
 *
 * @returns {Number}
 */
GameClock.prototype.getPercentTimeRemaining = function() {

    const percent = Math.ceil((this._timeRemaining / this._config.timeOut) * 100);
    console.log('getPercentTimeRemaining', this._timeRemaining, this._config.timeOut, percent);

    return percent;
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
 * @description Starts the game clock.
 *
 * @param {Number} timeOut Game's time out time
 *
 * @method
 */
GameClock.prototype.start = function(timeOut = 0) {

    timeOut = timeOut || this._config.timeOut;

    this._timeInterval = setInterval(function(){
        this._timeRemaining--;

        this.elements.timeRemaining.innerHTML = this._timeRemaining.toString();

        if (this._timeRemaining <= 0) {
            this.reset(timeOut);
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
 * @param {Number} timeOut Game's time out time
 *
 * @method
 */
GameClock.prototype.reset = function(timeOut = 0) {
    this.stop();

    timeOut = timeOut || this._config.timeOut;

    this.elements.timeRemaining.innerHTML = timeOut.toString();

    this._timeInterval = null;
};
