import { updateScene } from './../scene/scene_update.js';
import { framesData } from './../main.js';
import { setFrameIndex } from './../animation/animation.js';

/**
 * Handles the time bar click event.
 * 
 * @param {Object} event - The click event.
 * @param {Number} totalTime - The total number of frames.
 */
export function handleTimeBarClick(event, totalTime) {
    // Get the click position
    const timeBarContainer = document.getElementById('timeBarContainer');
    const clickPosition = event.clientX - timeBarContainer.getBoundingClientRect().left;
    const percentageClicked = (clickPosition / timeBarContainer.clientWidth) * 100;
    const frameClicked = Math.floor((percentageClicked / 100) * totalTime);

    // Update the scene
    setFrameIndex(frameClicked);
    updateScene(framesData[frameClicked])

    // Update the progress bar
    updateProgressBar(frameClicked, framesData.length);
}

/**
 * Updates the progress bar.
 * 
 * @param {Number} currentFrame - The current frame.
 * @param {Number} totalTime - The total number of frames.
 */
export function updateProgressBar(currentFrame, totalTime) {
    // Update the progress bar
    const percentage = ( ( currentFrame + 1 ) / totalTime ) * 100;
    const timeBar = document.getElementById('timeBar');
    timeBar.style.width = `${percentage}%`;

    // Update the progress bar text
    const timeBarText = document.getElementById('timeBarText');
    timeBarText.textContent = `Frame: ${currentFrame + 1} / ${totalTime}`;
}