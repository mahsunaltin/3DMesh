import * as THREE from 'three';
import '../styles/style.css';

import { setupControls, updateFaceColor, updateFaceOpacity,  updateEdgeColor, updateEdgeOpacity, updateInnerPointColor, updateOuterPointColor, updateInnerPointSize, updateOuterPointSize } from './controls/controls_setup.js';
import { fetchData, findOutermostPoint, findLargestAbsoluteCoordinate } from './data/fetch_data.js';
import { createScene, addOrbitControls } from './scene/scene_setup.js';
import { setupPlaybackControls } from './controls/playback_controls.js'; 
import { onDocumentMouseMove } from './controls/mouse_controls.js'; 
import { switchBackgroundColor } from './controls/mode_switch.js'; 
import { animate, playAnimation, pauseAnimation, setAnimationSpeed } from './animation/animation.js';
import { updateScene, onWindowResize } from './scene/scene_update.js';
import { createAxes } from './scene/axes.js';
import { createPlanes } from './scene/plane.js';
import { handleTimeBarClick, updateProgressBar } from './controls/time_bar.js';
import { exportToImage } from './controls/export.js';

// Global variables for scene
export let scene, camera, renderer;

// Global variables for camera position
let postion_of_camera = 5;

// Global variables for groups
export let innerPointsGroup, outerPointsGroup, facesGroup, edgesGroup;

// Variables for animation
export let framesData = [];

// Variables for axes and planes
let outermostPoint = null;
let largestCoordinate = null;

let axesObjects = null; // Variable to store axes objects
let axesSize = 5;
let axesColor = 0x090B0B;

let planeObjects = null; // Variable to store plane objects
let planeSize = axesSize * 2;
let planeDivisions = axesSize * 2;
let planeColor = 0xD1D1D1;

// Main function
async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const numPoints = parseInt(urlParams.get('numPoints'), 10);
    const scale = parseInt(urlParams.get('scale'), 10);
    const numFrames = parseInt(urlParams.get('numFrames'), 10);
    framesData = await fetchData(numPoints, scale, numFrames);

    // Find the outermost point and largest absolute coordinate
    outermostPoint = findOutermostPoint(framesData);
    largestCoordinate = findLargestAbsoluteCoordinate(outermostPoint);

    // Set axes and plane size according to the outermost point
    axesSize = Math.ceil(largestCoordinate * 1.2);
    planeSize = axesSize * 2;
    planeDivisions = axesSize * 2;

    // Set camera position
    postion_of_camera = axesSize;

    // Check if data was fetched successfully
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

        // Attach the event listener
        window.addEventListener('resize', onWindowResize, false);

        // Export to image event listener
        document.getElementById('export-button').addEventListener('click', function() {
            document.getElementById('export-options').classList.toggle('hidden');
        });
        
        document.getElementById('export-jpeg').addEventListener('click', function() {
            exportToImage('image/jpeg'); // Update the exportToImage function to accept a format
        });

        document.getElementById('export-png').addEventListener('click', function() {
            exportToImage('image/png'); // Update the exportToImage function to accept a format
        });

    } else {
        // Handle error
        console.error('Error fetching data');
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
    ({ scene, camera, renderer } = createScene(postion_of_camera));

    // Add the renderer to the DOM
    document.getElementById('container').appendChild(renderer.domElement);

    // Set background color
    renderer.setClearColor(0xf4f4f4, 1);

    // Add event listener for mode switch
    document.getElementById('modeSwitch').addEventListener('click', switchBackgroundColor);

    /*************************************************/
    /********** ADD AXES AND PLANES - START **********/

    // Add axes
    axesObjects = createAxes(scene, axesSize, axesColor);

    // Color change listener
    document.getElementById('axesColorPicker').addEventListener('input', (event) => {
        axesColor = event.target.value;

        // Remove previous axes
        scene.remove(axesObjects.xAxis);
        scene.remove(axesObjects.yAxis);
        scene.remove(axesObjects.zAxis);
        axesObjects.labels.forEach(label => scene.remove(label));

        // Create new axes with the new color
        axesObjects = createAxes(scene, axesSize, axesColor);
    });

    // Visibility toggle listener
    document.getElementById('axesVisible').addEventListener('change', (event) => {
        const isVisible = event.target.checked;

        // Set visibility of each axis
        axesObjects.xAxis.visible = isVisible;
        axesObjects.yAxis.visible = isVisible;
        axesObjects.zAxis.visible = isVisible;
        axesObjects.labels.forEach(label => label.visible = isVisible);
    });
   

    // Add planes
    planeObjects = createPlanes(scene, planeSize, planeDivisions, planeColor);

    // Color change listener
    document.getElementById('gridHelpersColorPicker').addEventListener('input', (event) => {
        planeColor = event.target.value;

        // Remove previous planes
        scene.remove(planeObjects.xyPlane);
        scene.remove(planeObjects.yzPlane);
        scene.remove(planeObjects.zxPlane);

        // Create new planes with the new color
        planeObjects = createPlanes(scene, planeSize, planeDivisions, planeColor);
    });

    // Visibility toggle listener
    document.getElementById('gridHelpersVisible').addEventListener('change', (event) => {
        const isVisible = event.target.checked;

        // Set visibility of each plane
        planeObjects.xyPlane.visible = isVisible;
        planeObjects.yzPlane.visible = isVisible;
        planeObjects.zxPlane.visible = isVisible;
    });

    /********** ADD AXES AND PLANES - END **********/
    /***********************************************/
    
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
