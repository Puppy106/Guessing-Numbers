const guessInput = document.getElementById('guessInput');
const submitGuess = document.getElementById('submitGuess');
const resetButton = document.getElementById('resetButton');
const message = document.getElementById('message');
const attemptsLabel = document.getElementById('attempts');
const difficultyButtons = document.querySelectorAll('.difficulty-button');

const difficultySettings = {
    easy: { maxAttempts: 15, label: 'Easy' },
    medium: { maxAttempts: 10, label: 'Medium' },
    hard: { maxAttempts: 5, label: 'Hard' }
};

const maxRange = 100;
let targetNumber;
let attemptCount;
let selectedDifficulty = 'easy';
let maxAttempts;

function startGame() {
    targetNumber = Math.floor(Math.random() * maxRange) + 1;
    attemptCount = 0;
    maxAttempts = difficultySettings[selectedDifficulty].maxAttempts;

    updateMessage(`Good luck! Try to guess the number. Difficulty: ${difficultySettings[selectedDifficulty].label}`);
    attemptsLabel.textContent = `Attempts: 0 / ${maxAttempts}`;
    guessInput.value = '';
    guessInput.disabled = false;
    submitGuess.disabled = false;
    guessInput.focus();
}

function updateMessage(text, type = '') {
    message.textContent = text;
    message.className = `message ${type}`.trim();
}

function setDifficulty(level) {
    selectedDifficulty = level;
    difficultyButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.difficulty === level);
    });
    startGame();
}

function handleGuess() {
    const guessValue = Number(guessInput.value);

    if (!guessValue || guessValue < 1 || guessValue > maxRange) {
        updateMessage(`Please enter a number from 1 to ${maxRange}.`, 'error');
        return;
    }

    attemptCount += 1;
    attemptsLabel.textContent = `Attempts: ${attemptCount} / ${maxAttempts}`;

    if (guessValue === targetNumber) {
        updateMessage(`Nice! ${targetNumber} was correct. You solved it in ${attemptCount} attempts.`, 'success');
        guessInput.disabled = true;
        submitGuess.disabled = true;
        return;
    }

    if (attemptCount >= maxAttempts) {
        updateMessage(`Game over. The number was ${targetNumber}.`, 'error');
        guessInput.disabled = true;
        submitGuess.disabled = true;
        return;
    }

    if (guessValue < targetNumber) {
        updateMessage('Too low. Try a higher number.', 'error');
    } else {
        updateMessage('Too high. Try a lower number.', 'error');
    }
}

difficultyButtons.forEach((button) => {
    button.addEventListener('click', () => setDifficulty(button.dataset.difficulty));
});

submitGuess.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});
resetButton.addEventListener('click', startGame);

startGame();
