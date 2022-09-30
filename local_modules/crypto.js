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

module.exports.generateHash = generateHash;