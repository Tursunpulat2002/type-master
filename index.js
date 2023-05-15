import passagesArray from "./src/passages.js";
import game from "./src/game_state.js";

// Id variable for setInterval function so we can stop the timer before making a new one
let intervalID = null;

// Function to countdown from 60
function Timer() {
    let start = Date.now(); // get the current time
    let counter = parseInt(document.getElementById("timer").innerHTML); // get the timer from html
    let prevTotalWords = 0;
    intervalID = setInterval(function () {
        // call and save setInterval
        if (game.gameStart) {
            // decrement timer if gameStart = true
            if (counter == 0) {
                // stop decrementing if the timer hits 0
                document.getElementById("timer").innerHTML = "0";
                document.getElementById("main_input").disabled = true;
                document.getElementById("wpm").innerHTML = game.correctWords;
                game.gameStart = false;
            } else {
                // decrement the timer
                let delta = Date.now() - start; // milliseconds elapsed since start
                let deltaInSec = Math.floor(delta / 1000); // in seconds
                document.getElementById("timer").innerHTML = 60 - deltaInSec;
                counter -= 1;

                // calculate words per minute
                let _wpm = parseInt(game.correctWords / (deltaInSec / 60));
                let wpm = ("000" + _wpm).slice(-3);
                document.getElementById("wpm").innerHTML = wpm;
            }
        } else {
            return;
        }
    }, 1000); // run the function every 1 second
}

// get the passage from passages.js
function setWords() {
    let passage = [];
    let _passage = "";
    // If the passagesArray is empty or null set to default
    if (!passagesArray || passagesArray.length === 0 || !passagesArray[0] || passagesArray[0].length === 0) {
        _passage =
            "It looks like the program failed to load the text. Try refreshing the website. If not here is an example passage you can type.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    } else {
        _passage = passagesArray[0].replace(/[0-9_]/gi, ""); // get rid of any numbers
    }
    passage = _passage.split(" "); // breaking the passage into seperate words and saving into an array
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
        // If the last word in the word bank is entered disable the input field
        if (game.currentWord === game.words.length - 1) {
            document.getElementById("main_input").disabled = true;
        }
        // if the typed word is submitted
        event.target.value = ""; // clear the input field
        if (currentInputVal == game.words[game.currentWord]) {
            // if the input word is correct
            renderCorrectWord(game.currentWord); // render the word in the word bank green
        } else {
            renderErrorWord(game.currentWord); // else render it red
        }
        renderCurrentWord(game.currentWord); // render the next word in the word bank
        game.typedWords += 1; // needed for wpm
        // update accuracy stat data
        if (game.typedWords > 0) {
            document.getElementById("progress-bar-container").setAttribute("class", "progress bg-danger");
        }
        document.getElementById("total-words").innerHTML = game.typedWords + " words";
        document.getElementById("correct-words").innerHTML = game.correctWords;
        document.getElementById("error-words").innerHTML = game.errorWords;
        let percentCorrect = parseInt((game.correctWords / game.typedWords) * 100) + "%";
        document.getElementById("percent-correct").innerHTML = percentCorrect;
        document.getElementById("progress-bar-percent").setAttribute("style", "width: " + percentCorrect);
    }
};

// run when restart button is clicked
document.getElementById("restart").onclick = function () {
    derenderWords(); // get rid of the old word bank
    restart(); // reset values
    init(); // initialize new game
    document.getElementById("main_input").disabled = false;
    document.getElementById("wpm").innerHTML = "000";
    document.getElementById("total-words").innerHTML = "0 words";
    document.getElementById("correct-words").innerHTML = "0";
    document.getElementById("error-words").innerHTML = "0";
    document.getElementById("percent-correct").innerHTML = "0%";
    document.getElementById("progress-bar-percent").setAttribute("style", "width: 0%");
    document.getElementById("progress-bar-container").setAttribute("class", "progress");
};

// initalize new game when the website first loads
window.onload = function () {
    init();
};
