"use strict";

// HTML Objects
const input = document.getElementById('input');
const output = document.getElementById('output');
const solvedCount = document.getElementById('solved-count');
const totalCount = document.getElementById('total-count');
const circle = document.getElementById('riddle-cipher');

// Globals
let currentInput = '';

// Run on page load
function init() {
    console.log('Initialising...');
    input.focus();
    input.addEventListener('keyup', (e) => {
        let entry = sanitize(e.target.value);
        lighten();
        input.value = entry;
        if (currentInput !== entry) {
            console.log('  -- Collecting API response -- ');
            currentInput = entry;
            inputListener(entry);
        }
    });
    loop();
    console.log('Ready.');
}

function sanitize(input) {
    if (typeof input !== 'string' || input.length === 0) {
        return '';
    } else {
        const arr = input.split('');
        const filtered = arr.filter((char) => {
            const charCode = char.charCodeAt(0);
            if (charCode >= 32 && charCode <= 126) {
                return true;
            } else {
                return false;
            }
        });
        let str = filtered.join('');
        if (str.length > 20) {
            str = str.substring(0, 20);
        }
        return str;
    }
}

function lighten() {
    let start = circle.style.backgroundColor;
    if (typeof start === 'string' && start.length > 0) {
        let opacity = start.split(',')[3].substring(0, start.split(',')[3].length - 1);
        opacity = parseFloat(opacity);
        if (opacity < 1) {
            opacity += 0.1;
            if (opacity >= 1) {
                opacity = 0.99;
            }
        } else {
            opacity = 0.99;
        }
        circle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    } else {
        circle.style.backgroundColor = `rgba(255, 255, 255, 0.1)`;
    }
}

function darken(fps) {
    let increment = fps / 100 * 0.01;
    let start = circle.style.backgroundColor;
    if (typeof start === 'string' && start.length > 0) {
        let opacityraw = start.split(',')[3]
        let opacity = opacityraw.substring(0, opacityraw.length - 1);
        opacity = parseFloat(opacity);
        if (opacity > 0) {
            opacity -= increment;
            circle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        }
    } else {
        circle.style.backgroundColor = `rgba(255, 255, 255, 0)`;
    }
}

function inputListener(input) {
    fetchCipher(input)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.output);
            if (data.complete) {
                complete();
            }
            output.textContent = data.output;
            solvedCount.textContent = data.solvedCount;
            totalCount.textContent = data.totalCount;
        })
        .catch((error) => {
            console.log(error);
        });
}

function fetchCipher(input) {
    const data = { input };

    return fetch('/api', {
        credentials: "same-origin",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

function complete() {
    document.getElementById('overlay').style.display = 'flex';
}

function loop() {
    let then = Date.now();
    let now;
    let elapsed;
    let frames = 0;
    let fps = 0;

    function animate() {
        requestAnimationFrame(animate);
        frames++;
        now = Date.now();
        elapsed = now - then;
        then = now;
        darken(fps);
    }

    function initfps() {
        setInterval(() => {
            //console.log('FPS: ', frames);
            fps = frames;
            frames = 0;
        }, 1000);        
    }

    initfps();
    animate();
}

window.onload = init;
