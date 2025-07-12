"use strict";

let data = null

// fetch apod
const loadAPOD = async () => {
    const cached = localStorage.getItem('apodData');
    if (cached) {
        const parsed = JSON.parse(cached);
        

        if (parsed.date === new Date().toISOString().split('T')[0]) {
            data = parsed;
            console.log('cache data:', data);
            updateAPODDisplay(data);
            return data;
        }
        
    }
   
    try {
        const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=ruxyHCL7MmGlY7hBL7JyQYgaCHCtEFmVxqouMHaD';

        // fetch data
        const response = await fetch(apiUrl);
        // check we got good response
        if (!response.ok) {
            throw new Error(`http request failed. status: ${response.status}`);
        }
        // good respose so load up data
        data = await response.json();
        console.log('new apod data:', data);

        localStorage.setItem('apodData', JSON.stringify(data));
        
        // render image and info
        updateAPODDisplay(data);

        return data;

    } catch (err) {
        console.error('Error fetching APOD:', err);
        throw err;
    }
};

const updateAPODDisplay = (data) => {
    // set title and description
    document.getElementById('apod-image-title').textContent = data.title;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-body').textContent = data.explanation;
    console.log('setting apod')

    // set image
    const img = document.getElementById('apod-image');
    const loader = document.getElementById('loading');
    loader.classList.remove('hidden');

    if (data.media_type === 'image') {
        img.style.display = 'block';
        img.onload = () => {
            img.style.display = 'block';
            loader.classList.add('hidden');
        }
        img.src = data.url;
        
    } else {
        img.style.display = 'none';
        loader.classList.add('hidden');
    }
};