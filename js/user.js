"use strict";

const UserModel = function() {
    this.resetStats();
};

UserModel.prototype.resetStats = function() {
    this.numberMoves = 0;
    this.numberMatches = 0;
    this.numberConsecutiveMisses = 0;
    this.numberStars = 0;
};

UserModel.prototype.setMismatched = function() {
    this.numberMoves++;
    this.numberConsecutiveMisses++;
};

UserModel.prototype.setMatched = function() {
    this.numberMoves++;
    this.numberMatches++;

    this.numberConsecutiveMisses = 0;
};