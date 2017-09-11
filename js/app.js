'use strict';

const GameApp = function(config) {
    this.config = config;

    this.elements = {
        body: document.getElementsByTagName('body')[0],
        timeRemaining: document.getElementsByClassName('time-remaining')[0]
    };

    this.view = new View(this.config.view);
    this.user = new UserModel();

    this._gameTimer = {
        timeInterval: null,
        timeRemaining: this.config.gameControls.timeOut
    };

};

/**
 * @description Register event listeners.
 *              We have one event listener that monitors for click events
 *              and then routes the right events to their task.
 *
 * @method
 */
GameApp.prototype.registerEventListeners = function() {

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

            if (this._gameTimer.timeInterval == null) {
                this.initGameClock();
            }

            this.gameController.flipCard(index);

            return false;
        }


    }.bind(this), false);

};

GameApp.prototype.initGameClock = function() {
    this.elements.timeRemaining.innerHTML = this.config.gameControls.timeOut.toString();

    this._gameTimer.timeInterval = setInterval(function(){
        this._gameTimer.timeRemaining--;

        this.elements.timeRemaining.innerHTML = this._gameTimer.timeRemaining.toString();

        if (this._gameTimer.timeRemaining <= 0) {
            clearInterval(this._gameTimer.timeInterval);

            this.gameTimedOut();
        }

    }.bind(this), 1000);

    // setTimeout(function() {
    //     clearInterval(this._gameTimer.timerCallback);
    //     this._gameTimer.timerCallback = null;
    // }, this.config.gameControls.timeOut);
};

GameApp.prototype.loadSection = function(sectionID) {
    console.log('loading ' + sectionID);
};

GameApp.prototype.pauseGame = function() {
    console.log('pausing the game');


};

GameApp.prototype.resumeGame = function() {
    this.startNewGame();
};

GameApp.prototype.startNewGame = function() {
    this.gameController = new MemoryGame(
        this.config.gameController,
        this.user,
        this.view,
        new CardSymbols(this.config.cardSymbols)
    );

    this.gameController.startNewGame();
};

GameApp.prototype.gameTimedOut = function() {
    this.view.showTimedOut();
};

const gameApp = new GameApp(getGameConfig());
gameApp.registerEventListeners();
gameApp.startNewGame();
