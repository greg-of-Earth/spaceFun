"use strict"

// import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';
  
  // Manually register the components
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  


const MAX_DATA_PTS = 20;
let charts = {};
let telemInterval;

// update and add new data
const addData = (chart, value) => {
    const now = new Date().toLocaleTimeString();

    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(value);

    if (chart.data.labels.length > MAX_DATA_PTS) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}

// simulate temp data
const getTemp = () => {
    return 20 + Math.random() * 10;
}

// simulate altitude
const getAlt = () => {
    return 400 + Math.random() * 10;
}

// simulate radiation
const getRadiation = () => {
    return 1 + Math.random() * 3;
}

// simulate battery
const getBattery = () => {
    return 50 + Math.random() * 50;
}


// setup graph
const createChart = (id, label, color) => {
    const context = document.getElementById(id).getContext('2d');
    return new Chart(context, {
        type: 'line', 
        data: {
            labels: [],
            datasets: [{
                label, 
                data: [],
                borderColor: color,
                backgroundColor: color + '33',
                tensio: 0.3,
                fill: true,
                pointRadius: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 10
                    }
                }
            },
            animation: false
        }
    });
}


// log telemetry
const telemLog = (msg) => {
    const logOutput = document.getElementById('logOutput');
    if (!logOutput) return;
    const logEntry = document.createElement('div');
    
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    
    logOutput.insertBefore(logEntry, logOutput.firstChild)
    logOutput.scrollTop = logOutput.scrollHeight;
}


export const initSim = () => {
    if (telemInterval) clearInterval(telemInterval);

    charts = {
        temps: createChart('tempGraph', 'Temperature (°C)', 'orange'),
        alts: createChart('altitudeGraph', 'Altitude (km)', 'skyblue'),
        rad: createChart('radiationGraph', 'Radiation (mSv)', 'violet'),
        btry: createChart('batteryGraph', 'Battery (%)', 'limegreen')
    }
    
    
    // get data every second
    telemInterval = setInterval(() => {
        const newTemp = getTemp();
        const newAlt = getAlt();
        const newRad = getRadiation();
        const newBtry = getBattery();
    
        addData(charts.temps, newTemp);
        addData(charts.alts, newAlt);
        addData(charts.rad, newRad);
        addData(charts.btry, newBtry);
    
        telemLog(`Temp: ${newTemp.toFixed(1)} °C, Alt: ${newAlt.toFixed(1)} km, Rad: ${newRad.toFixed(1)} mSv, Batt: ${newBtry.toFixed(0)}%`)
    }, 1000);
}
