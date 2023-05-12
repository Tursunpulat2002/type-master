import passagesArray from "./src/passages.js";
import game from "./src/game_state.js";

function Timer() {
    let start = Date.now();
    setInterval(function () {
        let delta = Date.now() - start; // milliseconds elapsed since start
        let deltaInSec = Math.floor(delta / 1000); // in seconds
        document.getElementById("timer").innerHTML = "0:" + (60 - deltaInSec);
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
        spanElement.innerHTML = game.words[i];
        document.getElementById("random-words").appendChild(spanElement);
    }
}

function renderCorrectWord(wordID) {
    let correctWordElement = document.getElementById(wordID);
    correctWordElement.setAttribute("class", "text-success");
    game.correctWords += 1;
    game.currentWord += 1;
}

function renderErrorWord(wordID) {
    let errorWordElement = document.getElementById(wordID);
    errorWordElement.setAttribute("class", "text-danger");
    game.errorWords += 1;
    game.currentWord += 1;
}

function renderCurrentWord(wordID) {
    let currentWordElement = document.getElementById(wordID);
    currentWordElement.setAttribute("class", "bg-primary");
}

function init() {
    setWords();
    renderWords();
    renderCurrentWord(game.currentWord);
}

document.getElementById("main_input").oninput = function (event) {
    if (!game.gameStart) {
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

window.onload = function () {
    init();
};

// window.addEventListener("load", Text());
