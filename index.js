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
}

function renderErrorWord(wordID) {
    let errorWordElement = document.getElementById(wordID);
    errorWordElement.setAttribute("class", "text-danger");
}

function renderCurrentWord(wordID) {
    let currentWordElement = document.getElementById(wordID);
    currentWordElement.setAttribute("class", "bg-primary");
}

function main() {
    setWords();
    renderWords();
    renderCurrentWord(0);
    document.getElementById("main_input").oninput = function (event) {
        if (!game.gameStart) {
            Timer();
            game.gameStart = true;
        }
        let currentVal = event.data;
        let totalVal = event.target.value;
        if (currentVal === " ") {
            console.log(totalVal);
            event.target.value = "";
        }
    };
}

window.onload = function () {
    main();
};

// window.addEventListener("load", Text());
