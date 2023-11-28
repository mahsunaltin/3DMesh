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

