'use strict';

/**
 * @description Game View
 *
 * @param {Object} config Runtime configuration parameters
 *
 * @constructor
 */
const View = function(config) {
  this._config = config;

  this.elements = {
    deck: document.getElementsByClassName(this._config.cardParentClassName)[0],
    moves: document.getElementsByClassName('moves')[0],
    level: document.getElementsByClassName('player-level')[0],
    score: document.getElementsByClassName('score')[0],
    gameOverModal: document.getElementById('game-over-modal'),
    timedOutModal: document.getElementById('timed-out'),
    stars: document.querySelectorAll('.stars i'),
    timeRemaining: document.getElementsByClassName('time-remaining')[0]
  };
};

/**
 * @description Reset the Game Board.
 *
 * @param {Object} playerStats Player stats
 *
 * @method
 */
View.prototype.resetGame = function(playerStats) {

  // Reset the play stats header HTML
  this.updateStars(playerStats.stars);
  this.elements.moves.innerHTML = playerStats.moves;
  this.elements.timeRemaining.innerHTML = playerStats.timeout;
  this.elements.level.innerHTML = playerStats.level;
  this.elements.score.innerHTML = playerStats.score;

  // if the modal is showing, delay before hiding to let the
  // board reset itself.
  if (this.elements.gameOverModal.classList.contains('active') ||
      this.elements.timedOutModal.classList.contains('active')) {
    window.setTimeout(this.hideModal.bind(this), 1100);
  }
};

/**
 * @description Update player's moves.
 *
 * @method
 */
View.prototype.updateMoves = function(numberMoves) {
  this.elements.moves.innerHTML = numberMoves;
};

/**
 * @description Update the player's score.
 *
 * @method
 */
View.prototype.updateScore = function(score) {
  this.elements.score.innerHTML = score;
};

/**
 * @description Show game over modal.
 *
 * @param {Object} playerStats Player stats
 *
 * @method
 */
View.prototype.showGameOver = function(playerStats) {
  const container = this.elements.gameOverModal.getElementsByClassName(this._config.gameOverModal.targetClassName)[0];

  let html = this._config.gameOverModal.messageHTML;

  for (let prop in playerStats) {
    let stat = playerStats[prop];

    // Break out of the loop once we get to the level stats.
    if (prop === 'leveledUp') {
      break;
    }

    if (prop === 'stars') {
      stat = stat === 1 ? '1 star' : `${stat} stars`;
    }

    if (prop === 'score') {
      stat = stat.toLocaleString();
    }

    html = html.replace(`%${prop}%`, stat);
  }

  // If the player is leveling up, let's add the HTML to congratulate him/her.
  if (playerStats.leveledUp === true) {
    html += this._config.gameOverModal.levelUpHTML.replace('%level%', playerStats.level);
  }

  // Update the container's HTML
  container.innerHTML = html;

  // Show the modal
  this.elements.gameOverModal.classList.add('active');
};

/**
 * @description Show time-out modal.
 *
 * @method
 */
View.prototype.showTimedOut = function() {
  this.elements.timedOutModal.classList.add('active');
};

/**
 * @description Update the player's stars.
 *
 * @method
 */
View.prototype.updateStars = function(numberStars) {
  this.elements.stars.forEach(function(star, index) {
    let toReplace = 'inactive';
    let replaceWith = 'active';

    if ((index + 1) > numberStars) {
      toReplace = 'active';
      replaceWith = 'inactive';
    }

    if (!star.classList.contains(this._config.stars[replaceWith])) {
      star.classList.remove(this._config.stars[toReplace]);
      star.classList.add(this._config.stars[replaceWith]);
    }
  }, this);

};

/**
 * @description Hide the modal(s).
 *
 * @method
 */
View.prototype.hideModal = function() {
  this.elements.gameOverModal.classList.remove('active');
  this.elements.timedOutModal.classList.remove('active');
};