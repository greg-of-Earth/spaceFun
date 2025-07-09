"use strict";

document.getElementById('menu-toggle').addEventListener('click', () => {
    const menu = document.getElementById('menu-container');
    menu.classList.toggle('open');
})

const canvas = document.getElementById("solarSystem");
const context = canvas.getContext('2d');

// fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// get center
const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;

// check for window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawSun();
    drawPlanets();
});

// wire apod button 
window.addEventListener('load', () => {
    document.getElementById('apod-button').addEventListener('click', () => {
        if (data) {
            showModal(data.title, data.explanation);
        }
    });
});


// draw the sun in center
const drawSun = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(centerX(), centerY(), 60, 0, Math.PI * 2); 
    context.fillStyle = "yellow";
    context.shadowBlur = 20;
    context.shadowColor = "yellow";
    context.fill();
    context.shadowBlur = 0;
}

const earthSpeed = .00075
const maxCanvasRadius = Math.min(canvas.width, canvas.height) * 0.7;

const minGap = 40;
const maxGap = maxCanvasRadius - minGap;

// array of planets 
let planets = []

// fetch info from json
const loadSystem = async () => {
    try {
        const response = await fetch('system.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        planets = data.map(p => ({
            ...p,
            speed: earthSpeed * p.speed,
        }));
        animate();
    } catch (err) {
        console.error('Error loading planet data:', err);
    }
};

loadSystem();


const drawPlanets = () => {
    planets.forEach(planet => {
        // distance
        planet.distance = minGap + Math.pow(planet.ratio, 0.6) * maxGap; // nonlinear spacing
        // change angle
        planet.angle -= planet.speed;

        // planets position
        const x = centerX() + planet.distance * Math.cos(planet.angle);
        const y = centerY() + planet.distance * 0.95 * Math.sin(planet.angle);

        // attach postion for clicking
        planet.screenX = x;
        planet.screenY = y;

        // draw orbital
        context.beginPath();
        context.strokeStyle = "rgba(255, 255, 255, 0.1)";
        context.arc(centerX(), centerY(), planet.distance, 0, Math.PI * 2);
        context.stroke();

        // draw planet
        context.beginPath();
        context.arc(x, y, planet.radius, 0, Math.PI * 2);
        context.fillStyle = planet.color;
        context.fill();

    });
}


// animate the planets
const animate = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSun();
    drawPlanets();
    requestAnimationFrame(animate);
};


// get planet position when it is clicked on
const planetClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    checkPlanetClick(mouseX, mouseY);
};

// check if planet is clicked on 
const checkPlanetClick = (mouseX, mouseY) => {
    planets.forEach(planet => {
        const dx = mouseX - planet.screenX;
        const dy = mouseY - planet.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // if planet clicked on show the modal
        if (distance <= planet.radius) {
            showModal(planet.name, planet.description);
            console.log('clicked me', planet);
        }
    });
}

// set a event listener on the planets
canvas.addEventListener('click', planetClick);

// show the modal 
const showModal = (titleText, bodyText) => {
    const modal = document.getElementById("modal");
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = titleText;
    body.textContent = bodyText;

    modal.classList.remove('hidden');
}


document.getElementById('apod-button').addEventListener('click', () => {
    if (data) {
        showModal(data.title, data.explanation);
    }
});

// close the modal 
document.getElementById('close').addEventListener('click', () => {
    document.getElementById("modal").classList.add('hidden');
});