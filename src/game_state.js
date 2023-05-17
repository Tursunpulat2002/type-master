class Game {
    // singleton of the game
    // game stats
    gameStart = false;
    correctWords = 0;
    errorWords = 0;
    totalWords = 0;
    words = [];
    currentWord = 0;
    typedWords = 0;

    restart() {
        // function to reset game stats to default
        this.gameStart = false;
        this.correctWords = 0;
        this.errorWords = 0;
        this.totalWords = 0;
        this.words = [];
        this.currentWord = 0;
        this.typedWords = 0;
    }
}
let game = new Game(); // creating instance of game

export default game; // exporting instance of game
