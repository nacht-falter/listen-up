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
  let title = "Choose your level";
  let body = `
    <ul class="select-level">
      <li class="level-list-item">Beginner</li>
      <li class="level-list-item">Advanced</li>
      <li class="level-list-item">Pro</li>
    </ul>
    <button id="confirm-level" disabled>Confirm</button>
    `;

  showPopup(title, body);

  // Add event listeners to the level list items and to the confirm button:
  let level;
  let button = document.getElementById("confirm-level");
  let items = document.getElementsByClassName("level-list-item");
  for (let item of items) {
    item.addEventListener("click", function () {
      this.classList.add("selected-item");
      level = this.textContent;
      // Set initial difficulty according to selected level:
      gameData.difficulty = level === "Pro" ? 20 : level === "Advanced" ? 10 : 0;
      button.disabled = false;
      button.addEventListener("click", function () {
        hidePopup();
        newRound(gameData);
      });
    });
  }
}

function newRound() {
  // Return an object with the score and number of correct answers
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

function selectTrack() {
  // Randomly choose an item from the JSON file according to the difficulty values and add the item to the playedPieces array.
}

function setupTask() {
  // Display the correct instruments randomly mixed with wrong instruments in the options area as list items
  // Display the amount of instruments in the total items span
  // Add EventListeners to the list items calling the selectInstrument function.
  // Return the item selected from the JSON file.
}

function playAudio() {
  // Play the adio file specified in the JSON object.
}

function countdownTimer() {
  // Determine time depending on difficulty and number of instruments to find.
  // Start the countdown and animates the progress bar.
  // After the countdown is finished call the endRound function.
}

function selectInstrument() {
  // Check if the instrument selected by the user is correct.
  // If so append it to the answer area and remove it from the optons area. Also call updateScore function and increase multiplier.
  // If not reset multiplier and give some feedback.
}

function updateScore() {
  // Increments the score by the number of correct instruments clicked in a row (multiplier).
}

function levelUp() {
  // If there were no mistakes made in several rounds increase the difficulty.
}

function endRound() {
  // Displays a popup with the results of the round and some information on the piece of music
  // Call the gameOver function or the newRound function depending on if there are lives left.
}

function gameOver() {
  // Check how many lives there are left and ends the game if there are none.
  // Call addHighscore function.
}

function abortGame() {
  // Display a warning and go to home screen if users confirms
  // call addHighscore function
}

function addHighscore() {
  // Ask for name and add result to highscore list in localStorage
}

function pauseGame() {
  // Display the pause popup and resume, restart or end the game according to user selection.
}

function changSettings() {
  // Display settings popup and adjust them according to user selection.
  // Write values to local storage.
}
