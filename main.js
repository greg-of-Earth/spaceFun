"use strict";

document.getElementById('menu-toggle').addEventListener('click', () => {
    const menu = document.getElementById('menu-container');
    menu.classList.toggle('open');
})

const canvas = document.getElementById("solarSystem");
const context = canvas.getContext('2d');

const navbarHeight = navbar ? navbar.offsetHeight : 0;

document.body.style.overflow = 'hidden';


// fill the window
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // canvas.height = window.innerHeight - navbarHeight;
} 

// document.getElementById('apod-button').addEventListener('click', () => {
//     if (data) {
//         showModal(data.title, data.explanation);
//     }
// });

// get center
const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    drawSun();
    drawPlanets();
});

let zoomFactor = 1;
let targetZoom = 1;
const minZoom = 0.5;
const maxZoom = 4;
const zoomStep = 0.2;


let sun = null;
const getSunRadius = () => {
    return Math.max(20, Math.min(canvas.width, canvas.height) * 0.05) * Math.sqrt(zoomFactor);
} 

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

        sun = data[0]; 

        planets = data.slice(1).map(p => ({
            ...p,
            speed: earthSpeed * p.speed,
        }));
        animate();
    } catch (err) {
        console.error('Error loading planet data:', err);
    }
};

loadSystem();


// draw the sun in center
const drawSun = () => {
    // context.clearRect(0, 0, canvas.width, canvas.height);

    const sunRadius = getSunRadius();

    sun.screenX = centerX();
    sun.screenY = centerY();
    
    context.beginPath();
    context.arc(sun.screenX, sun.screenY, sunRadius, 0, Math.PI * 2); 
    context.fillStyle = "yellow";
    context.shadowBlur = 25;
    context.shadowColor = "yellow";
    context.fill();
    context.shadowBlur = 0;

    // return sunRadius;
}

const earthSpeed = .00075

const isMobile = window.innerWidth <= 768;
const maxCanvasRadius = Math.min(canvas.width, canvas.height) * (isMobile ? 0.4 : 0.7);

const minGap = 40;
const maxGap = maxCanvasRadius - minGap;


const drawPlanets = (sunRadius) => {
    const sizeScale = Math.min(canvas.width, canvas.height) / 800;

    planets.forEach(planet => {
        // distance
        planet.distance = Math.max(30, zoomFactor * (minGap + Math.pow(planet.ratio, 0.6) * maxGap));

        const zoomSizeMultiplier = 1 + (1 - planet.ratio) * (zoomFactor - 1) * 1;

        planet.radius = sunRadius * 0.1 * sizeScale * planet.sizeRatio * zoomSizeMultiplier;

        planet.angle -= planet.speed / Math.pow(zoomFactor, 1.5);

        // planets position
        const x = centerX() + planet.distance * Math.cos(planet.angle);
        const y = centerY() + planet.distance * 0.95 * Math.sin(planet.angle);

        // attach postion for clicking
        planet.screenX = x;
        planet.screenY = y;

        // draw orbital
        context.beginPath();
        context.strokeStyle = "rgba(255, 255, 255, 0.001)";
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
    // smooth zoom
    zoomFactor += (targetZoom - zoomFactor) * 0.1;

    context.fillStyle = 'rgba(0, 0, 0, 0.07)'; // orbit trail
    context.fillRect(0, 0, canvas.width, canvas.height);

    // context.clearRect(0, 0, canvas.width, canvas.height);
    drawSun();
    const sunRadius = getSunRadius();
    drawPlanets(sunRadius);
    requestAnimationFrame(animate);
};


const clickBuffer = isMobile ? 25 : 10;


const handleCanvasClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const sunRadius = getSunRadius();

    if (isClickOnSun(mouseX, mouseY, sunRadius)) {
        showModal(sun.name, sun.description);
    }

    planets.forEach(planet => {
        const dx = mouseX - planet.screenX;
        const dy = mouseY - planet.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= planet.radius + clickBuffer) {
            showModal(planet.name, planet.description);
            console.log('clicked me', planet);
            return;
        }
    });
}

const isClickOnSun = (mouseX, mouseY, sunRadius) => {
    const dx = mouseX - centerX();
    const dy = mouseY - centerY();
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= sunRadius + clickBuffer;
}

canvas.addEventListener("click", handleCanvasClick);

// get planet position when it is clicked on
// const planetClick = (event) => {
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = isMobile ? event.clientY - rect.top - navbarHeight : event.clientY - rect.top

//     checkPlanetClick(mouseX, mouseY);
// };

// const clickBufferScaled = clickBuffer * zoomFactor;

// check if planet is clicked on 
// const checkPlanetClick = (mouseX, mouseY) => {
//     planets.forEach(planet => {
//         const dx = mouseX - planet.screenX;
//         const dy = mouseY - planet.screenY;
//         const distance = Math.sqrt(dx * dx + dy * dy);
//         // if planet clicked on show the modal
//         if (distance <= planet.radius + clickBuffer) {
//             showModal(planet.name, planet.description);
//             console.log('clicked me', planet);
//         }
//     });
// }

// check if planet is clicked on 
// const checkSunClick = (mouseX, mouseY, sunRadius) => {      
//     const dx = mouseX - sun.screenX;
//     const dy = mouseY - sun.screenY;
//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance <= sunRadius + clickBuffer) {
//         showModal(sun.name, sun.description);
//         console.log('clicked me', sun);
//     }
// }

// const sunClick = (event) => {
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = isMobile ? event.clientY - rect.top - navbarHeight : event.clientY - rect.top

//     const sunRadius = Math.max(20, Math.min(canvas.width, canvas.height) * 0.05) * Math.sqrt(zoomFactor);

//     checkSunClick(mouseX, mouseY, sunRadius);
// };


canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let hoveringPlanet = false;

    planets.forEach(planet => {
        const dx = mouseX - planet.screenX;
        const dy = mouseY - planet.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // if planet clicked on show the modal
        if (distance <= planet.radius + clickBuffer) {
            hoveringPlanet = true;
        }
    });
    canvas.style.cursor = hoveringPlanet ? 'pointer' : 'default';
});

canvas.addEventListener('touchend', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = isMobile ? e.clientY - rect.top - navbarHeight : e.clientY - rect.top;
    const sunRadius = getSunRadius();

    // checkPlanetClick(mouseX, mouseY);
    // checkSunClick(mouseX, mouseY, sunRadius);

    if (isClickOnSun(mouseX, mouseY, sunRadius)) {
        showModal(sun.name, sun.description);
        return;
    }

    planets.forEach(planet => {
        const dx = mouseX - planet.screenX;
        const dy = mouseY - planet.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= planet.radius + clickBuffer) {
            showModal(planet.name, planet.description);
            return;
        }
    });
})

const updateZoomButtons = () => {
    document.getElementById('zoomInToggle').style.opacity = zoomFactor >= maxZoom ? '0.5' : '1';
    document.getElementById('zoomOutToggle').style.opacity = zoomFactor <= minZoom ? '0.5' : '1';

    document.getElementById('zoomInToggle').style.pointerEvents = zoomFactor >= maxZoom ? 'none' : 'auto';
    document.getElementById('zoomOutToggle').style.pointerEvents = zoomFactor <= minZoom ? 'none' : 'auto';

}

// set a event listener on the planets
// canvas.addEventListener('click', planetClick);
// canvas.addEventListener('click', sunClick);

// show the modal 
const showModal = (titleText, bodyText) => {
    const modal = document.getElementById("modal");
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = titleText;
    body.textContent = bodyText;

    modal.classList.remove('hidden');
}


// close the modal 
document.getElementById('close').addEventListener('click', () => {
    document.getElementById("modal").classList.add('hidden');
});

window.addEventListener('load', () => {
    document.getElementById('apod-button').addEventListener('click', () => {
        if (data) {
            showModal(data.title, data.explanation);
        }
    });
});

document.getElementById('zoomInToggle').addEventListener('click', () => {
    targetZoom = Math.min(maxZoom, targetZoom + zoomStep);
    updateZoomButtons();
});

document.getElementById('zoomOutToggle').addEventListener('click', () => {
    targetZoom = Math.max(minZoom, targetZoom - zoomStep);
    updateZoomButtons();
});