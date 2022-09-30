console.log('Script started...');

// HTML Objects
const input = document.getElementById('input');
const output = document.getElementById('output');

// Globals
let currentInput = '';

// Run on page load
function init() {
    console.log('Init...');
    // Focus the input field
    input.focus();
    input.addEventListener('keyup', (e) => {
        let entry = sanitize(e.target.value);
        input.value = entry;
        if (currentInput !== entry) {
            console.log('  -- Collecting API response...');
            currentInput = entry;
            inputListener(entry);
        } else {
        }
    });
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

function inputListener(input) {
    fetchCipher(input)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.output);
            if (data.complete) {
                animate();
            }
            output.textContent = data.output;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function fetchCipher(input) {
    const data = { input };

    return fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

function animate(count) {
    document.getElementById('overlay').style.display = 'flex';
}

window.onload = init;
