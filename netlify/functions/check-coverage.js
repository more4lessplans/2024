const fetch = require('node-fetch');
const csv = require('csv-parser');
const fs = require('fs');

// Function to calculate distance between two points (latitude, longitude)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;  // Convert degrees to radians
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

exports.handler = async (event, context) => {
    const address = event.queryStringParameters.address;

    // Fetch coordinates from Google Places API
    const googleApiKey = 'AIzaSyDNt4XeQ5roadq0L-IpadA6s9e4CPm9FwI'; // Replace with your actual Google API key
    const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(address)}&inputtype=textquery&fields=geometry&key=${googleApiKey}`;

    try {
        // Fetching coordinates from Google Places API
        const googleResponse = await fetch(googlePlacesUrl);
        if (!googleResponse.ok) {
            throw new Error('Failed to fetch coordinates from Google Places API');
        }
        const googleData = await googleResponse.json();
        const { lat: userLat, lng: userLng } = googleData.candidates[0].geometry.location;

        // Reading and processing cell tower data from OpenCellID CSV
        const cellTowers = [];
        fs.createReadStream('cell_tower_data.csv')
            .pipe(csv())
            .on('data', (row) => {
                const towerLat = parseFloat(row.lat);
                const towerLng = parseFloat(row.lon);
                const distance = calculateDistance(userLat, userLng, towerLat, towerLng);
                // Adjust the distance threshold as per your coverage criteria (e.g., 1 km)
                if (distance <= 1) { // Within 1 km coverage range
                    cellTowers.push({ lat: towerLat, lon: towerLng });
                }
            })
            .on('end', () => {
                // Determine coverage based on cellTowers array
                const coverageAvailable = cellTowers.length > 0;

                // Respond with coverage result
                return {
                    statusCode: 200,
                    body: JSON.stringify({ coverage: coverageAvailable })
                };
            });
    } catch (error) {
        console.error('Error checking coverage:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};