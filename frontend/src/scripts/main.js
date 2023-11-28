import * as THREE from 'three';
import '../styles/style.css';

import { setupControls, updateFaceColor, updateFaceOpacity,  updateEdgeColor, updateEdgeOpacity, updateInnerPointColor, updateOuterPointColor, updateInnerPointSize, updateOuterPointSize } from './controls/controls_setup.js';
import { fetchData } from './data/fetch_data.js';
import { createScene, addOrbitControls } from './scene/scene_setup.js';
import { setupPlaybackControls } from './controls/playback_controls.js'; 
import { onDocumentMouseMove } from './controls/mouse_controls.js'; 
import { switchBackgroundColor } from './controls/mode_switch.js'; 
import { animate, playAnimation, pauseAnimation, setAnimationSpeed } from './animation/animation.js';
import { updateScene } from './scene/scene_update.js';
import { createAxes } from './scene/axes.js';
import { createPlanes } from './scene/plane.js';
import { handleTimeBarClick, updateProgressBar } from './controls/time_bar.js';

// Global variables for scene
export let scene, camera, renderer;

// Global variables for groups
export let innerPointsGroup, outerPointsGroup, facesGroup, edgesGroup;

// Variables for animation
export let framesData = [];

// Variables for axes and planes
let axesSize = 5;
let planeSize = axesSize * 2;

// Main function
async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const numPoints = parseInt(urlParams.get('numPoints'), 10);
    const scale = parseInt(urlParams.get('scale'), 10);
    const numFrames = parseInt(urlParams.get('numFrames'), 10);
    framesData = await fetchData(numPoints, scale, numFrames);
    if (framesData && framesData.length > 0) {
        init(framesData[0]); // Initialize the scene
        updateProgressBar(0, framesData.length); // Update the progress bar
        animate(); // Animate the scene
        setupPlaybackControls(playAnimation, pauseAnimation, setAnimationSpeed); // Setup playback controls

        // Time bar click event listener
        const timeBarContainer = document.getElementById('timeBarContainer');
        timeBarContainer.addEventListener('click', (event) => {
            handleTimeBarClick(event, framesData.length);
        });
    }
}

/**
 * Initializes the scene.
 * 
 * @param {Object} frameData - The data for the first frame.
 * 
 * @returns {Object} An object containing the scene, camera, and renderer.
 */ 
function init(frameData) {
    // Create the scene
    ({ scene, camera, renderer } = createScene());

    // Add the renderer to the DOM
    document.getElementById('container').appendChild(renderer.domElement);

    // Set background color
    renderer.setClearColor(0xf4f4f4, 1);

    // Add event listener for mode switch
    document.getElementById('modeSwitch').addEventListener('click', switchBackgroundColor);

    // Add axes and plane helper
    createAxes(scene, axesSize);
    createPlanes(scene, planeSize);

    // Add groups for inner and outer points
    innerPointsGroup = new THREE.Group();
    outerPointsGroup = new THREE.Group();
    
    // Add groups for faces and edges
    facesGroup = new THREE.Group();
    edgesGroup = new THREE.Group();
    
    // Add groups to scene
    updateScene(frameData);
    scene.add(innerPointsGroup);
    scene.add(outerPointsGroup);
    scene.add(facesGroup);
    scene.add(edgesGroup);

    // Setup controls
    setupControls(
        innerPointsGroup, 
        outerPointsGroup, 
        facesGroup, 
        edgesGroup, 
        {
            updateInnerPointSize, 
            updateInnerPointColor,
            updateOuterPointSize, 
            updateOuterPointColor,
            updateFaceColor,
            updateFaceOpacity, 
            updateEdgeColor, 
            updateEdgeOpacity
        }
    );

    // Add orbit controls
    addOrbitControls(camera, renderer);
    
    // Add event listener for mouse move
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

// Run the main function
main();
