class Game {
    gameStart = false;
    correctWords = 0;
    errorWords = 0;
    totalWords = 0;
    words = [];
    currentWord = 0;

    restart() {
        this.gameStart = false;
        this.correctWords = 0;
        this.errorWords = 0;
        this.totalWords = 0;
        this.words = [];
        this.currentWord = 0;
    }
}
let game = new Game();

export default game;
