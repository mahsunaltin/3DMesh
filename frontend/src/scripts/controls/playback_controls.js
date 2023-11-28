/**
 * Sets up playback controls including play, pause, and speed adjustment.
 * 
 * @param {Function} playAnimation - Function to start the animation.
 * @param {Function} pauseAnimation - Function to pause the animation.
 * @param {Function} setAnimationSpeed - Function to set the speed of the animation.
 */
export function setupPlaybackControls(playAnimation, pauseAnimation, setAnimationSpeed) {
    // Setup the play button event listener
    document.getElementById('playButton').addEventListener('click', () => {
        playAnimation();
    });

    // Setup the pause button event listener
    document.getElementById('pauseButton').addEventListener('click', () => {
        pauseAnimation();
    });

    // Setup the speed control (slider or input) event listener
    document.getElementById('speedControl').addEventListener('input', (event) => {
        const speed = parseFloat(event.target.value);
        setAnimationSpeed(speed);
    });
}
