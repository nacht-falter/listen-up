function newGame() {
  // Set round, score, lives to initial values.
  // Call setLevel function.
  // Check if game runs for the first time and if so start tutorial
  // Start main game loop if there are lives left
  // Inside the loop Call the following functions: startRound, setupTask, PlayAudio, countdown.
}

function setLevel() {
  // Return an object with difficulty and level values
}

function startTutorial() {
  // Show tutorial if the game runs for the first time.
}

function newRound() {
  // Return an object with the score and number of correct answers
}

function showPopup() {
  // Show popup area and display popup title and body.
}

function hidePopup() {
  // Hide popup area.
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
