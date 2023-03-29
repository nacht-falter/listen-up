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
  document.getElementById("score-counter").textContent = gameData.score;
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
      ? 20
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
  // Look for track instruments in allInstruments array and store them in trackInstruments.
  // Adapted from: https://bobbyhadz.com/blog/javascript-get-difference-between-two-arrays-of-objects
  let trackInstruments = allInstruments.filter((item2) => {
    return gameData.currentTrack.instruments.some((item1) => item1 === item2.name);
  });

  // Mark all track instruments as "correct".
  for (let item of trackInstruments) {
    item.correct = true;
  }

  // Remove track instruments from all instruments array, to make sure that there are no duplicates
  // Adapted from https://stackoverflow.com/questions/45342155/how-to-subtract-one-array-from-another-element-wise-in-javascript
  let filteredInstruments = allInstruments.filter((item) => !trackInstruments.includes(item));

  console.log("Track Instruments");
  console.table(trackInstruments);

  // Set the amount of instruments to display according to difficulty:
  let totalInstrumentsCount =
    trackInstruments.length === 1 ? 9 : trackInstruments.length < 5 ? 12 : trackInstruments.length < 8 ? 16 : 24;

  // Calculate the amount of additonal instruments to display:
  let additionalInstrumentCount = totalInstrumentsCount - trackInstruments.length;

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

/**
 * Set the layout for the instruments to be displayed and add instrument
 * list items to options area.
 * Add event listeners to the list items.
 */
function setupTask(taskInstruments) {
  console.log("Function: setupTask");
  const allAnswers = document.getElementById("all-answers");

  // Set the column count for grid layout:
  let gridLayout = taskInstruments.length <= 12 ? 1 : taskInstruments.length <= 16 ? 2 : 3;
  allAnswers.classList.add(`grid-layout-${gridLayout}`);
  let points = 0;
  let wrongAnswers = 0;

  // Create list items for all instruments in taskInstruments array and add event listeners:
  for (let instrument of taskInstruments) {
    const createInstrument = document.createElement("li");
    createInstrument.classList.add("grid-item", "instrument-tile");
    createInstrument.style.backgroundImage = `url(assets/images/instruments/${instrument.image})`;
    createInstrument.innerHTML = `
      <span class="item-content">
        <p>${instrument.name}</p>
      </span>`;

    createInstrument.addEventListener("click", function () {
      if (instrument.correct) {
        createInstrument.classList.add("correct-item");
        points < 0 ? (points = 0) : points++;
        wrongAnswers = 0;
        updateScore(true, points, createInstrument);
      } else {
        createInstrument.classList.add("wrong-item");
        setTimeout(function () {
          createInstrument.classList.remove("wrong-item");
        }, 300);
        points = wrongAnswers === 0 ? 0 : -1;
        wrongAnswers++;
        updateScore(false, points, createInstrument);
      }
    });

    allAnswers.appendChild(createInstrument);
  }
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

/**
 * Update the score and display it in the score area.
 * Display the points added to the score as floating element.
 */
function updateScore(correct, points, clickedItem) {
  console.log("Function: updateScore");
  // Increments the score by the number of correct instruments clicked in a row (multiplier).
  let oldScore = parseInt(document.getElementById("score-counter").textContent);
  let score = document.getElementById("score-counter");

  if (!clickedItem.getAttribute("data-clicked")) {
    let float = document.createElement("span");
    float.classList.add("score-float");
    clickedItem.appendChild(float);
    score.textContent = oldScore + points;

    // If points is 0 no float appears
    float.textContent = points !== 0 ? points : "";

    // Mark correct items as clicked and set colors for floats
    if (correct) {
      clickedItem.setAttribute("data-clicked", "true");
      float.style.color = "yellow";
    } else {
      float.style.color = "red";
    }

    // Add and remove class for float animation to float
    setTimeout(function () {
      float.classList.add("visible-float", "large-float");
      setTimeout(function () {
        float.classList.remove("visible-float");
        setTimeout(function () {
          float.classList.remove("large-float");
          clickedItem.removeChild(float);
        }, 1000);
      }, 1000);
    }, 10);
  }
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
