"use strict";
import { loadQuestions, questions, renderQuiz, timerDisplayReset, stopQuiz, updateHealth } from "./trivia.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { auth } from './firebase-init.js';
import { logOut } from "./auth.js";




// const statusDisplay = document.getElementById('statusDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const scorecard = document.getElementById('scoreDisplay');

const logInBtn = document.getElementById('logInBtn');

const startBtn = document.getElementById('startBtn');
const logsBtn = document.getElementById('logsBtn');
const restartBtn = document.getElementById('restartBtn');
const exitBtn = document.getElementById('exitBtn');

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        logInBtn.textContent = "Log Out";
        logInBtn.setAttribute('data-content', 'LogOut');
        console.log("User signed in:", user.email);
    } else {
        logInBtn.textContent = "Log In";
        logInBtn.setAttribute('data-content', 'LogIn');
        console.log("No user is signed in.");
    }
});

document.querySelectorAll('.console-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.getAttribute('data-content');
        const screen = document.getElementById('screen');

        switch (content) {
            // no logged in show modal
            case 'LogIn':
                console.log('trying to log in. status is currently: ')
                document.getElementById('authModal').classList.remove('hidden');
                btn.setAttribute('data-content', 'LogOut');
                btn.textContent = 'Log Out';
                
                break;
            // tryin to logout
            case 'LogOut':
                console.log('trying to log out. status is currently: ')
                logOut();
                btn.setAttribute('data-content', 'LogIn');
                btn.textContent = 'Log In';
                break;
            case 'missionStart':
                restartGame(screen);
                break;
            case 'logs': 
                screen.innerHTML = `<h2>Loading Leaderboard...</h2>`;
                logsBtn.classList.add('disabled');
                exitBtn.classList.remove('disabled');
                break;
            case 'restart': 
                restartGame(screen);
                break;
            case 'exit': 
                document.querySelectorAll('.console-btn').forEach(disBtn => {
                    disBtn.classList.add('disabled');
                })
                screen.innerHTML = `<h2>Shutting down systems...</h2>`;
                resetHomeScreen(screen);
                break;
            default:
                screen.innerHTML = `<h2>${content}</h2><p>Loading ${content} module...</p>`;
        }
    });
});

const loadGame = async (screen) => {
    screen.innerHTML = 
        `<div id="trivia-section" class="hidden">
            <section id="trivia-questions-timed">
                <div id="trivia-questions-container"></div>
            </section>
        </div> `;

    
    if (questions.length === 0) {
        await loadQuestions();

    }

    if (!document.getElementById('timerDisplay')) {
        const timerPara = document.createElement('p');
        timerPara.id = 'timer';
        timerDisplay.appendChild(timerPara);
    }

    // statusDisplay.innerHTML = 'Engines Engaged';
}


const restartGame = (screen) => {
    stopQuiz();
    screen.innerHTML = `<h2>Lift off in T minus...</h2>`;
    timerDisplayReset();
    scorecard.textContent = "Score: 0";
    updateHealth(3);

    startBtn.classList.add('disabled');
    logsBtn.classList.add('disabled');
    restartBtn.classList.add('disabled');

    // statusDisplay.innerHTML = 'Engines Idle';

    const countdown = document.createElement('p');
    countdown.id = 'countdown';
    countdown.textContent = '5';
    screen.appendChild(countdown);
    
    let countdownTime = 5;
    const cntDwnInterval = setInterval(() => {
        countdownTime--;
        countdown.textContent = countdownTime;

        if (countdownTime === 0) {
            clearInterval(cntDwnInterval);
            countdown.remove();
            screen.innerHTML = '';
            const heading = document.createElement('h1');
            heading.id = 'launchHeading';
            heading.textContent = 'Lift off!!';
            screen.appendChild(heading);
        }
    }, 1000);   

    setTimeout(async () => {
        await loadGame(screen);
        renderQuiz(questions);
        restartBtn.classList.remove('disabled');
        exitBtn.classList.remove('disabled');
        // statusDisplay.innerHTML = 'Engines Engaged';
    }, 6000)
}


const resetHomeScreen = (screen) => {

    setTimeout(() => {
        screen.innerHTML = 
            `<h2>Welcome, Captain</h2>
             <p>Your mission awaits...</p>
            `
        startBtn.classList.remove('disabled');
        logsBtn.classList.remove('disabled');
        logInBtn.classList.remove('disabled');
        
    }, 2500);
    timerDisplayReset();
    scorecard.textContent = "Score: 0";
    updateHealth(3);
    // statusDisplay.innerHTML = 'Engines Idle';
}