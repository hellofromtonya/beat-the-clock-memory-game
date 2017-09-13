# Beat the Clock Memory Game

This game tests your memory and challenges you to match the cards in as few moves as possible before the game clock runs out.

You can play the game in your browser by [clicking here](https://rawgit.com/hellofromtonya/beat-the-clock-memory-game/master/index.html).

## How to Play

[Click here](https://rawgit.com/hellofromtonya/beat-the-clock-memory-game/master/index.html) to load the game into your browser.

The key to the game is to remember the card symbols and match the pairs in as few tries (moves) as possible.

Do the following:

- The player flips one card over to reveal its underlying symbol.
- The player then turns over a second card, trying to find the corresponding card with the same symbol.
    - If the cards match, both cards stay flipped over.
    - If the cards do not match, both cards are flipped face down.
- Repeat until all cards are matched or the clock runs out.

## Game Overview

The game consists of a deck with 8 matching pairs of cards, i.e. for a total of 16 cards.  At the start of a new game, the following happens:

- Player statistics are reset, except for the level.
- The Card Symbols array is shuffled, i.e. to add more variation between games.
- 8 card symbols are selected and then doubled.
- The new deck is shuffled.
- Each card's symbol is updated in its respective `card` object.

Once the player clicks on a card, the game clock starts counting down in seconds.  During play, the player selects a pair of cards.  The game checks if the pair's symbols match. 

- If yes, the following happens:
    - the cards are animated to visually alert the player of the match
    - points are awarded
    - the cards remain face up
    
- If no, the following happens:
    - the cards are animated to visually alert the player of the mismatch
    - points may be deducted for consecutive misses
    - cards turned face down again
    - a star may be removed
    
### Scoring

The game scores based upon the player's performance. Score is managed in the `PlayerModel` and is configurable.

- The player wins points when:
    - Matching a pair of cards awards 100 points
    - Matching consecutive pairs of cards awards 1000 x the number of consecutive matches (progressive scoring)

- When the player has 3 or more consecutive matches, a 10,000 point bonus is awarded.
- When missing 3 consecutive times, the player loses 1,000 points.

### How to Level Up

There are multiple levels in this game.  A player can level when:

- wins the game before the clock times out
- wins with no more than the required number of moves
- achieves the minimum score
- wins with the required number of stars

All of the above are configurable.

## Credits

- CSS keyframes and animation are from [animate.css](https://github.com/daneden/animate.css) by [Daniel Eden](https://github.com/daneden)

## Disclaimer

This repository is for the Memory Match Game Project, which is part of the [Udacity Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program.

This repository is not for general use, but rather an exercise as part of an education program.

Cheers and &lt;happy coding&gt;,    
Tonya