"use strict";

import { initSim } from "./simulator.js";

const render = () => {
    const hash = window.location.hash;
    const hideModal = () => {
        console.log('hiding modal')
        document.getElementById("modal").classList.add('hidden');
    }

    // hide page
    const sections = ['solarSystem-container', 'satellite-sim', 'apod-section', 'trivia-section', 'spaceship-container'];
    sections.forEach(id => hideSection(id));

    hideModal();

    // check which page to render
    if (hash === '#home' || hash === '' || hash === '#') {
        showSection('solarSystem-container');
    } else if (hash === '#satellite-sim') {
        showSection('satellite-sim');
        initSim();
    } else if (hash === '#apod') {   
        showSection('apod-section');
        console.log('calling apod');
        setTimeout(() => loadAPOD(), 0);
    } else if (hash === '#games') {
        showSection('spaceship-container')
    }
    
}

const showSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.style.display = 'block';
};

const hideSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.style.display = 'none';
};


window.addEventListener('hashchange', render);
window.addEventListener('load', render);