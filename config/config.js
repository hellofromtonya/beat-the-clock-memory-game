const getGameConfig = function() {

    return {
        gameClock: {
            timeInterval: 1000,
            timeOut: 120, // 120 seconds
        },

        gameController: {
            numCards: 16,
            numMatches: 2,
        },

        card: {
            positionOnBoard: 0,
            cardClassName: 'card',
            iconClassName: 'fa',
        },

        cardSymbols: {
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
            ],
        },

        playerModel: {
            thresholds: {
                consecutiveMatch: 2,
                consecutiveMisses: 3
            },
            scoring: {
                match: 10,
                consecutiveMatch: 100,
                consecutiveMisses: -100,
            }
        },

        view: {
            cardParentClassName: 'deck',
            PLACEHOLDER: '{%symbol%}',
            cardHTML: '<li class="card">' + "\n" + '<i class="fa {%symbol%}" aria-hidden="true"></i>' + "\n" + '</li>',
            deckDimensions: {
                width: 165,
                height: 170
            },
            stars: {
                active: 'fa-star',
                inactive: 'fa-star-o'
            }

        }
    };
};