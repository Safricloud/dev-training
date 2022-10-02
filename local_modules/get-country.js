'use strict';

function fetchCountry(ip) {
    return new Promise((resolve, reject) => {
        fetch(`http://ipwho.is/${ip}`, {
            method: 'GET',
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.hasOwnProperty('country')) {
                    resolve({ name: data.country, code: data.country_code, flag: generateFlagURL(data.country_code) });
                } else {
                    console.log(data);
                    resolve('Unknown');
                }
            })
            .catch(function (error) {
                console.log(error);
                reject(error);
            });
    });
}

function generateFlagURL(countryCode) {
    return `https://www.countryflagsapi.com/png/${countryCode}`;
}

module.exports = fetchCountry;