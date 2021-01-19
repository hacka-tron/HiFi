const CORS_BYPASS_URL = 'https://cors-anywhere.herokuapp.com/';
const ACCESS_KEY = '19afeb2ffaf61853898eaa82b3ceea79';

var COUNTRY;
getUserCountry().then(country => {
    COUNTRY = country;
})
async function makeHifi() {
    console.log(COUNTRY);
    const status = document.getElementById('status');
    status.style.display = 'block';
    status.innerHTML = 'Waiting for High 5...';
    const response = await postData('https://hacka-tron--hifi.herokuapp.com/api/hifi', { country: COUNTRY });
    status.innerHTML = `Someone in ${response.country} high fived you back!`;
}

async function getUserCountry() {
    const ip = await fetch(`${CORS_BYPASS_URL}https://checkip.amazonaws.com/`).then(res => res.text());
    const country = await fetch(`${CORS_BYPASS_URL}http://api.ipstack.com/${ip}?access_key=${ACCESS_KEY}`).then(res =>
        res.json()).then(data => data.country_name);
    return country;
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}