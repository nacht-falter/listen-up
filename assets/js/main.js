// Function declarations

/**
 * Function to start a new game and initialize the game data.
 */
function newGame() {
  gameData = {
    round: 1,
    perfectRounds: 0,
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
  console.log("Function called: selectLevel");
  // Set contents for popup area:
  let levels = ["Beginner", "Intermediate", "Advanced"];
  let title = "Choose your level";
  let body = `
    <ul class="select-level flex-container">
      <li class="level-list-item" data-level="${levels[0]}">
        <figure>
          <img class="level-image-1" src="assets/images/image-level-1.png" alt="A stylized image of Mozart as a boy" aria-label="A stylized image of Mozart as a boy">
          <figcaption class="level-name">${levels[0]}</figcaption>
        </figure>
      </li>
      <li class="level-list-item" data-level="${levels[1]}">
        <figure>
          <img " src="assets/images/image-level-2.png" alt="A stylized image of Mozart" aria-label="A stylized image of Mozart">
          <figcaption class>${levels[1]}</figcaption>
        </figure>
      </li>
      <li class="level-list-item" data-level="${levels[2]}">
        <figure>
          <img class="level-image-3" src="assets/images/image-level-3.png" alt="A stylized image of Mozart as an old man wearing sunglasses" aria-label="A stylized image of Mozart as an old man wearing sunglasses">
          <figcaption>${levels[2]}</figcaption>
        </figure>
      </li>
    </ul>
    <button id="confirm-level-button" disabled>Confirm</button>
    `;

  showPopup(title, body);

  // Add event listeners to the level list items and to the confirm button:
  const button = document.getElementById("confirm-level-button");
  const items = document.getElementsByClassName("level-list-item");

  for (let item of items) {
    item.addEventListener("click", function () {
      for (let i of items) {
        i.classList.remove("selected-item");
      }
      this.classList.add("selected-item");
      let level = this.getAttribute("data-level");
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

/**
 * Setup new round
 */
function newRound() {
  console.log("New Round started with difficulty: " + gameData.difficulty);
  if (gameData.currentTrack.audio) {
    stopAudio();
  }
  if (gameData.round === 1) {
    // Set contents for popup area:
    let title = "Round 1";

    let levelImage =
      gameData.level === "Beginner"
        ? `
        <figure>
          <img class="level-image-1" src="assets/images/image-level-1.png" alt="A stylized image of Mozart as a boy" aria-label="A stylized image of Mozart as a boy">
          <figcaption class="level-name">${gameData.level}</figcaption>
        </figure>`
        : gameData.level === "Intermediate"
        ? `
      <figure>
        <img " src="assets/images/image-level-2.png" alt="A stylized image of Mozart" aria-label="A stylized image of Mozart">
        <figcaption class>${gameData.level}</figcaption>
      </figure> `
        : `
      <figure>
        <img " src="assets/images/image-level-3.png" alt="A stylized image of Mozart as an old man wearing sunglasses" aria-label="A stylized image of Mozart as an old man wearing sunglasses">
        <figcaption class>${gameData.level}</figcaption>
      </figure> `;

    let body = `
      <p>Level: ${gameData.level}</p>
      ${levelImage}
      <p class="large-text">Ready?</p>
      <button id="start-first-round-button">Start Game</button>
      `;

    showPopup(title, body);

    const button = document.getElementById("start-first-round-button");
    button.addEventListener("click", function () {
      hidePopup();
      startRound();
    });
  } else {
    startRound();
  }
}
/**
 * Call the functions starting the next round
 */
function startRound() {
  console.log("Function called: startRound");
  gameData = selectTrack(allTracks);
  let taskInstruments = setupInstruments(allInstruments);
  setupTask(taskInstruments);
  playAudio();
  countdownTimer();
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
  console.log("Function called: selectTrack");
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
  // If all available tracks have been played reset playedTracks
  let rnd;
  do {
    rnd = Math.floor(Math.random() * tracks.length);
    if (tracks.length === gameData.playedTracks.length) {
      gameData.playedTracks = [];
    }
  } while (gameData.playedTracks.includes(rnd));

  let track = tracks[rnd];
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
  console.log("Function called: setupInstruments");
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

  // Set the amount of instruments to display according to difficulty:
  let totalInstrumentsCount = trackInstruments.length < 5 ? 12 : trackInstruments.length < 8 ? 16 : 24;

  // Calculate the amount of additonal instruments to display:
  let additionalInstrumentCount = totalInstrumentsCount - trackInstruments.length;

  // Shuffle the array with all instruments and select the appropriate number of additional instruments
  // Adapted from https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
  let additionalInstruments = shuffleArray(filteredInstruments).slice(0, additionalInstrumentCount);

  let taskInstruments = shuffleArray(trackInstruments.concat(additionalInstruments));
  return taskInstruments;
}

/**
 * Shuffle array with Fisher-Yates algorithm.
 * Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Set the layout for the instruments to be displayed and add instrument
 * list items to options area.
 * Add event listeners to the list items.
 */
function setupTask(taskInstruments) {
  console.log("Function called: setupTask");
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
  console.log("Function called: playAudio");
  // Play audio file. Adapted from https://stackoverflow.com/questions/52575143/play-an-audio-file-in-javascript
  let audioFile = "assets/audio/" + gameData.currentTrack.file;

  // Read track volume and starting position
  let trackVolume = gameData.currentTrack.volume ? gameData.currentTrack.volume : 0.98;
  let startPosition = gameData.currentTrack.position ? gameData.currentTrack.position : 0.5;

  gameData.currentTrack.audio = new Audio(audioFile);
  let audio = gameData.currentTrack.audio;
  audio.currentTime = startPosition;
  audio.volume = 0;

  if (navigator.platform !== "iPhone" || "iPad") {
    const fadeAudio = setInterval(() => {
      if (audio.volume < trackVolume) {
        audio.volume += 0.02;
      } else {
        clearInterval(fadeAudio);
      }
    }, 50);
  }

  audio.play();
  console.log("Audio file playing: " + audioFile);
  // Throw an error if audio file is not available. Solution found at https://www.w3schools.com/tags/av_event_error.asp#gsc.tab=0
  gameData.currentTrack.audio.onerror = function () {
    console.log("Error: Audio file not available. Starting new round!");
    newRound();
  };
}

/** Stop current audio playback
 * Source: https://thewebdev.info/2021/10/14/how-to-playback-html-audio-with-fade-in-and-fade-out-with-javascript/
 */
function stopAudio() {
  let audio = gameData.currentTrack.audio;
  if (navigator.platform === "iPhone" || "iPad") {
    audio.pause();
  } else {
    const fadeAudio = setInterval(() => {
      if (audio.volume !== 0) {
        audio.volume -= 0.05;
      }

      if (audio.volume < 0.02) {
        clearInterval(fadeAudio);
        audio.pause();
      }
    }, 50);
  }
}

/**
 * Reduce audio Volume
 */
function fadeAudio() {
  let audio = gameData.currentTrack.audio;
  if (navigator.platform !== "iPhone" || "iPad") {
    const fadeAudio = setInterval(() => {
      if (audio.volume !== 0) {
        audio.volume -= 0.1;
      }

      if (audio.volume < 0.5) {
        clearInterval(fadeAudio);
      }
    }, 100);
  }
}

/**
 * Calculate countdown time according to difficulty and number
 * of instruments and display progress bar.
 * Call endRound function when time runs out.
 */
function countdownTimer() {
  console.log("Function called: countdownTimer");
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
  progressBar.style.animationDuration = countdownTime + "ms";
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
  console.log("Function called: updateScore");
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

      // Increment perfect rounds counter if all instruments were found
      gameData.perfectRounds++;

      levelUp();
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
  console.log("Function called: endRound");

  clearCountdown();
  fadeAudio();

  let track = gameData.currentTrack;

  // Reset perfect rounds if there were mistakes
  if (gameData.itemCount < track.instruments.length) {
    gameData.perfectRounds = 0;
  }

  // Decrement lives if no instruments were found
  if (gameData.itemCount === 0) {
    gameData.lives--;
  }
  let livesCounter = document.getElementById("lives-counter");
  livesCounter.innerText = gameData.lives;

  // Prepare content for popup:
  let title = `Round ${gameData.round} finished`;
  let message =
    gameData.lives === 0
      ? "No more lives ... Game Over!"
      : gameData.itemCount === 0
      ? "Better luck next time!"
      : gameData.itemCount < track.instruments.length
      ? "Not bad!"
      : "Well done!";
  let body = `
    <p><strong>${message}</strong></p>
    <p>You found ${gameData.itemCount} of ${track.instruments.length} instruments</p>
    <p class="large-text">Score: ${gameData.score} | Lives: ${gameData.lives}</p>
    <div id="track-info">
      <h3>Track information</h3>
      <img class="composer-image" src="assets/images/composers/${track.image}" alt="An image of ${track.composer}">
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
    </div>
    <button id="end-game-button">End Game</button>
    <button id="next-round-button">Next round</button>
    `;

  showPopup(title, body);

  // Add event listeners to the buttons:
  const endGameButton = document.getElementById("end-game-button");
  const nextRoundButton = document.getElementById("next-round-button");

  endGameButton.addEventListener("click", function () {
    if (gameData.lives > 0) {
      hidePopup();
      confirmEnd();
    } else {
      endGame();
    }
  });

  if (gameData.lives === 0) {
    nextRoundButton.remove();
  } else {
    nextRoundButton.addEventListener("click", function () {
      hidePopup();
      newRound();
    });
  }

  cleanupTask();
  gameData.round++;
}

/**
 * Ask for confirmation before ending game
 */
function confirmEnd() {
  let title = "End Game?";
  let body = `
      <p>Are you sure you want to abort the game?</p>
      <button id="continue-game-button">No, continue</button>
      <button id="end-game-button">Yes, I'm sure</button>
      `;

  showPopup(title, body);

  const continueGameButton = document.getElementById("continue-game-button");
  const endGameButton = document.getElementById("end-game-button");

  continueGameButton.addEventListener("click", function () {
    hidePopup();
    newRound();
  });

  endGameButton.addEventListener("click", function () {
    hidePopup();
    endGame();
  });
}

/**
 * Increase difficulty if there were no mistakes in 3 rounds.
 */
function levelUp() {
  console.log("Function called: levelUp");
  if (gameData.perfectRounds % 3 === 0) {
    gameData.difficulty += 5;

    // Prepare popup
    let title = "Level up!";
    let body = `
      <p class="final-score">Well done!</p>
      <p class="final-score">Difficulty increased</p>
      <button id="continue-button">Continue</button>
      `;

    showPopup(title, body);

    const continueButton = document.getElementById("continue-button");

    continueButton.addEventListener("click", function () {
      hidePopup();
      endRound();
    });
  } else {
    endRound();
  }
}

/**
 * Reset countdown and progress-bar
 */
function clearCountdown() {
  console.log("Function called: clearCountdown");
  clearTimeout(gameData.countdownTimeout);

  let progressBar = document.getElementsByClassName("progress-bar")[0];
  progressBar.style.transitionDuration = "0s";
  progressBar.classList.remove("progress-bar-empty");
}

/**
 * Reset task area and item count
 */
function cleanupTask() {
  console.log("Function called: cleanupTask");
  gameData.itemCount = 0;

  // Remove 'correct' flags from allInstruments array
  for (let item of allInstruments) {
    item.correct = "";
  }

  document.getElementById("all-answers").textContent = "";
  document.getElementById("correct-items").innerText = 0;
  document.getElementById("total-items").innerText = 0;
  document.getElementById("all-answers").classList.remove("grid-layout-1", "grid-layout-2", "grid-layout-3");
}

/**
 * Display end screen and offer to go to home page or
 * start new Game
 */
function endGame() {
  console.log("Function called: endGame");
  stopAudio();
  gameData.lives = 3;
  let title = "Game Over";
  let body = `
      <p class="final-score">Final score: ${gameData.score}</p>
      <button id="go-home-button">Go Home</button>
      <button id="new-game-button">Start New Game</button>
      `;

  showPopup(title, body);

  const goHomeButton = document.getElementById("go-home-button");
  const newGameButton = document.getElementById("new-game-button");

  goHomeButton.addEventListener("click", function () {
    // Go to home screen, source: https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
    window.onbeforeunload = "";
    window.location.replace("/index.html");
  });

  newGameButton.addEventListener("click", function () {
    hidePopup();
    newGame();
  });
}

// Start of program
// Fetch JSON data from files:
// Source for fetch() method: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_api_fetch
let allTracks;
fetch("assets/json/music-library.json")
  .then((response) => response.json())
  .then((data) => {
    allTracks = data;
  });

let allInstruments;
fetch("assets/json/musical-instruments.json")
  .then((response) => response.json())
  .then((data) => {
    allInstruments = data;
  });

// Initialize variable holding the game data so that it is accessible on global scope
let gameData = {};

// Wait for DOM content to load, then start the game
document.addEventListener("DOMContentLoaded", function () {
  // Ask for confirmation before leaving or refreshing the page
  // Source: https://stackoverflow.com/questions/3221161/how-to-pop-up-an-alert-box-when-the-browsers-refresh-button-is-clicked
  window.onbeforeunload = function () {
    return "Your progress will be lost if you leave the page, are you sure?";
  };

  newGame();
});
