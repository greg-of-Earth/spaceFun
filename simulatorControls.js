"use strict";

import { initSim, stopSim, isSimRunning, clearOldCharts } from './simulator.js';

let isSimPaused = false;
let isSignalLost = false;

document.getElementById('startSim').addEventListener('click', () => {
    initSim();
    isSimPaused = false;
});

document.getElementById('pauseSim').addEventListener('click', () => {
    if (isSimRunning()) {
        stopSim();
        isSimPaused = true;
    }
});

document.getElementById('resetSim').addEventListener('click', (charts) => {
    stopSim();
    isSimPaused = false;

    // Reset charts and log
    clearOldCharts(charts);
    const logOutput = document.getElementById('logOutput');
    logOutput.innerHTML = '';

    document.querySelectorAll('canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});

document.getElementById('signalToggle').addEventListener('click', () => {
    isSignalLost = !isSignalLost;

    if (isSignalLost) {
        stopSim();
        document.getElementById('signalToggle').textContent = 'Restore Signal';
    } else {
        initSim();
        document.getElementById('signalToggle').textContent = 'Signal Loss';
    }
});

document.getElementById('pingSatellite').addEventListener('click', () => {
    const logOutput = document.getElementById('logOutput');
    const msg = document.createElement('div');
    msg.textContent = `[${new Date().toLocaleTimeString()}] Pinging satellite...`;
    logOutput.insertBefore(msg, logOutput.firstChild);

    setTimeout(() => {
        const result = document.createElement('div');
        const success = Math.random() > 0.2;
        result.textContent = `[${new Date().toLocaleTimeString()}] ${success ? "Satellite responded." : "Ping failed."}`;
        logOutput.insertBefore(result, logOutput.firstChild);
    }, 500);
});
