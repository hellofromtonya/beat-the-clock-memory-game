const getGameConfig = function() {

    const config = {};

    config.gameClock = {
        timeInterval: 1000,
        timeOuts: [120, 100, 80, 70, 60, 50, 40, 30, 20, 20]
    };

    config.gameController = {
        numCards: 16,
        numMatches: 2
    };

    config.card = {
        positionOnBoard: 0,
        cardClassName: 'card',
        iconClassName: 'fa'
    };

    config.cardSymbols = {
        symbols: [
            'fa-anchor',
            'fa-rocket',
            'fa-bicycle',
            'fa-bolt',
            'fa-bomb',
            'fa-bug',
            'fa-coffee',
            'fa-cube',
            'fa-dashboard',
            'fa-diamond',
            'fa-eye',
            'fa-laptop',
            'fa-fire-extinguisher',
            'fa-flask',
            'fa-gavel',
            'fa-heart',
            'fa-home',
            'fa-hourglass',
            'fa-leaf',
            'fa-lock',
            'fa-motorcycle',
            'fa-paper-plane-o',
            'fa-plug',
            'fa-bank',
            'fa-plane',
            'fa-ship',
            'fa-umbrella',
            'fa-space-shuttle',
            'fa-eye-slash',
            'fa-heart-o',
            'fa-flag-checkered',
            'fa-hourglass-half',
            'fa-cubes',
        ]
    };

    config.playerModel = {
        thresholds: {
            consecutiveMatch: 2,
            consecutiveMisses: 3,
            consecutiveMatchBonus: 3
        },
        scoring: {
            match: 100,
            consecutiveMatch: 1000,
            consecutiveMisses: -1000,
            consecutiveMatchBonus: 10000
        },
        starsRules: [
            // 1 star minimum
            {
                minMoves: 21,
                minScore: 4800,
            },
            // 2 stars minimum
            {
                minMoves: 17,
                minScore: 4800,
            },
            // 3 stars minimum
            {
                minMoves: 13,
                minScore: 20000,
            }
        ],
        levelUpRules: {
            timeouts: config.gameClock.timeOuts,
            minMoves: 8, // Won the game in at least 8 moves, i.e. to ensure s/he played.

            // if the play won with these stats, then level up:
            moves: 13,
            score: 20000,
            stars: 3
        }
    };

    config.view = {
        cardParentClassName: 'deck',
        deckDimensions: {
            width: 165,
            height: 170
        },
        stars: {
            active: 'fa-star',
            inactive: 'fa-star-o'
        },
        gameOverModal: {
            targetClassName: 'modal-messages',
            messageHTML: '<p class="modal-results">You did it in %seconds% seconds and %moves% moves.  You earned %stars% and %score% points.</p>',
            levelUpHTML: '<p class="modal-levelup">WooHoo! You just leveled up to Level %level%!</p><div class="rising-notification"><i class="fa fa-star"></i></div>'
        }
    };

    return config;
};
