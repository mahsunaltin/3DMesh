import { hideLoadingScreen } from '../ui/loading_screen.js';

// Scenario 1: Fetch Random Scaled Points
export async function fetchRandomScaledPoints(numPoints, scale, numFrames) {
    const url = 'http://127.0.0.1:8000/generate_random_scaled_points';
    const payload = { num_points: numPoints, scale: scale, num_frames: numFrames };
    return await postData(url, payload);
}

// Scenario 2: Fetch Time Series with Noise and Anomalies
export async function fetchTimeSeriesNoiseAnomalies(numFrames, numPointsPerFrame, noiseLevel, anomalyLevel) {
    const url = 'http://127.0.0.1:8000/generate_time_series_noise_anomalies';
    const payload = { num_frames: numFrames, num_points_per_frame: numPointsPerFrame, noise_level: noiseLevel, anomaly_level: anomalyLevel };
    return await postData(url, payload);
}

// Scenario 3: Fetch Animated Scaled Sphere Point Cloud
export async function fetchAnimatedScaledSphere(numPoints, numFrames, numCycles, scaleMin, scaleMax) {
    const url = 'http://127.0.0.1:8000/generate_animated_scaled_sphere';
    const payload = { num_points: numPoints, num_frames: numFrames, num_cycles: numCycles, scale_min: scaleMin, scale_max: scaleMax };
    return await postData(url, payload);
}

// Scenario 4: Fetch Custom Scaled Hollow Sphere Point Cloud
export async function fetchCustomScaledHollowSphere(numPoints, numFrames, numCycles, scaleMin, scaleMax) {
    const url = 'http://127.0.0.1:8000/generate_custom_scaled_hollow_sphere';
    const payload = { num_points: numPoints, num_frames: numFrames, num_cycles: numCycles, scale_min: scaleMin, scale_max: scaleMax };
    return await postData(url, payload);
}

// Helper function for POST requests
/**
 * Sends a POST request to the server and returns the response.
 * 
 * @param {String} url The URL to send the request to.
 * @param {Object} payload The payload to send with the request.
 * 
 * @returns {Object} The response from the server.
 */
async function postData(url, payload) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const frames = await response.json();
        console.log('Response from server:', frames);
        hideLoadingScreen();
        return frames;
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingScreen();
        return null;
    }
}


/**
 * Finds the outermost point from a series of data frames.
 * 
 * @param {Array} data An array of data frames.
 * 
 * @returns {Array} An array containing the coordinates of the outermost point.
 */
export function findOutermostPoint(data) {
    let maxDistance = 0;
    let outermostPoint = null;

    if (!Array.isArray(data)) {
        console.error("Provided data is not an array");
        return null;
    }

    data.forEach(item => {
        item.outermost_points.forEach(point => {
            const distance = Math.sqrt(point[0] ** 2 + point[1] ** 2 + point[2] ** 2);
            if (distance > maxDistance) {
                maxDistance = distance;
                outermostPoint = point;
            }
        });
    });

    return outermostPoint;
}

/**
 * Finds the largest absolute coordinate value from a 3D point.
 * 
 * @param {Array} point An array containing the coordinates of a 3D point.
 * 
 * @returns {Number} The largest absolute coordinate value.
 */
export function findLargestAbsoluteCoordinate(point) {
    if (!point || point.length < 3) {
        console.error("Invalid point data");
        return null;
    }

    const largestAbsoluteCoordinate = Math.max(Math.abs(point[0]), Math.abs(point[1]), Math.abs(point[2]));
    return largestAbsoluteCoordinate;
}