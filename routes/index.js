'use strict';

const express = require('express');
const router = express.Router();
const { generateHash, encrypt } = require('../local_modules/crypto');
const rateLimit = require('express-rate-limit');
let { solvedCount, totalCount, key, winners } = require('../local_modules/vault');

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 2000, // Limit each IP to 2000 requests per `window` (here, per 60 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.all('/*', function (req, res, next) {
    const ip = getIpFromHeaders(req);
    if (req.session.user) {
        // Add IP to session if not already present
        // console.log(req.session.user.ips)
        // console.log(typeof req.session.user.ips)
        req.session.user.ips.push(ip);
        req.session.user.ips = uniq(req.session.user.ips);
    } else {
        req.session.user = {
            solved: false,
            attemptCount: 0,
            joined: new Date(),
            ips: [ip],
        };
    }
    next();
});

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Riddle', solvedCount, totalCount });
});

router.get('/winners', function (req, res, next) {
    res.render('winners', { title: 'Winners', winners });
});

router.post('/api', limiter, (req, res) => {
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
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.split(':').length === 2) {
        ip = ip.split(':')[0];
    }
    return ip;
}

function uniq(a) {
    return Array.from(new Set(a));
}

module.exports = router;
