"use strict";

const express = require('express');
const router = express.Router();
const { generateHash, encrypt, decrypt } = require('../local_modules/crypto');
let { solvedCount, totalCount, key, winners } = require('../local_modules/vault');

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Riddle', solvedCount, totalCount });
});

router.get('/winners', function (req, res, next) {
    res.render('winners', { title: 'Winners', winners });
});

router.post('/api', (req, res) => {
    totalCount++;
    const { input } = req.body;
    console.log(input);
    if (typeof input === 'string' && input.length > 0) {
        const inputHash = generateHash(input);
        if (inputHash === key) {
            solvedCount++;
            res.json({ output: 'We have a WINNER!!!!!!', solvedCount, totalCount, complete: true });
            winners.push(req.ip);
        } else {
            const rounds = Math.ceil(20 / input.length);
            console.log(decrypt(input, rounds));
            const output = encrypt(input, rounds);
            res.json({ output, solvedCount, totalCount });
        }
    } else {
        res.json({ output: '', solvedCount, totalCount });
    }
});

module.exports = router;
