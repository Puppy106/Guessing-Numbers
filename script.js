const guessInput = document.getElementById('guessInput');
const submitGuess = document.getElementById('submitGuess');
const resetButton = document.getElementById('resetButton');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');
const musicToggle = document.getElementById('musicToggle');
const backgroundColorInput = document.getElementById('backgroundColorInput');
const rangeMaxInput = document.getElementById('rangeMaxInput');
const endGameButton = document.getElementById('endGameButton');
const message = document.getElementById('message');
const attemptsLabel = document.getElementById('attempts');
const difficultyButtons = document.querySelectorAll('.difficulty-button');

const difficultySettings = {
    easy: { maxAttempts: 15, label: 'Easy' },
    medium: { maxAttempts: 10, label: 'Medium' },
    hard: { maxAttempts: 5, label: 'Hard' }
};

let maxRange = 100;
let targetNumber;
let attemptCount;
let selectedDifficulty = 'easy';
let maxAttempts;
let audioContext;
let musicGain;
let musicInterval;
let isMusicPlaying = false;
const melody = [440, 494, 523, 587, 659, 587, 523, 494];
let melodyIndex = 0;

function startGame() {
    targetNumber = Math.floor(Math.random() * maxRange) + 1;
    attemptCount = 0;
    maxAttempts = difficultySettings[selectedDifficulty].maxAttempts;

    guessInput.max = maxRange;
    updateMessage(`Good luck! Try to guess the number from 1 to ${maxRange}. Difficulty: ${difficultySettings[selectedDifficulty].label}`);
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

function createAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        musicGain = audioContext.createGain();
        musicGain.gain.value = 0.08;
        musicGain.connect(audioContext.destination);
    }
}

function playNote(frequency, duration = 0.36) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(musicGain);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function startMusic() {
    createAudioContext();
    isMusicPlaying = true;
    musicToggle.textContent = 'Pause Music';
    if (musicInterval) {
        clearInterval(musicInterval);
    }
    musicInterval = setInterval(() => {
        playNote(melody[melodyIndex % melody.length]);
        melodyIndex += 1;
    }, 450);
}

function stopMusic() {
    isMusicPlaying = false;
    musicToggle.textContent = 'Play Music';
    clearInterval(musicInterval);
    musicInterval = null;
}

function setBackgroundColor(color) {
    document.body.style.background = color;
}

function setMaxRange(value) {
    const newMax = Number(value);
    if (Number.isInteger(newMax) && newMax >= 10 && newMax <= 1000) {
        maxRange = newMax;
        startGame();
    }
}

function endGame() {
    updateMessage(`Game ended. The number was ${targetNumber}.`, 'error');
    guessInput.disabled = true;
    submitGuess.disabled = true;
}

function toggleMusic() {
    if (!audioContext) {
        createAudioContext();
    }
    if (isMusicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
}

backgroundColorInput.addEventListener('input', (event) => {
    setBackgroundColor(event.target.value);
});

rangeMaxInput.addEventListener('input', (event) => {
    setMaxRange(event.target.value);
});

window.addEventListener('load', () => {
    setBackgroundColor(backgroundColorInput.value);
    rangeMaxInput.value = maxRange;
});

difficultyButtons.forEach((button) => {
    button.addEventListener('click', () => setDifficulty(button.dataset.difficulty));
});

function openSettings() {
    settingsPanel.classList.add('open');
    settingsPanel.setAttribute('aria-hidden', 'false');
}

function closeSettingsPanel() {
    settingsPanel.classList.remove('open');
    settingsPanel.setAttribute('aria-hidden', 'true');
}

settingsToggle.addEventListener('click', openSettings);
closeSettings.addEventListener('click', closeSettingsPanel);

submitGuess.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});
resetButton.addEventListener('click', startGame);
musicToggle.addEventListener('click', toggleMusic);
endGameButton.addEventListener('click', endGame);

startGame();
