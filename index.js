import passagesArray from "./src/passages.js";
import game from "./src/game_state.js";

// Id variable for setInterval function so we can stop the timer before making a new one
let intervalID = null;

// Function to countdown from 60
function Timer() {
    let start = Date.now(); // get the current time
    let counter = parseInt(document.getElementById("timer").innerHTML); // get the timer from html
    intervalID = setInterval(function () {
        // call and save setInterval
        if (game.gameStart) {
            // decrement timer if gameStart = true
            if (counter == 0) {
                // stop decrementing if the timer hits 0
                document.getElementById("timer").innerHTML = "0";
                return;
            } else {
                // decrement the timer
                let delta = Date.now() - start; // milliseconds elapsed since start
                let deltaInSec = Math.floor(delta / 1000); // in seconds
                document.getElementById("timer").innerHTML = 60 - deltaInSec;
                counter -= 1;
            }
        }
    }, 1000); // run the function every 1 second
}

// get the passage from passages.js
function setWords() {
    let passage = passagesArray[0].replace(/[0-9_]/gi, "").split(" "); // get rid of any numbers
    game.totalWords = passage.length; // set the total words in the game
    game.words = passage; // save the wordbank
}

// render word bank on the screen
function renderWords() {
    for (let i = 0; i < game.words.length; i++) {
        // loop through the word bank
        const spanElement = document.createElement("span"); // create span element to hold every word
        spanElement.setAttribute("id", i); // give id for every word
        spanElement.setAttribute("class", "fs-4 px-2"); // give it good size
        spanElement.innerHTML = game.words[i]; // set the word
        document.getElementById("random-words").appendChild(spanElement); // add the element with the word to html
    }
}

// get rid of the rendered words
function derenderWords() {
    for (let i = 0; i < game.words.length; i++) {
        const item = document.getElementById(i); // get the words by id
        item.remove(); // remove the words from html
    }
}

// after word has been input and it is correct change the color in the word bank
function renderCorrectWord(wordID) {
    let correctWordElement = document.getElementById(wordID);
    correctWordElement.setAttribute("class", "text-success fs-4 px-2");
    game.correctWords += 1; // increment the number of correct words
    game.currentWord += 1; // move the word bank index by 1
}

// after a word has been input and it is wrong change the color in the word bank
function renderErrorWord(wordID) {
    let errorWordElement = document.getElementById(wordID);
    errorWordElement.setAttribute("class", "text-danger fs-4 px-2");
    game.errorWords += 1; // increment the number of wrond words
    game.currentWord += 1; // move the word bank index by 1
}

// render the current word in the word bank with a blue background so it stands out
function renderCurrentWord(wordID) {
    let currentWordElement = document.getElementById(wordID);
    currentWordElement.setAttribute("class", "bg-primary-subtle fs-4 rounded-pill px-2");
    currentWordElement.scrollIntoView({ behavior: "instant", block: "center" });
}

// reset the values of the game, timer, and input field
function restart() {
    game.restart();
    document.getElementById("timer").innerHTML = 60;
    let inputElement = document.getElementById("main_input");
    inputElement.value = "";
    inputElement.focus();
}

// makes sure to disable scroll wheel inside word bank
function mouseHandler(e) {
    e.preventDefault();
    e.stopPropagation();
}

// initialize the game
function init() {
    setWords();
    renderWords();
    renderCurrentWord(game.currentWord);
    document.getElementById("random-words").addEventListener("mousewheel", mouseHandler, false);
}

// run when anything is input in the input field
document.getElementById("main_input").oninput = function (event) {
    if (!game.gameStart) {
        // if the game hasn't started
        if (intervalID) {
            // clear the previous timer
            clearInterval(intervalID);
        }
        Timer(); // create new timer and start it
        game.gameStart = true; // set the game to start
    }
    let lastInputChar = event.data; // get last input character
    let currentInputVal = event.target.value.replace(" ", ""); // delete the space after typed word is submitted

    if (lastInputChar === " ") {
        // if the typed word is submitted
        event.target.value = ""; // clear the input field
        if (currentInputVal == game.words[game.currentWord]) {
            // if the input word is correct
            renderCorrectWord(game.currentWord); // render the word in the word bank green
        } else {
            renderErrorWord(game.currentWord); // else render it red
        }
        renderCurrentWord(game.currentWord); // render the next word in the word bank
    }
};

// run when restart button is clicked
document.getElementById("restart").onclick = function () {
    derenderWords(); // get rid of the old word bank
    restart(); // reset values
    init(); // initialize new game
};

// initalize new game when the website first loads
window.onload = function () {
    init();
};
