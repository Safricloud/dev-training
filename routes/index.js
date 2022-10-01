'use strict';

const express = require('express');
const router = express.Router();
const { generateHash, encrypt, decrypt } = require('../local_modules/crypto');
let { solvedCount, totalCount, key, winners } = require('../local_modules/vault');

router.all('/*', function (req, res, next) {
    const ip = getIpFromHeaders(req);
    if (req.session.user) {
        // Add IP to session if not already present
        // console.log(req.session.user.ips)
        // console.log(typeof req.session.user.ips)
        req.session.user.ips.push(ip);
        req.session.user.ips = uniq(req.session.user.ips);
        next();
    } else {
        req.session.user = {
            solved: false,
            attemptCount: 0,
            joined: new Date(),
            ips: [ip],
        };
        next();
    }
});

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Riddle', solvedCount, totalCount });
});

router.get('/winners', function (req, res, next) {
    res.render('winners', { title: 'Winners', winners });
});

router.get('/req', function (req, res, next) {
    res.json({ session: JSON.stringify(req.session) });
});

router.post('/api', (req, res) => {
    totalCount++;
    req.session.user.attemptCount++;
    const { input } = req.body;
    console.log(`sessionId: ${req.sessionID}, input: ${input}, attemptCount: ${req.session.user.attemptCount}`);
    if (typeof input === 'string' && input.length > 0) {
        const inputHash = generateHash(input);
        if (inputHash === key) {
            if (winners.filter((item) => item.id === req.sessionID).length === 0) {
                solvedCount++;
                req.session.user.solved = true;
                req.session.user.solvedTime = new Date().toLocaleString();
                req.session.user.attemptsBeforeSolved = req.session.user.attemptCount;
                const winner = { user: req.session.user, id: req.sessionID };
                winners.push(winner);
            }
            res.json({ output: 'We have a WINNER!!!!!!', solvedCount, totalCount, complete: true });
        } else {
            const rounds = Math.ceil(20 / input.length);
            //console.log(decrypt(input, rounds));
            const output = encrypt(input, rounds);
            res.json({ output, solvedCount, totalCount });
        }
    } else {
        res.json({ output: '', solvedCount, totalCount });
    }
});

function getIpFromHeaders(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
}

function uniq(a) {
    return Array.from(new Set(a));
}

module.exports = router;
