"use strict";

let crypto;
try {
    crypto = require('node:crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

function generateHash(input) {
    //console.log('Generating hash...');
    //console.log(input);
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
};

function encrypt(input, rounds) {
    for (let i = 0; i < rounds; i++) {
        input = encodeInput(input);
    }
    return input;
}

function decrypt(input, rounds) {
    for (let i = 0; i < rounds; i++) {
        input = decodeInput(input);
    }
    return input;
}

function encodeInput(input) {
    // Char codes to be used 32 - 126, loop around if in excess of 126 or less than 32
    let charCodes = [];
    for (let i = input.length; i > 0; i--) {
        let charCode = input.charCodeAt(i - 1);
        //
        // console.log('Before:')
        // console.log(`Character: ${input[i - 1]} - Code: ${charCode}`);
        charCode += i;
        charCode = range(32, 126, charCode);
        // console.log(`i = ${i}`);
        // console.log('After:')
        // console.log(`Character: ${String.fromCharCode(charCode)} - Code: ${charCode}`);
        charCodes.push(charCode);
    }
    const response = String.fromCharCode(...charCodes);
    return response;
}

function decodeInput(input) {
    let charCodes = [];
    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        charCode -= input.length - i;
        charCode = range(32, 126, charCode);
        charCodes.push(charCode);
    }
    const response = String.fromCharCode(...charCodes)
        .split('')
        .reverse()
        .join('');
    return response;
}

function range(start, end, value) {
    if (value > end) {
        value = start + (value - end + 1);
    } else if (value < start) {
        value = end - (start - 1 - value);
    }
    return value;
}

module.exports.generateHash = generateHash;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;