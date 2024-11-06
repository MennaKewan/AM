let score = 0;
const scoreDisplay = document.getElementById('score-value');

const sound = {
    awesome: 'sounds/Awesome.mp3',
    excellent: 'sounds/Excellent.mp3',
    good: 'sounds/good.mp3',
    great: 'sounds/great.mp3'
};

const dialogues = [
    {
        answer: "campfire",
        question: "I Love the .....",
        options: ["campfire", "stone"],
        audio: "sounds/love_campfire.mp3",
        answer_audio: "sound-words/campfire-word.mp3",
        WrongAnswer_audio: "sound-words/stone.mp3",
        image: "images/dialog/compfire.jpeg"
    },
    {
        answer: "flowers",
        question: "I love the .....",
        options: ["flowers", "stars"],
        audio: "sounds/love_flowers.mp3",
        answer_audio: "sound-words/flowers.mp3",
        WrongAnswer_audio: "sound-words/stars.mp3",
        image: "images/dialog/flowers.jpeg"
    },
    {
        answer: "Mountains",
        question: "I love the .....",
        options: ["River", "Mountains"],
        audio: "sounds/love_mountain.mp3",
        answer_audio: "sound-words/mountain.mp3",
        WrongAnswer_audio: "sound-words/river.mp3",
        image: "images/dialog/mountains.jpeg"
    },
    {
        answer: "stars",
        question: "the ..... are out",
        options: ["cloud", "stars"],
        audio: "sounds/stars_out.mp3",
        answer_audio: "sound-words/star.mp3",
        WrongAnswer_audio: "sound-words/cloud.mp3",
        image: "images/dialog/stars.jpeg"
    },
    {
        answer: "Rolling hills",
        question: "we play on the .....",
        options: ["Rolling hills", "Desert "],
        audio: "sounds/play_hills.mp3",
        answer_audio: "sound-words/rolling-hills.mp3",
        WrongAnswer_audio: "sound-words/desert.mp3",
        image: "images/dialog/rolling_hills.jpeg"
    }
];

const answerButtons = document.querySelectorAll('.answer-btn');
const questionAudio = document.getElementById('question-audio');
const wrongAudio = document.getElementById('wrong-audio');
const gameContainer = document.getElementById('game-container');
const listenButton = document.getElementById('listen-button');

let currentDialogueIndex = 0;
let currentQuestion = 0;
const totalQuestions = dialogues.length;

let audioContext = new (window.AudioContext || window.webkitAudioContext)();

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

    const questionText = document.getElementById('question-text');
    questionText.textContent = currentDialogue.question;

    answerButtons.forEach((button, index) => {
        button.textContent = currentDialogue.options[index];
    });

    questionAudio.src = currentDialogue.audio;

    const questionImage = document.getElementById('question-image');
    questionImage.src = currentDialogue.image;
    questionImage.classList.add('fade-in');

    let playCount = 0;
    
    async function playAudioTwice() {
        if (playCount < 2) {
            await audioContext.resume();
            questionAudio.currentTime = 0;
            try {
                const playPromise = questionAudio.play();
                if (playPromise !== undefined) {
                    await playPromise;
                    playCount++;
                }
            } catch (error) {
                console.error('Audio playback failed:', error);
            }
        }
    }

    if (sessionStorage.getItem('audioEnabled')) {
        questionAudio.addEventListener('ended', playAudioTwice);
        // Initial play
        audioContext.resume().then(() => {
            playAudioTwice();
        });
    }
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
}

answerButtons.forEach((button) => {
    button.addEventListener('click', function() {
        checkAnswer(button.textContent);
    });
    
});

showNextDialogue();