const fetch = require('node-fetch');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

const cellTowers = [];

fs.createReadStream(path.join(__dirname, 'cell_towers.csv'))
    .pipe(csv())
    .on('data', (row) => {
        cellTowers.push({
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon)
        });
    });

function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1`;
    return fetch(url).then(response => response.json());
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

exports.handler = async (event) => {
    const address = event.queryStringParameters.address;
    const geoData = await geocodeAddress(address);
    if (!geoData || geoData.length === 0) {
        return {
            statusCode: 200,
            body: JSON.stringify({ coverage: 'Address not found' })
        };
    }

    const { lat, lon } = geoData[0];
    const countryCode = geoData[0].address.country_code;

    if (countryCode !== 'ca') {
        return {
            statusCode: 200,
            body: JSON.stringify({ coverage: 'Service available only in Canada' })
        };
    }

    let minDistance = Infinity;
    for (const tower of cellTowers) {
        const distance = haversineDistance(lat, lon, tower.lat, tower.lon);
        if (distance < minDistance) {
            minDistance = distance;
        }
    }

    const coverage = minDistance > 10 ? 'No coverage' : 'You have coverage';
    return {
        statusCode: 200,
        body: JSON.stringify({ coverage })
    };
};