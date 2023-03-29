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

// Initialize variable holding the game data so that it is accessible on global scope
let gameData = {};

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
  gameData = {
    round: 1,
    score: 0,
    lives: 3,
    playedTracks: [],
    currentTrack: {},
    difficulty: 1,
    itemCount: 0,
  };
  document.getElementById("score-counter").textContent = gameData.score;
  selectLevel();
}

/**
 * Prompt user to select a level and set the initial difficulty
 * accordingly. Calls the newRound function with the adjusted
 * difficulty setting
 */
function selectLevel() {
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
      gameData.difficulty = level === levels[2] ? 20 : level === levels[1] ? 10 : 1;
      button.disabled = false;
      console.log("Difficulty set to: " + gameData.difficulty);
      button.addEventListener("click", function () {
        hidePopup();
        newRound();
      });
    });
  }
}

function newRound() {
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
      gameData = selectTrack(allTracks);
      let taskInstruments = setupInstruments(allInstruments);
      console.log(taskInstruments);
      setupTask(taskInstruments);
      playAudio();
      countdownTimer();
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
function selectTrack(allTracks) {
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
  document.getElementById("total-items").textContent = track.instruments.length;

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
function setupInstruments(allInstruments) {
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
/**
 * Play the audio file specified in the JSON object.
 */
function playAudio() {
  // Play audio file. Adapted from https://stackoverflow.com/questions/52575143/play-an-audio-file-in-javascript
  let audioFile = "assets/audio/" + gameData.currentTrack.file;
  let audio = new Audio(audioFile);
  audio.play();
  console.log("Audio file playing: " + audioFile);
  // Throw an error if audio file is not available. Solution found at https://www.w3schools.com/tags/av_event_error.asp#gsc.tab=0
  audio.onerror = function () {
    console.log("Error: Audio file not available. Starting new round!");
    newRound();
  };
}

/**
 * Calculate countdown time according to difficulty and number
 * of instruments and display progress bar.
 * Call endRound function when time runs out.
 */
function countdownTimer() {
  let defaultTime = 90000;
  let minTime = 20000;
  let maxTime = 120000;
  // Calculate countdown time depending on difficulty and number of instruments with
  let countdownTime = Math.min(
    Math.max(
      parseInt((defaultTime / (gameData.difficulty / 20)) * (gameData.currentTrack.instruments.length / 10)),
      minTime
    ),
    maxTime
  );
  console.log("Countdown time: " + countdownTime);
  let progressBar = document.getElementsByClassName("progress-bar")[0];
  progressBar.style.transitionDuration = countdownTime + "ms";
  progressBar.classList.add("progress-bar-empty");

  //Store timeout function in game data:
  gameData.countdownTimeout = setTimeout(endRound, countdownTime);
}

/**
 * Update the score and display it in the score area.
 * Display the points added to the score as floating element.
 * Call endRound() function if all items have been found.
 */
function updateScore(correct, points, clickedItem) {
  console.log("Function: updateScore");
  // Add or substract points to/from the score with wrong/right answer
  let oldScore = gameData.score;
  let scoreCounter = document.getElementById("score-counter");
  let oldItemCount = gameData.itemCount;

  if (!clickedItem.getAttribute("data-clicked")) {
    let float = document.createElement("span");
    float.classList.add("score-float");
    clickedItem.appendChild(float);
    gameData.score = oldScore + points;
    scoreCounter.innerText = gameData.score;

    // If points is 0 no float appears
    float.textContent = points !== 0 ? points : "";

    // Mark correct items as clicked and set colors for floats
    if (correct) {
      clickedItem.setAttribute("data-clicked", "true");
      // Update number of correct instruments
      gameData.itemCount = ++oldItemCount;
      document.getElementById("correct-items").textContent = gameData.itemCount;
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

    // If all instruments have been found call endRound()
    let correctItems = document.getElementById("correct-items").innerText;
    let totalItems = document.getElementById("total-items").innerText;
    if (correctItems === totalItems) {
      console.log("All instruments have been found");

      endRound();
    }
  }
}

/**
 * Display a popup with the round results and some information
 * on the piece of music.
 * Call the gameOver function or the newRound function depending
 * on if there are lives left.
 */
function endRound() {
  console.log("Function: endRound");

  clearTimeout(gameData.countdownTimeout);

  let progressBar = document.getElementsByClassName("progress-bar")[0];
  progressBar.style.transitionDuration = 0;
  progressBar.classList.remove("progress-bar-empty");

  levelUp();

  // Prepare content for popup:
  let track = gameData.currentTrack;
  let title = `Round ${gameData.round} finished`;
  let message =
    gameData.itemCount === 0
      ? "Better luck next time!"
      : gameData.itemCount < track.instruments.length
      ? "Not bad!"
      : "Well done!";
  let body = `
    <p>${message}</p>
    <p>You found ${gameData.itemCount} of ${track.instruments.length} instruments</p>
    <h3>Track information</h3>
    <p class="track-information">
    <img class="composer-image" scr="assets/images/${track.image}" alt="An image of ${track.composer}">
      <table>
          <tbody>
          <tr>
            <td>Composer:</td>
            <td>${track.composer}</td>
          </tr>
          <tr>
            <td>Title:</td>
            <td>${track.title}</td>
          </tr>
          <tr>
            <td>Year:</td>
            <td>${track.year}</td>
          </tr>
          <tr>
            <td>Period:</td>
            <td>${track.period}</td>
          </tr>
        </tbody>
        </table>
    </p>
    <button id="end-game-button">End Game</button>
    <button id="next-round-button">Next round</button>
    `;

  showPopup(title, body);

  // Add event listeners to the buttons:
  const endGame = document.getElementById("end-game-button");
  const nextRound = document.getElementById("next-round-button");

  endGame.addEventListener("click", function () {
    hidePopup();
    endGame();
  });

  nextRound.addEventListener("click", function () {
    hidePopup();
    newRound();
  });
}

function levelUp() {
  console.log("Function: levelUp");
  // If there were no mistakes made in several rounds increase the difficulty.
}

function endGame() {
  console.log("Function: endGame");
  // Check how many lives there are left and ends the game if there are none.
  // Call addHighscore function.
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
