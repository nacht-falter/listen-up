// Fetch JSON data from files:
// Source for fetch() method: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_api_fetch
let allTracks;
fetch("assets/json/music-library.json")
  .then((response) => response.json())
  .then((data) => {
    allTracks = data;
    console.log(allTracks);
  });

let allInstruments;
fetch("assets/json/musical-instruments.json")
  .then((response) => response.json())
  .then((data) => {
    allInstruments = data;
    console.log(allInstruments);
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
  const gameData = {
    round: 1,
    score: 0,
    lives: 3,
    playedTracks: [],
    currentTrack: {},
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
  const button = document.getElementById("confirm-level-button");
  const items = document.getElementsByClassName("level-list-item");

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

    const button = document.getElementById("start-first-round-button");
    button.addEventListener("click", function () {
      hidePopup();
      gameData = selectTrack(gameData, allTracks);
      let taskInstruments = setupInstruments(gameData, allInstruments);
      console.log(taskInstruments);
      setupTask(taskInstruments);
      playTrack(gameData);
      countdownTimer(gameData);
    });
  }
}

/**
 * Show the popup area and set its content according
 * to the given parameters.
 */
function showPopup(title, body) {
  // Show popup area and display popup title and body.
  const popupArea = document.getElementById("popup-area");
  const popupTitle = document.getElementById("popup-title");
  const popupBody = document.getElementById("popup-body");
  popupArea.style.display = "block";
  popupTitle.textContent = title;
  popupBody.innerHTML = body;
}

/**
 * Hide popup area
 */
function hidePopup() {
  const popupArea = document.getElementById("popup-area");
  popupArea.style.display = "none";
}

/**
 * Select a random track from the allTracks array
 */
function selectTrack(gameData, allTracks) {
  // Set maximum number of Instruments according to difficulty
  const instrumentCountMax =
    gameData.difficulty < 10
      ? 3
      : gameData.difficulty < 15
      ? 6
      : gameData.difficulty < 20
      ? 10
      : gameData.difficulty < 25
      ? 15
      : 20;

  // Find all tracks in allTracks array whose number of instruments is <= instrumentCountMax
  // Solution adapted from: https://stackoverflow.com/questions/52311150/find-all-matching-elements-with-in-an-array-of-objects
  let tracks = allTracks.filter((item) => item.instruments.length <= instrumentCountMax);

  // Generate random number. Check if it has already been used and generate another if necessary:
  let rnd;
  do {
    rnd = Math.floor(Math.random() * tracks.length);
  } while (gameData.playedTracks.includes(rnd));

  let track = tracks[rnd];
  console.table(tracks);

  // Store played track in game data to keep it from being selected again:
  gameData.playedTracks.push(rnd);
  gameData.currentTrack = track;
  console.log(`Selected track: " ${track.composer} - ${track.title}`);
  return gameData;
}

/**
 * Create array of correct instruments and some random
 * additional instruments to be displayed as a list. Add
 * event listeners to the list items
 */
function setupInstruments(gameData, allInstruments) {
  // Look for track instruments in allInstruments array and push them to a new array.
  // Solution found at https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
  let trackInstruments = [];
  for (let instrument of gameData.currentTrack.instruments) {
    let result = allInstruments.find((item) => item.name === instrument);
    if (result) {
      trackInstruments.push(result);
    }
  }

  console.log("Track Instruments");
  console.table(trackInstruments);
  // Set the amount of instruments to display according to difficulty:
  let totalInstrumentsCount = trackInstruments.length < 5 ? 12 : trackInstruments.length < 10 ? 16 : 25;

  // Calculate the amount of additonal instruments to display:
  let additionalInstrumentCount = totalInstrumentsCount - trackInstruments.length;

  // Remove track instruments from all instruments array, to make sure that there are no duplicates
  // Adapted from https://stackoverflow.com/questions/45342155/how-to-subtract-one-array-from-another-element-wise-in-javascript
  let filteredInstruments = allInstruments.filter((n) => !trackInstruments.includes(n));

  // Shuffle the array with all instruments and select the appropriate number of additional instruments
  // Adapted from https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
  let additionalInstruments = filteredInstruments.sort(() => 0.5 - Math.random()).slice(0, additionalInstrumentCount);
  console.log("Additional Instruments");
  console.table(additionalInstruments);

  let taskInstruments = trackInstruments.concat(additionalInstruments).sort(() => 0.5 - Math.random());
  console.log("Task Instruments");
  console.table(taskInstruments);
  return taskInstruments;
}

function setupTask() {
  console.log("Function: setupTask");
  // Add EventListeners to the list items calling the selectInstrument function.
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
