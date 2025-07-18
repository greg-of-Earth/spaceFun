"use strict"
import { auth, db } from './firebase-init.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const saveHighScore = async (score) => {
    const user = auth.currentUser;
    console.log('user is: ', user);
    let userEmail;
    let userRef;

    if (!user) {
        console.warn("no user signed in, saving to guest");
        userRef = doc(db, "users", "guest");
        userEmail = "guest@funspacefacts";
    } else {
        userRef = doc(db, "users", user.uid)
        userEmail = user.email;
    }

    try {
        const userSnap = await getDoc(userRef);

        // update if new high score
        const existingHighScore = userSnap.exists() ? userSnap.data().highScore || 0 : 0;

        if (score > existingHighScore || !userSnap.exists() || !userSnap.data.email) {
            await setDoc(userRef, { highScore: score, email: userEmail }, { merge: true });
            const screen = document.getElementById('screen');
            screen.innerHTML = '';
            const highScore = document.createElement('h1');
            highScore.innerHTML = `New Personal Record!<br><br> Score: ${score}`;
            highScore.style = "color: lime";
            screen.appendChild(highScore);
            console.log(`high score updated to ${score} for ${userEmail}`);
        } else {
            console.log('not a new high score');
        }
    } catch (error) {
        console.error('Failed to save high score:', error);
    }
};


export let questions = [];

export const loadQuestions = async () => {
    
    try {
        const response = await fetch('questions.json');

        if (!response.ok) {
            throw new Error(`Error loading questions: ${response.status}`);
        }

        questions = await response.json();
        console.log('loaded questions', questions);

        renderQuiz(questions);
    } catch (err) {
        console.error(err);
    }
};

let currentTimeout = null;
let gameInProgress = false;
let timerInterval;

export const renderQuiz = (questions, startIndx = 0, startScore = 0, startTime = 10, startHealth = 3) => {
    const triviaQuesContainer = document.getElementById('trivia-questions-container');
    triviaQuesContainer.innerHTML = ''; // clear current question   

    // check for questions
    if (!questions || questions.length === 0) {
        triviaQuesContainer.innerHTML = '<p>No questions available.</p>';
        return;
    }

    let curIndex = startIndx;
    let score = startScore;
    let health = startHealth;

    gameInProgress = true;    

    // iterate and display question
    const displayQues = (question) => {
        if (!gameInProgress) return; // restart protection
        // clear previous
        timerDisplayReset();
        
        triviaQuesContainer.innerHTML = '';
        
        
        clearInterval(timerInterval); // clear timer

        let timeLeft = startTime;
        // setup timer
        timerSetup(startTime);

        timerInterval = setInterval(() => {
            if (!gameInProgress) return clearInterval(timerInterval);

            timerDisplay.classList.add('pulsing')
            timeLeft--;
            timerDisplay.textContent = `Time left: ${timeLeft}s`;

            // change state if low time
            if (timeLeft <= 3 && timeLeft > -1) {
                timerDisplay.classList.add('low-time');
            }else {
                timerDisplay.classList.remove('low-time');
            }

            // if timer up, next question displays
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                health = wrongAnswer(health, score);
            
                curIndex++;
                if (curIndex < questions.length) {
                    displayQues(questions[curIndex])
                }else {
                    triviaQuesContainer.innerHTML = '<p>Mission completed!</p>'
                    timerDisplayReset();
                    setTimeout(() => {
                        saveHighScore(score);
                    }, 2000);
                }
            }

        }, 1000);

        // question container
        const quesElement = document.createElement('div');
        quesElement.classList.add('trivia-question');

        // create text elements and append question text
        const quesText = document.createElement('h3');
        quesText.textContent = question.question;
        quesElement.appendChild(quesText);

        // answer options are rendered as buttons
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('trivia-option');

            // listen for chosen answer
            button.addEventListener('click', () => {
                button.blur();
                document.activeElement?.blur();
                console.log('blur added');

                clearInterval(timerInterval);

                const allBtns = quesElement.querySelectorAll('button');
                allBtns.forEach(btn => btn.disabled = true);


                if (option === question.answer) {
                    button.classList.add('correct');
                    score++;
                    updateScore(score);
                    
                } else {
                    button.classList.add('incorrect');
                    health = wrongAnswer(health, score);
                   

                    // show correct answer
                    allBtns.forEach(btn => {
                        if (btn.textContent === question.answer) {
                            btn.classList.add('correct');
                        }
                    });
                }

                // set timeout before displaying next question
                setTimeout(() => {
                    curIndex++;
                    if (curIndex < questions.length) {
                        displayQues(questions[curIndex]);
                    } else {
                        triviaQuesContainer.innerHTML = '<p>Mission completed!</p>'
                        timerDisplayReset();
                        setTimeout(() => {
                            saveHighScore(score);
                        }, 2000);
                        
                    }
                }, 1500);
            });
                
            quesElement.appendChild(button);
        });
    
        // display the question 
        triviaQuesContainer.appendChild(quesElement);
        
    }

    displayQues(questions[0]);
    
}

export const updateScore = (score) => {
    const scorecard = document.getElementById('scoreDisplay');
    scorecard.textContent = `Score: ${score}`;
} 

export const timerSetup = (startTime) => {
    // setup timer
    var timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.classList.add('activeTimer');
    
    timerDisplay.textContent = `Time left: ${startTime}s`;
}

export const timerDisplayReset = () => {
    clearInterval(timerInterval);
    timerDisplay.classList.remove('pulsing');
    timerDisplay.classList.remove('low-time');
    timerDisplay.classList.remove('activeTimer');
    timerDisplay.textContent = "Timer";
}

export const stopQuiz = () => {
    clearInterval(timerInterval);
    clearTimeout(currentTimeout);
    gameInProgress = false;
  
}

export const updateHealth = (health, score) => {
    const healthBar = document.getElementById('healthBar');
    const percentage = (health / 3) * 100;
    if (window.innerWidth <= 768) {
        healthBar.style.width = `${percentage}%`;
    } else {
        healthBar.style.height = `${percentage}%`;
    }
    

    if (health === 0) {
        const screen = document.getElementById('screen');
        screen.innerHTML = '';
        const gameOver = document.createElement('h1');
        gameOver.innerHTML = 'Maximum Damage Sustained.<br><br> Game Over.';
        gameOver.style = "color: red";
        screen.appendChild(gameOver);
        setTimeout(() => {
            saveHighScore(score);
        }, 2000);
        stopQuiz();
    }
}

const wrongAnswer = (health, score) => {
    const spaceship = document.getElementById('spaceship');
    spaceship.classList.add('shake');

    spaceship.addEventListener('animationend', () => {
        spaceship.classList.remove('shake');
    }, { once: true });

    const newHealth = Math.max(0, health - 1);
    updateHealth(newHealth, score);
    return newHealth
}