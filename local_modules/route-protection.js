const {basicAuth: { username: BAUser, password: BAPass }} = require('../local_modules/vault');
const { safeCompare } = require('express-basic-auth');
const { generateHash } = require('../local_modules/crypto');

module.exports = (username, password) => {
    const userMatches = safeCompare(generateHash(username), BAUser);
    const passwordMatches = safeCompare(generateHash(password), BAPass);
    return userMatches && passwordMatches;
};
