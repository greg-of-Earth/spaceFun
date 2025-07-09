"use strict";
import { loadQuestions, questions, renderQuiz, timerDisplayReset, stopQuiz, updateHealth } from "./trivia.js";

const statusDisplay = document.getElementById('statusDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const scorecard = document.getElementById('scoreDisplay');


document.querySelectorAll('.console-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.getAttribute('data-content');
        const screen = document.getElementById('screen');

        switch (content) {
            case 'missionStart':
                restartGame(screen);
                break;
            case 'logs': screen.innerHTML = `<h2>Loading Leaderboard...</h2>`;
                break;
            case 'restart': 
                restartGame(screen);
                break;
            case 'exit': 
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

    statusDisplay.innerHTML = 'Engines Engaged';
}


const restartGame = (screen) => {
    stopQuiz();
    screen.innerHTML = `<h2>Lift off in T minus...</h2>`;
    timerDisplayReset();
    scorecard.textContent = "Score: 0";
    updateHealth(3);

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
    }, 6000)
}


const resetHomeScreen = (screen) => {
    setTimeout(() => {
        screen.innerHTML = 
            `<h2>Welcome, Captain</h2>
             <p>Your mission awaits...</p>
            `
    }, 2500);
    timerDisplayReset();
    scorecard.textContent = "Score: 0";
    updateHealth(3);
    statusDisplay.innerHTML = 'Engines Idle';
}