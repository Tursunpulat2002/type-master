import passagesArray from "./src/passages.js";
import game from "./src/game_state.js";

let intervalID = null;

function Timer() {
    let start = Date.now();
    let counter = parseInt(document.getElementById("timer").innerHTML);
    intervalID = setInterval(function () {
        if (game.gameStart) {
            if (counter == 0) {
                document.getElementById("timer").innerHTML = "0";
                return;
            } else {
                let delta = Date.now() - start; // milliseconds elapsed since start
                let deltaInSec = Math.floor(delta / 1000); // in seconds
                document.getElementById("timer").innerHTML = 60 - deltaInSec;
                counter -= 1;
            }
        }
    }, 1000);
}

function setWords() {
    let passage = passagesArray[0].replace(/[0-9_]/gi, "").split(" ");
    game.totalWords = passage.length;
    game.words = passage;
}

function renderWords() {
    for (let i = 0; i < game.words.length; i++) {
        const spanElement = document.createElement("span");
        spanElement.setAttribute("id", i);
        spanElement.setAttribute("class", "fs-4");
        spanElement.innerHTML = game.words[i];
        document.getElementById("random-words").appendChild(spanElement);
    }
}

function derenderWords() {
    for (let i = 0; i < game.words.length; i++) {
        const item = document.getElementById(i);
        item.remove();
    }
}

function renderCorrectWord(wordID) {
    let correctWordElement = document.getElementById(wordID);
    correctWordElement.setAttribute("class", "text-success fs-4");
    game.correctWords += 1;
    game.currentWord += 1;
}

function renderErrorWord(wordID) {
    let errorWordElement = document.getElementById(wordID);
    errorWordElement.setAttribute("class", "text-danger fs-4");
    game.errorWords += 1;
    game.currentWord += 1;
}

function renderCurrentWord(wordID) {
    let currentWordElement = document.getElementById(wordID);
    currentWordElement.setAttribute("class", "bg-primary fs-4");
}

function restart() {
    game.gameStart = false;
    game.correctWords = 0;
    game.errorWords = 0;
    game.totalWords = 0;
    game.words = [];
    game.currentWord = 0;
    game.gameStart = false;
    document.getElementById("timer").innerHTML = 60;
    let inputElement = document.getElementById("main_input");
    inputElement.value = "";
    inputElement.focus();
}

function init() {
    setWords();
    renderWords();
    renderCurrentWord(game.currentWord);
}

document.getElementById("main_input").oninput = function (event) {
    if (!game.gameStart) {
        if (intervalID) {
            clearInterval(intervalID);
        }
        Timer();
        game.gameStart = true;
    }
    let lastInputChar = event.data;
    let currentInputVal = event.target.value.replace(" ", "");

    if (lastInputChar === " ") {
        event.target.value = "";
        if (currentInputVal == game.words[game.currentWord]) {
            renderCorrectWord(game.currentWord);
        } else {
            renderErrorWord(game.currentWord);
        }
        renderCurrentWord(game.currentWord);
    }
};

document.getElementById("restart").onclick = function () {
    derenderWords();
    restart();
    init();
};

window.onload = function () {
    init();
};
