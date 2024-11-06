let score = parseInt(localStorage.getItem('score')) || 0; // Retrieve the score from localStorage or initialize to 0
const scoreDisplay = document.getElementById('score-value');
scoreDisplay.textContent = score;

const sound = {
    awesome: 'sounds/Awesome.mp3',
    
    excellent: 'sounds/Excellent.mp3',
    good: 'sounds/good.mp3',
    great: 'sounds/great.mp3',
    confetti: 'sounds/congrats.mp3',
    true: 'sounds/true.mp3',
    false_word: 'sounds/false_word.mp3',
    wrong: 'sounds/false.mp3'
};

const dialogues = [
    {
        answer: "True",
        question: "Rolling hills",
        audio: "sound-words/rolling-hills.mp3",
        image: "images/dialog/rolling_hills.jpeg",
    },
    {
        answer: "False",
        question: "Cat",
        audio: "sound-words/cat.mp3",
        image: "images/dialog/under.png",
    },
    {
        answer: "True",
        question: "Dress",
        audio: "sound-words/dress.mp3",
        image: "images/dialog/dress.jpeg",
    },
    {
        answer: "False",
        question: " Face",
        audio: "sound-words/face.mp3",
        image: "images/dialog/sky.jpeg",
    },
    {
        answer: "True",
        question: " Duck",
        audio: "sound-words/duck.mp3",
        image: "images/dialog/ducks.jpeg",
    },
];

const answerButtons = document.querySelectorAll('.answer-btn');
const questionAudio = new Audio();
const wrongAudio = new Audio(sound.wrong);
const gameContainer = document.getElementById('game-container');
const listenButton = document.getElementById('listen-button');

let currentDialogueIndex = 0;
let currentQuestion = 0;
const totalQuestions = dialogues.length;

listenButton.addEventListener('click', () => {
    questionAudio.currentTime = 0;
    questionAudio.play();
});

function stopAudio(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
}

function showNextDialogue() {
    const currentDialogue = dialogues[currentDialogueIndex];

    const questionText = document.getElementById('question-text');
    questionText.textContent = currentDialogue.question;

    questionAudio.src = currentDialogue.audio;

    const questionImage = document.getElementById('question-image');
    questionImage.src = currentDialogue.image;

    questionImage.classList.add('fade-in');

    let playCount = 0;
    function playAudioTwice() {
        if (playCount < 2) {
            questionAudio.currentTime = 0;
            questionAudio.play();
            playCount++;
        }
    }

    questionAudio.addEventListener('ended', playAudioTwice);
    playAudioTwice();
}

function checkAnswer(selectedAnswer) {
    const currentDialogue = dialogues[currentDialogueIndex];

    disableButtons();

    const selectedAudio = selectedAnswer === 'True' ? sound.true : sound.false_word;
    const selectedAnswerAudio = new Audio(selectedAudio);
    selectedAnswerAudio.play();

    selectedAnswerAudio.addEventListener('ended', () => {
        if (selectedAnswer === currentDialogue.answer) {
            score += 1;
            scoreDisplay.textContent = Math.floor(score);

            const soundKeys = Object.keys(sound).filter(key => key !== 'confetti' && key !== 'true' && key !== 'false_word' && key !== 'wrong');
            const randomSoundKey = soundKeys[Math.floor(Math.random() * soundKeys.length)];
            const randomSound = new Audio(sound[randomSoundKey]);

            setTimeout(() => {
                randomSound.play();

                randomSound.addEventListener('ended', () => {
                    createConfetti();
                });
            }, 500); 

            currentDialogueIndex++;
            currentQuestion++;

            if (currentDialogueIndex < dialogues.length) {
                setTimeout(() => {
                    showNextDialogue();
                    setTimeout(enableButtons, 500);
                }, 7000);
            } else {
                setTimeout(() => {
                    transitionToNextPage();
                }, 7000);
            }
        } else {
            wrongAudio.play();

            wrongAudio.addEventListener('ended', () => {
                repeatQuestion();
                enableButtons();
            });
        }
    });
}

function repeatQuestion() {
    questionAudio.currentTime = 0;
    questionAudio.play();
}

function disableButtons() {
    answerButtons.forEach((button) => {
        button.disabled = true;
    });
}

function enableButtons() {
    answerButtons.forEach((button) => {
        button.disabled = false;
    });
}

function transitionToNextPage() {
    localStorage.setItem('score', score); 
    gameContainer.classList.add('stage-transition');
    setTimeout(() => {
        window.location.href = 'exit.html'; 
    }, 2000);
}

answerButtons.forEach((button) => {
    button.addEventListener('click', function() {
        checkAnswer(button.id === 'true-btn' ? 'True' : 'False');
    });
});

showNextDialogue();

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.classList.remove('hidden');

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');

        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        confettiContainer.appendChild(confetti);

        const fallDuration = Math.random() * 1 + 1;
        confetti.style.animationDuration = `${fallDuration}s`;

        setTimeout(() => {
            confetti.remove();
        }, fallDuration * 1000);
    }

    const confettiSound = new Audio(sound.confetti);
    confettiSound.play();
}