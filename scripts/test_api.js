/**
 * @file This file is responsible for testing the integration with the AviationStack API.
 * It fetches flight data using HTTP requests, logs the responses to the console,
 * and saves the results to a local file.
 * Its primary role within the environment is to verify the connectivity and
 * data retrieval capabilities from the external AviationStack service,
 * ensuring that the API key and network configurations are correct.
 */

const http = require('http');
const fs = require('fs');

// Load environment variables from .env.local file for secure API key access.
require('dotenv').config({ path: '../.env.local' });

// AviationStack API key, loaded from .env.local for secure access to the API.
const API_KEY = process.env.AVIATIONSTACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1';
/**
 * Fetches data from a given URL and parses it as JSON.
 * @param {string} url The URL to fetch.
 * @returns {Promise<object>} A promise that resolves with the parsed JSON data or rejects with an error.
 */
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            // Reject if the HTTP status code indicates an error (e.g., 4xx or 5xx)
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`Request Failed with status code: ${res.statusCode}`));
            }

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Failed to parse JSON response: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Network request failed: ${e.message}`));
        });

        // For http.get, req.end() is called automatically, no need to explicitly call it.
    });
}

/**
 * Tests the AviationStack API by fetching flight data and logging the results.
 * The results are also written to a file named 'api_result.txt'.
 * @returns {Promise<void>} A promise that resolves when the API tests are complete.
 */
async function testApi() {
    const logMessages = [];
    const log = (msg) => {
        logMessages.push(msg);
        console.log(msg);
    };

    log('Testing AviationStack API (HTTP)...');

    try {
        // Test 1: Fetch a single active flight
        log('Fetching 1 active flight...');
        const activeFlightData = await fetchUrl(`${BASE_URL}/flights?access_key=${API_KEY}&limit=1`);

        if (activeFlightData.error) {
            log('API Error: ' + JSON.stringify(activeFlightData.error, null, 2));
        } else if (activeFlightData.data && activeFlightData.data.length > 0) {
            const flight = activeFlightData.data[0];
            log(`SUCCESS! Active Flight Found: ${flight.flight.iata}`);
            log(`Active Flight Status: ${flight.flight_status}`);
        } else {
            log('No active flights found (Empty Data).');
        }

        // Test 2: Check for a specific flight (e.g., AA123)
        const specificFlightIata = 'AA123';
        log(`\nChecking "${specificFlightIata}"...`);
        const specificFlightData = await fetchUrl(`${BASE_URL}/flights?access_key=${API_KEY}&flight_iata=${specificFlightIata}`);

        if (specificFlightData.error) {
            log('API Error: ' + JSON.stringify(specificFlightData.error, null, 2));
        } else if (specificFlightData.data && specificFlightData.data.length > 0) {
            log(`${specificFlightIata} Found: ${specificFlightData.data[0].flight.iata}`);
        } else {
            log(`${specificFlightIata} Not Found in active window.`);
        }

    } catch (e) {
        log(`Request Failed: ${e.message}`);
    } finally {
        // Ensure output is written to file even if an error occurs
        fs.writeFileSync('api_result.txt', logMessages.join('\n'));
    }
}

testApi();
