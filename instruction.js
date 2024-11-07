let score = 0;
const scoreDisplay = document.getElementById('game-score-value');

const sound = {
    awesome: 'sounds/Awesome.mp3',
    excellent: 'sounds/Excellent.mp3',
    good: 'sounds/good.mp3',
    great: 'sounds/great.mp3'
};

const dialogues = [
    {
        answer: "One",
        question: "How Many Claps ?",
        audio: [ "sounds/how many claps.mp3", "sounds/how many time arabic sound.mp3" ,"sounds/one clap.wav"],
        options: ["Two", "One"],
        answer_audio: ["sounds/One.mp3"],
        WrongAnswer_audio: "sounds/two.mp3"
    },
    {
        answer: "Two",
        question: "How Many Claps ?",
        options: ["Two", "Three"],
        audio: [ "sounds/how many claps.mp3", "sounds/how many time arabic sound.mp3", "sounds/two-claps-96256.mp3"],
        answer_audio: ["sounds/two.mp3"],
        WrongAnswer_audio: "sounds/three.mp3"
    },
    {
        answer: "Four",
        question: "How Many Claps ?",
        options: ["Three", "Four"],
        audio: [ "sounds/how many claps.mp3","sounds/how many time arabic sound.mp3","sounds/four claps.wav"],
        answer_audio: "sounds/four.mp3",
        WrongAnswer_audio: "sounds/three.mp3"
    }
];

const answerButtons = document.querySelectorAll('.game-answer-btn');
const questionAudio = document.getElementById('game-question-audio');
const wrongAudio = document.getElementById('game-wrong-audio');
const gameContainer = document.getElementById('game-container');
const listenButton = document.getElementById('game-listen-button');
const instructionsContainer = document.getElementById('instructions-container');
const playButton = document.getElementById('startBtn');
const audioElement = document.getElementById('instruction-audio');

let currentDialogueIndex = 0;
let currentQuestion = 0;
const totalQuestions = dialogues.length;

let audioContext = new (window.AudioContext || window.webkitAudioContext)();

playButton.addEventListener('click', function() {
    audioContext.resume().then(() => {
        audioElement.play();
    });
    playButton.style.display = 'none';
    document.getElementById('start-container').style.display = 'none';
    instructionsContainer.style.display = 'block';
});

audioElement.onended = function() {
    instructionsContainer.style.display = 'none';
    gameContainer.style.display = 'flex';
    showNextDialogue();
};

listenButton.addEventListener('click', () => {
    audioContext.resume().then(() => {
        questionAudio.currentTime = 0;
        questionAudio.play();
    });
});

function stopAudio(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
}

function showNextDialogue() {
    const currentDialogue = dialogues[currentDialogueIndex];

    const questionText = document.getElementById('game-question-text');
    questionText.textContent = currentDialogue.question;

    answerButtons.forEach((button, index) => {
        button.textContent = currentDialogue.options[index];
    });

    const questionImage = document.getElementById('game-question-image');
    questionImage.style.display = 'none'; 

    let playCount = 0;

    function playAudioTwice(audioSrc, callback) {
        questionAudio.src = audioSrc;
        questionAudio.currentTime = 0;
        questionAudio.play();

        questionAudio.onended = function() {
            playCount++;
            if (playCount < 2) {
                questionAudio.currentTime = 0;
                questionAudio.play();
            } else {
                playCount = 0;
                callback();
            }
        };
    }

    function playAudioSequence() {
        playAudioTwice(currentDialogue.audio[0], () => {
            playAudioTwice(currentDialogue.audio[1], () => {
                // تشغيل الصوت الثالث مرة واحدة فقط
                questionAudio.src = currentDialogue.audio[2]; // الصوت الثالث
                questionAudio.currentTime = 0;
                questionAudio.play();
                questionAudio.onended = null; // عدم تكرار الصوت الثالث
            });
        });
    }

    audioContext.resume().then(() => {
        playAudioSequence();
    });
}



function checkAnswer(selectedAnswer) {
    const currentDialogue = dialogues[currentDialogueIndex];

    disableButtons();

    if (selectedAnswer.trim().toLowerCase() === currentDialogue.answer.trim().toLowerCase()) {
        score += 1;
        scoreDisplay.textContent = Math.floor(score);

        setTimeout(() => {
            const correctAnswerAudio = new Audio(currentDialogue.answer_audio);
            correctAnswerAudio.play();
        
            correctAnswerAudio.addEventListener('ended', () => {
                setTimeout(() => {
                    const soundKeys = Object.keys(sound);
                    const randomSoundKey = soundKeys[Math.floor(Math.random() * soundKeys.length)];
                    const randomSound = new Audio(sound[randomSoundKey]);
                    randomSound.play();
                           
                    randomSound.addEventListener('ended', () => {
                        const confettiSound = new Audio('sounds/congrats.mp3');
                        confettiSound.play();
                        createConfetti();
                    });
                }, 500);
            });
        }, 1);
        
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
        setTimeout(() => {
            const wrongAnswerAudio = new Audio(currentDialogue.WrongAnswer_audio);
            wrongAnswerAudio.play();

            wrongAnswerAudio.addEventListener('ended', () => {
                wrongAudio.play();

                wrongAudio.addEventListener('ended', () => {
                    repeatQuestion();
                    enableButtons();
                });
            });
        }, 1);
    }
}

function repeatQuestion() {
    audioContext.resume().then(() => {
        questionAudio.currentTime = 0;
        questionAudio.play();
    });
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
        window.location.href = 'instruction2.html';
    }, 2000);
}

function createConfetti() {
    const confettiContainer = document.getElementById('game-confetti');
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
}

answerButtons.forEach((button) => {
    button.addEventListener('click', function() {
        checkAnswer(button.textContent);
    });
});
