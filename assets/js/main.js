// Fetch JSON data from file:
// Source for fetch() method: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_api_fetch
let allTracks;
fetch("assets/json/music-library.json")
  .then((response) => response.json())
  .then((data) => {
    allTracks = data;
    console.log(allTracks);
  });

// Wait for DOM content to load, then start the game
document.addEventListener("DOMContentLoaded", function () {
  // Start tutorial if the game is run for the first time. Check in localStorage if tutorial has been completed before.
  // Local storage functionality from https://www.w3schools.com/html/html5_webstorage.asp
  if (!localStorage.getItem("tutorialCompleted")) {
    startTutorial();
    localStorage.setItem("tutorialCompleted", "true");
  } else {
    newGame();
  }
});

/**
 * Display a popup containing the tutorial.
 */
function startTutorial() {
  // TODO: Display tutorial
  newGame();
}

/**
 * Function to start a new game and initialize the game data.
 */
function newGame() {
  let gameData = {
    round: 1,
    score: 0,
    lives: 3,
    playedTracks: [],
    difficulty: 0,
  };
  selectLevel(gameData);
}

/**
 * Prompt user to select a level and set the initial difficulty
 * accordingly. Calls the newRound function with the adjusted
 * difficulty setting
 */
function selectLevel(gameData) {
  // Set contents for popup area:
  let levels = ["Beginner", "Intermediate", "Advanced"];
  let title = "Choose your level";
  let body = `
    <ul class="select-level">
      <li class="level-list-item">${levels[0]}</li>
      <li class="level-list-item">${levels[1]}</li>
      <li class="level-list-item">${levels[2]}</li>
    </ul>
    <button id="confirm-level-button" disabled>Confirm</button>
    `;

  showPopup(title, body);

  // Add event listeners to the level list items and to the confirm button:
  let button = document.getElementById("confirm-level-button");
  let items = document.getElementsByClassName("level-list-item");

  for (let item of items) {
    item.addEventListener("click", function () {
      this.classList.add("selected-item");
      let level = this.textContent;
      gameData.level = level;
      // Set initial difficulty according to selected level:
      gameData.difficulty = level === levels[2] ? 20 : level === levels[1] ? 10 : 0;
      button.disabled = false;
      console.log("Difficulty set to: " + gameData.difficulty);
      button.addEventListener("click", function () {
        hidePopup();
        newRound(gameData);
      });
    });
  }
}

function newRound(gameData) {
  console.log("New Round started with the following difficulty: " + gameData.difficulty);
  if (gameData.round === 1) {
    // Set contents for popup area:
    let title = "Round 1";
    let body = `
      <p>Level: ${gameData.level}</p>
      <p>Ready?</p>
      <button id="start-first-round-button">Start Game</button>
    `;

    showPopup(title, body);

    let button = document.getElementById("start-first-round-button");
    button.addEventListener("click", function () {
      hidePopup();
      let track = selectTrack(gameData);
      setupTask(gameData, track);
      playTrack(gameData, track);
      countdownTimer(gameData, track);
    });
  }
}

/**
 * Show the popup area and set its content according
 * to the given parameters.
 */
function showPopup(title, body) {
  // Show popup area and display popup title and body.
  let popupArea = document.getElementById("popup-area");
  let popupTitle = document.getElementById("popup-title");
  let popupBody = document.getElementById("popup-body");
  popupArea.style.display = "block";
  popupTitle.textContent = title;
  popupBody.innerHTML = body;
}

/**
 * Hide popup area
 */
function hidePopup() {
  let popupArea = document.getElementById("popup-area");
  popupArea.style.display = "none";
}

function selectTrack(gameData) {
  console.log("Function: selectTrack");
  // Randomly choose an item from the JSON file according to the difficulty values and add the item to the playedPieces array.
}

function setupTask() {
  console.log("Function: setupTask");
  // Display the correct instruments randomly mixed with wrong instruments in the options area as list items
  // Display the amount of instruments in the total items span
  // Add EventListeners to the list items calling the selectInstrument function.
  // Return the item selected from the JSON file.
}

function playTrack() {
  console.log("Function: playTrack");
  // Play the adio file specified in the JSON object.
}

function countdownTimer() {
  console.log("Function: countdownTimer");
  // Determine time depending on difficulty and number of instruments to find.
  // Start the countdown and animates the progress bar.
  // After the countdown is finished call the endRound function.
}

function selectInstrument() {
  console.log("Function: selectInstrument");
  // Check if the instrument selected by the user is correct.
  // If so append it to the answer area and remove it from the optons area. Also call updateScore function and increase multiplier.
  // If not reset multiplier and give some feedback.
}

function updateScore() {
  console.log("Function: updateScore");
  // Increments the score by the number of correct instruments clicked in a row (multiplier).
}

function levelUp() {
  console.log("Function: levelUp");
  // If there were no mistakes made in several rounds increase the difficulty.
}

function endRound() {
  console.log("Function: endRound");
  // Displays a popup with the results of the round and some information on the piece of music
  // Call the gameOver function or the newRound function depending on if there are lives left.
}

function gameOver() {
  console.log("Function: gameOver");
  // Check how many lives there are left and ends the game if there are none.
  // Call addHighscore function.
}

function abortGame() {
  console.log("Function: abortGame");
  // Display a warning and go to home screen if users confirms
  // call addHighscore function
}

function addHighscore() {
  console.log("Function: addHighscore");
  // Ask for name and add result to highscore list in localStorage
}

function pauseGame() {
  console.log("Function: pauseGame");
  // Display the pause popup and resume, restart or end the game according to user selection.
}

function changSettings() {
  console.log("Function: changSettings");
  // Display settings popup and adjust them according to user selection.
  // Write values to local storage.
}
