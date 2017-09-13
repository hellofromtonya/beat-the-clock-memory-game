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
            match: 10,
            consecutiveMatch: 100,
            consecutiveMisses: -100,
            consecutiveMatchBonus: 1000
        },
        levelUpRules: {
            timeouts: config.gameClock.timeOuts,
            score: 1000,
            stars: 2,
            gameTimeOffset: 0.80 // 80% of the timeout clock
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
