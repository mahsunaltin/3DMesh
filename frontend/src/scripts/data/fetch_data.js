import { hideLoadingScreen } from '../ui/loading_screen.js';

/**
 * Fetches a series of data frames from the server asynchronously.
 * This function sends a POST request to the server and retrieves a time series of 3D point data.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of fetched data for each frame.
 */
export async function fetchData(numPoints, scale, numFrames) {
    try {
        // Define the server URL and request payload
        const url = 'http://127.0.0.1:8000/generate_points';
        const payload = { num_points: numPoints, scale: scale, num_frames: numFrames };

        // Send a POST request to the server
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Parse and return the JSON response as an array of frames
        const frames = await response.json();
        console.log('Response from server:', frames); // Log the response for debugging
        hideLoadingScreen();
        return frames;
    } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error('Error fetching data:', error);
        hideLoadingScreen();
        return null; // Return null or handle error as appropriate
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