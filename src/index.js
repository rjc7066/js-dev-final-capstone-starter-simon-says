/**
 * DOM SELECTORS
 */

 const startButton = document.querySelector(".js-start-button");
 const statusSpan = document.querySelector('.js-status');
 const heading = document.querySelector('.js-heading');
 const padContainer = document.querySelector('.js-pad-container');
 const difficultyButtons = document.querySelectorAll('.difficulty-button');
 const difficultySelectText = document.querySelector('.difficulty-select-text');
 const allPads = document.querySelectorAll('.pad');

/**
 * VARIABLES
 */
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far
let currentDifficulty = 1;

const victorySound = new Audio("https://rjc7066.github.io/js-dev-final-capstone-starter-simon-says/assets/victory.mp3");
const defeatSound = new Audio("https://rjc7066.github.io/js-dev-final-capstone-starter-simon-says/assets/fatality.mp3");

/**
 *
 * The `pads` array contains an array of pad objects.
 *
 * Each pad object contains the data related to a pad: `color`, `sound`, and `selector`.
 * - The `color` property is set to the color of the pad (e.g., "red", "blue").
 * - The `selector` property is set to the DOM selector for the pad.
 * - The `sound` property is set to an audio file using the Audio() constructor.
 *
 * Audio file for the green pad: "../assets/simon-says-sound-2.mp3"
 * Audio file for the blue pad: "../assets/simon-says-sound-3.mp3"
 * Audio file for the yellow pad: "../assets/simon-says-sound-4.mp3"
 *
 */

 const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("https://rjc7066.github.io/js-dev-final-capstone-starter-simon-says/assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("https://rjc7066.github.io/js-dev-final-capstone-starter-simon-says/assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("https://rjc7066.github.io/js-dev-final-capstone-starter-simon-says/assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("https://rjc7066.github.io/js-dev-final-capstone-starter-simon-says/assets/simon-says-sound-4.mp3")
  }
];

/**
 * EVENT LISTENERS
 */

padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);
difficultyButtons.forEach((button) => {
  button.addEventListener('click', difficultyButtonHandler);
})

function difficultyButtonHandler(event) {
  const difficultyMessageMapping = {
    '0': "Super Easy Mode. You literally can't lose.",
    '1': "Normal Mode.",
    2: "Hard Mode.",
    3: "Very Hard Mode.",
    4: "Pumpkin Mode."
  }
  currentDifficulty = event.target.value;
  difficultySelectText.textContent = difficultyMessageMapping[currentDifficulty];
  difficultyButtons.forEach((button) => {
    button.classList.remove('button-selected');
  })
  event.target.classList.add('button-selected');
}

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 *
 * 1. Call setLevel() to set the level of the game
 *
 * 2. Increment the roundCount from 0 to 1
 *
 * 3. Hide the start button by adding the `.hidden` class to the start button
 *
 * 4. Unhide the status element, which displays the status messages, by removing the `.hidden` class
 *
 * 5. Call `playComputerTurn()` to start the game with the computer going first.
 *
 */
function startButtonHandler() {
  // disable the difficulty selector buttons
  difficultyButtons.forEach((button) => {
    button.classList.add('button-disabled');
    button.classList.remove('initial-select');
  })

  // Call setLevel() to set the level of the game
  maxRoundCount = setLevel(currentDifficulty);

  // Increment the roundCount from 0 to 1
  roundCount++;

  // Hide the start button by adding the `.hidden` class to the start button
  startButton.classList.add('hidden');

  // Unhide the status element, which displays the status messages, by removing the `.hidden` class
  statusSpan.classList.remove('hidden');

  // Call `playComputerTurn()` to start the game with the computer going first.
  playComputerTurn();

  return { startButton, statusSpan };
}

/**
 * Called when one of the pads is clicked.
 *
 * 1. `const { color } = event.target.dataset;` extracts the value of `data-color`
 * attribute on the element that was clicked and stores it in the `color` variable
 *
 * 2. `if (!color) return;` exits the function if the `color` variable is falsy
 *
 * 3. Use the `.find()` method to retrieve the pad from the `pads` array and store it
 * in a variable called `pad`
 *
 * 4. Play the sound for the pad by calling `pad.sound.play()`
 *
 * 5. Call `checkPress(color)` to verify the player's selection
 *
 * 6. Return the `color` variable as the output
 */
function padHandler(event) {
  // Extract the color of the pressed pad
  const { color } = event.target.dataset;
  if (!color) return;

  // Retrieve the pad from the `pads` array
  const pad = pads.find((p) => p.color === color);

  // Play the sound for the pad
  pad.sound.play();

  // Verify the player's selection
  checkPress(color);

  return color;
}

/**
 * HELPER FUNCTIONS
 */

/**
 * Sets the level of the game given a `level` parameter.
 * Returns the length of the sequence for a valid `level` parameter (1 - 4) or an error message otherwise.
 *
 * Each skill level will require the player to complete a different number of rounds, as follows:
 * Skill level 1: 8 rounds
 * Skill level 2: 14 rounds
 * Skill level 3: 20 rounds
 * Skill level 4: 31 rounds
 *
 *
 * Example:
 * setLevel() //> returns 8
 * setLevel(1) //> returns 8
 * setLevel(2) //> returns 14
 * setLevel(3) //> returns 20
 * setLevel(4) //> returns 31
 * setLevel(5) //> returns "Please enter level 1, 2, 3, or 4";
 * setLevel(8) //> returns "Please enter level 1, 2, 3, or 4";
 *
 */
function setLevel(level = 1) {
  const levelMapping = {
    0: 5,
    1: 8,
    2: 14,
    3: 20,
    4: 21
  }
  return levelMapping[level] ? levelMapping[level] : 'Please enter level 1, 2, 3, or 4';
}

/**
 * Returns a randomly selected item from a given array.
 *
 * 1. `Math.random()` returns a floating-point, pseudo-random number in the range 0 to less than 1
 *
 * 2. Multiplying the value from `Math.random()` with the length of the array ensures that the range
 * of the random number is less than the length of the array. So if the length of the array is 4,
 * the random number returned will be between 0 and 4 (exclusive)
 *
 * 3. Math.floor() rounds the numbers down to the largest integer less than or equal the given value
 *
 * Example:
 * getRandomItem([1, 2, 3, 4]) //> returns 2
 * getRandomItem([1, 2, 3, 4]) //> returns 1
 */
function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Sets the status text of a given HTML element with a given a message
 */
function setText(element, text) {
  element.textContent = text;
  return element;
}

/**
 * Activates a pad of a given color by playing its sound and light
 *
 * 1. Use the `.find()` method to retrieve the pad from the `pads` array and store it in
 * a variable called `pad`
 *
 * 2. Add the `"activated"` class to the selected pad
 *
 * 3. Play the sound associated with the pad
 *
 * 4. After 500ms, remove the `"activated"` class from the pad
 */

function activatePad(color) {
  // Retrieve the pad from the `pads` array and store it in a variable
  const pad = pads.find((pad) => pad.color === color);

  // Add the `"activated"` class to the selected pad
  pad.selector.classList.add('activated');

  // Play the sound associated with the pad
  pad.sound.play();

  // After 500ms, remove the `"activated"` class from the pad
  setTimeout(() => {
      pad.selector.classList.remove('activated');
    }, 500
  );

}

/**
 * Activates a sequence of colors passed as an array to the function
 *
 * 1. Iterate over the `sequence` array using `.forEach()`
 *
 * 2. For each element in `sequence`, use `setTimeout()` to call `activatePad()`, adding
 * a delay (in milliseconds) between each pad press. Without it, the pads in the sequence
 * will be activated all at once
 *
 * 3. The delay between each pad press, passed as a second argument to `setTimeout()`, needs
 * to change on each iteration. The first button in the sequence is activated after 600ms,
 * the next one after 1200ms (600ms after the first), the third one after 1800ms, and so on.
 */

function activatePads(sequence) {
  let timer = 700;
  sequence.forEach((pad) => {
    setTimeout(() => {
      activatePad(pad);
    }, timer);
    timer += 700;
  });
};

/**
 * Allows the computer to play its turn.
 *
 * 1. Add the `"unclickable"` class to `padContainer` to prevent the user from pressing
 * any of the pads
 *
 * 2. The status should display a message that says "The computer's turn..."
 *
 * 3. The heading should display a message that lets the player know how many rounds are left
 * (e.g., "`Round ${roundCount} of ${maxRoundCount}`")
 *
 * 4. Push a randomly selected color into the `computerSequence` array
 *
 * 5. Call `activatePads(computerSequence)` to light up each pad according to order defined in
 * `computerSequence`
 *
 * 6. The playHumanTurn() function needs to be called after the computer’s turn is over, so
 * we need to add a delay and calculate when the computer will be done with the sequence of
 * pad presses. The `setTimeout()` function executes `playHumanTurn(roundCount)` one second
 * after the last pad in the sequence is activated. The total duration of the sequence corresponds
 * to the current round (roundCount) multiplied by 600ms which is the duration for each pad in the
 * sequence.
 */
 function playComputerTurn() {
  // Add the `"unclickable"` class to `padContainer
  padContainer.classList.add('unclickable');

  // The status should display a message that says "The computer's turn..."
  statusSpan.textContent = "The computer's turn";

  // The heading displays a message informing the player how many rounds are left
  heading.textContent = `Round ${roundCount} of ${maxRoundCount}`;

  // Push a randomly selected color into the `computerSequence` array
  computerSequence.push(getRandomItem(pads).color);

  // light up each pad according to order defined in computerSequence
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000);
  console.log(computerSequence);
}

function disableAllPads() {
  allPads.forEach((pad) => {
    pad.classList.add('button-disabled');
    pad.classList.add('unclickable');
  })
}

function enableAllPads() {
  allPads.forEach((pad) => {
    pad.classList.remove('button-disabled');
    pad.classList.remove('unclickable');
  })
}

/**
 * Only allows cursor events on the correct pad, super easy mode
 * 
 * 1. Determine the current color
 * 
 * 2. Add disabling classes to all pads
 * 
 * 3. Remove the disabling classes from the current color only
 * 
 * Not the most efficient way to do it, but it works.
 */
function highlightCurrentPadOnly() {
  // Determine the current color
  const currentColor = computerSequence[(playerSequence.length)] || computerSequence[0];
  
  // Add disabling classes to all pads
  allPads.forEach((pad) => {
    pad.classList.add('button-disabled');
    pad.classList.add('unclickable');
  })
  
  // Remove the disabling classes from the current color only
  const currentColorPad = document.querySelector(`.pad-${currentColor}`);
  currentColorPad.classList.remove('button-disabled');
  currentColorPad.classList.remove('unclickable')
}

/**
 * Allows the player to play their turn.
 *
 * 1. Remove the "unclickable" class from the pad container so that each pad is clickable again
 *
 * 2. Display a status message showing the player how many presses are left in the round
 */
function playHumanTurn() {
  // Remove the "unclickable" class from the pad container so that each pad is clickable again
  padContainer.classList.remove("unclickable");

  // if playing on super easy mode then only allow highlighting the current pad now
  if (currentDifficulty == 0) {
    highlightCurrentPadOnly();
  }
  
  // Display a status message showing the player how many presses are left in the round
  statusSpan.textContent = `Player's Turn: there are ${computerSequence.length - playerSequence.length} moves left in the round.`;
}

/**
 * Checks the player's selection every time the player presses on a pad during
 * the player's turn
 *
 * 1. Add the `color` variable to the end of the `playerSequence` array
 *
 * 2. Store the index of the `color` variable in a variable called `index`
 *
 * 3. Calculate how many presses are left in the round using
 * `computerSequence.length - playerSequence.length` and store the result in
 * a variable called `remainingPresses`
 *
 * 4. Set the status to let the player know how many presses are left in the round
 *
 * 5. Check whether the elements at the `index` position in `computerSequence`
 * and `playerSequence` match. If they don't match, it means the player made
 * a wrong turn, so call `resetGame()` with a failure message and exit the function
 *
 * 6. If there are no presses left (i.e., `remainingPresses === 0`), it means the round
 * is over, so call `checkRound()` instead to check the results of the round
 *
 */
function checkPress(color) {
  // Add the `color` variable to the end of the `playerSequence` array
  // Store the index of the `color` variable in a variable called `index`
  const index = playerSequence.push(color) - 1;

  // make sure all pads are enabled
  enableAllPads();

  // Calculate how many presses are left in the round
  let remainingPresses = computerSequence.length - playerSequence.length;
  
  // Set the status to let the player know how many presses are left in the round
  statusSpan.textContent = `Player's Turn: there are ${computerSequence.length - playerSequence.length} moves left in the round.`;

  // Check whether the elements at the `index` position in `computerSequence` and `playerSequence` match
  // If they don't match call `resetGame()` with a failure message and exit the function
  if (playerSequence[index] !== computerSequence[index]) {
    console.log(`Player chose ${playerSequence[index]}, but correct was ${computerSequence[index]}`);
    console.log("Resetting Game");
    defeatSound.play();
    resetGame('You Lose!');
    return;
  }

  // If there are no presses left check the results of the round
  if (remainingPresses === 0) {
    checkRound();
    return;
  };

  // if playing on super easy mode then only allow highlighting the current pad now
  if (currentDifficulty == 0) {
    highlightCurrentPadOnly();
  }
}

/**
 * Checks each round to see if the player has completed all the rounds of the game * or advance to the next round if the game has not finished.
 *
 * 1. If the length of the `playerSequence` array matches `maxRoundCount`, it means that
 * the player has completed all the rounds so call `resetGame()` with a success message
 *
 * 2. Else, the `roundCount` variable is incremented by 1 and the `playerSequence` array
 * is reset to an empty array.
 * - And the status text is updated to let the player know to keep playing (e.g., "Nice! Keep going!")
 * - And `playComputerTurn()` is called after 1000 ms (using setTimeout()). The delay
 * is to allow the user to see the success message. Otherwise, it will not appear at
 * all because it will get overwritten.
 *
 */

function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    victorySound.play();
    resetGame('The pumpkins spare you, for now...');
  } else {
    roundCount++;
    playerSequence = [];
    statusSpan.textContent = 'The pumpkins are pleased.'
    setTimeout(() => {
      playComputerTurn();
    }, 1000);
  }

}

/**
 * Resets the game. Called when either the player makes a mistake or wins the game.
 *
 * 1. Reset `computerSequence` to an empty array
 *
 * 2. Reset `playerSequence` to an empty array
 *
 * 3. Reset `roundCount` to an empty array
 */
function resetGame(text) {
  computerSequence = [];
  playerSequence = [];
  roundCount = [];
  alert(text);
  setText(heading, "Pumpkins Proclaim");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
  difficultyButtons.forEach((button) => {
    button.classList.add('initial-select');
    button.classList.remove('button-disabled');
  })
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
