'use strict';

const express = require('express');
const router = express.Router();
const { generateHash, encrypt, decrypt } = require('../local_modules/crypto');
const { winners } = require('../local_modules/vault');

function wrapper(config) {
    const { sessionStore } = config;

    // router.all('/*', function (req, res, next) {
    //     const ip = getIpFromHeaders(req);
    //     if (req.session.user) {
    //         // Add IP to session if not already present
    //         // console.log(req.session.user.ips)
    //         // console.log(typeof req.session.user.ips)
    //         req.session.user.ips.push(ip);
    //         req.session.user.ips = uniq(req.session.user.ips);
    //         next();
    //     } else {
    //         req.session.user = {
    //             solved: false,
    //             attemptCount: 0,
    //             joined: new Date(),
    //             ips: [ip],
    //         };
    //         next();
    //     }
    // });

    router.post('/hash', function (req, res, next) {
        console.log(req.body);
        res.json({ "hash": generateHash(req.body.input) });
    });

    router.get('/winners', function (req, res, next) {
        res.render('winners', { title: 'Winners', winners });
    });

    router.get('/req', function (req, res, next) {
        res.json({ session: JSON.stringify(req.session) });
    });

    router.get('/sessions', function (req, res, next) {
        sessionStore.all((err, sessions) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error getting sessions');
            } else {
                res.json({ sessions });
            }
        });
    });

    return router;
}

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

module.exports = wrapper;
