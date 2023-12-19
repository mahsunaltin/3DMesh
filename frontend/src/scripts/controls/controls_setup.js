import * as THREE from 'three';

// Inner points settings
export let innerPointSize = 0.025; // Default size for inner points
export let innerPointColor = 0xA326C6; // Default color for inner points

// Outer points settings
export let outerPointSize = 0.05; // Default size for outer points
export let outerPointColor = 0x0055FF; // Default color for outer points

// Anomaly points settings
export let anomalyPointSize = 0.07; // Default size for anomaly points
export let anomalyPointColor = 0xFF0000; // Default color for anomaly points

// Faces settings
export let faceColor = 0xD8FCFF; // Default color for faces
export let faceOpacity = 0.2; // Default opacity for faces

// Edge settings
export let edgeColor = 0x090B0B; // Default edge color (black)
export let edgeOpacity = 0.5;    // Default edge opacity (fully opaque)

/**
 * Sets up interactive controls for the 3D objects in the scene.
 * 
 * @param {THREE.Group} innerPointsGroup - Group containing the inner points.
 * @param {THREE.Group} outerPointsGroup - Group containing the outer points.
 * @param {THREE.Group} anomalyPointsGroup - Group containing the anomaly points.
 * @param {THREE.Group} facesGroup - Group containing the faces.
 * @param {THREE.Group} edgesGroup - Group containing the edges.
 * @param {Object} updateFunctions - Object containing update functions for size, color, and opacity.
 */
export function setupControls(innerPointsGroup, outerPointsGroup, anomalyPointsGroup, facesGroup, edgesGroup, updateFunctions) {
    const {
        updateInnerPointSize, updateInnerPointColor,
        updateOuterPointSize, updateOuterPointColor,
        updateAnomalyPointSize, updateAnomalyPointColor,
        updateFaceOpacity, updateFaceColor, 
        updateEdgeColor, updateEdgeOpacity
    } = updateFunctions;

    // Controls for Inner Points
    document.getElementById('innerSize').addEventListener('input', (event) => {
        updateInnerPointSize(innerPointsGroup, parseFloat(event.target.value));
    });
    document.getElementById('innerColor').addEventListener('input', (event) => {
        updateInnerPointColor(innerPointsGroup, event.target.value);
        document.getElementById('innerColorCircle').style.backgroundColor = event.target.value;        
    });
    document.getElementById('innerVisible').addEventListener('change', (event) => {
        innerPointsGroup.visible = event.target.checked;
    });

    // Controls for Outer Points
    document.getElementById('outerSize').addEventListener('input', (event) => {
        updateOuterPointSize(outerPointsGroup, parseFloat(event.target.value));
    });
    document.getElementById('outerColor').addEventListener('input', (event) => {
        updateOuterPointColor(outerPointsGroup, event.target.value);
        document.getElementById('outerColorCircle').style.backgroundColor = event.target.value;
    });
    document.getElementById('outerVisible').addEventListener('change', (event) => {
        outerPointsGroup.visible = event.target.checked;
    });

    // Controls for Anomaly Points
    document.getElementById('anomalySize').addEventListener('input', (event) => {
        updateAnomalyPointSize(anomalyPointsGroup, parseFloat(event.target.value));
    });
    document.getElementById('anomalyColor').addEventListener('input', (event) => {
        updateAnomalyPointColor(anomalyPointsGroup, event.target.value);
        document.getElementById('anomalyColorCircle').style.backgroundColor = event.target.value;
    });
    document.getElementById('anomalyVisible').addEventListener('change', (event) => {
        anomalyPointsGroup.visible = event.target.checked;
    });

    // Controls for Faces
    document.getElementById('facesOpacity').addEventListener('input', (event) => {
        updateFaceOpacity(facesGroup, parseFloat(event.target.value));
    });
    document.getElementById('facesColor').addEventListener('input', (event) => {
        updateFaceColor(facesGroup, event.target.value);
    });
    document.getElementById('facesVisible').addEventListener('change', (event) => {
        facesGroup.visible = event.target.checked;
    });

    // Controls for Edges
    document.getElementById('edgeColorPicker').addEventListener('change', (event) => {
        updateEdgeColor(edgesGroup, event.target.value);
    });
    document.getElementById('edgeOpacitySlider').addEventListener('input', (event) => {
        updateEdgeOpacity(edgesGroup, parseFloat(event.target.value));
    });
    document.getElementById('edgeVisible').addEventListener('change', (event) => {
        edgesGroup.visible = event.target.checked;
    });
}

/********************  Inner Points Functions  ********************/

/**
 * Updates the size of all objects within a group.  
 *             
 * @param {*} group - The group whose children's size will be updated.
 * @param {*} newSize - The new size to apply.
 */
export function updateInnerPointSize(group, newSize) {
    innerPointSize = newSize;
    group.children.forEach(child => {
        child.scale.set(newSize, newSize, newSize);
    });
}

/**
 * Updates the color of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's color will be updated.
 * @param {string} newColor - The new color to apply.
 */
export function updateInnerPointColor(group, newColor) {
    innerPointColor = new THREE.Color(newColor);
    group.children.forEach(child => {
        child.material.color.set(innerPointColor);
    });
}

/********************  Outer Points Functions  ********************/

/**
 * Updates the size of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's size will be updated.
 * @param {number} newSize - The new size to apply.
 */
export function updateOuterPointSize(group, newSize) {
    outerPointSize = newSize;
    group.children.forEach(child => {
        child.scale.set(newSize, newSize, newSize);
    });
}

/**
 * Updates the color of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's color will be updated.
 * @param {string} newColor - The new color to apply.
 */
export function updateOuterPointColor(group, newColor) {
    outerPointColor = new THREE.Color(newColor);
    group.children.forEach(child => {
        child.material.color.set(outerPointColor);
    });
}

/********************  Anomaly Points Functions  ********************/

/**
 * Updates the size of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's size will be updated.
 * @param {number} newSize - The new size to apply.
 */
export function updateAnomalyPointSize(group, newSize) {
    anomalyPointSize = newSize;
    group.children.forEach(child => {
        child.scale.set(newSize, newSize, newSize);
    });
}

/**
 * Updates the color of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's color will be updated.
 * @param {string} newColor - The new color to apply.
 */
export function updateAnomalyPointColor(group, newColor) {
    anomalyPointColor = new THREE.Color(newColor);
    group.children.forEach(child => {
        child.material.color.set(anomalyPointColor);
    });
}

/********************  Faces Functions  ********************/

/**
 * Updates the color of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's color will be updated.
 * @param {string} newColor - The new color to apply.
 */
export function updateFaceColor(group, newColor) {
    faceColor = new THREE.Color(newColor);

    group.children.forEach(child => {
        child.material.color.set(faceColor);
    });
}

/**
 * Updates the opacity of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's opacity will be updated.
 * @param {number} opacity - The new opacity to apply.
 */
export function updateFaceOpacity(group, newOpacity) {
    faceOpacity = newOpacity;

    group.children.forEach(child => {
        child.material.opacity = faceOpacity;
    });
}

/********************  Edges Functions  ********************/

/**
 * Updates the color of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's color will be updated.
 * @param {string} newColor - The new color to apply.
 */
export function updateEdgeColor(group, newColor) {
    // Convert the color from a hex string (e.g., "#ff0000") to a THREE.Color
    edgeColor = new THREE.Color(newColor);

    // Iterate over all children in the edgesGroup and update their material color
    group.children.forEach(edge => {
        if (edge.material) {
            edge.material.color.set(edgeColor);
            edge.material.needsUpdate = true; // Indicate that the material needs to be updated
        }
    });
}

/**
 * Updates the opacity of all objects within a group.
 * 
 * @param {THREE.Group} group - The group whose children's opacity will be updated.
 * @param {number} opacity - The new opacity to apply.
 */
export function updateEdgeOpacity(group, newOpacity) {
    edgeOpacity = newOpacity;

    // Iterate over all children in the edgesGroup and update their material opacity
    group.children.forEach(edge => {
        if (edge.material) {
            edge.material.opacity = edgeOpacity;
            edge.material.transparent = edgeOpacity < 1; // Enable transparency if opacity is less than 1
            edge.material.needsUpdate = true; // Indicate that the material needs to be updated
        }
    });
}

/********************  Playback Functions  ********************/

/**
 * Adds play, pause, and speed control functionalities for the animation.
 * 
 * @param {Function} playAnimation - Function to start the animation.
 * @param {Function} pauseAnimation - Function to pause the animation.
 * @param {Function} setAnimationSpeed - Function to set the speed of the animation.
 */
export function setupPlaybackControls(playAnimation, pauseAnimation, setAnimationSpeed) {
    // Play button
    document.getElementById('playButton').addEventListener('click', () => {
        playAnimation();
    });

    // Pause button
    document.getElementById('pauseButton').addEventListener('click', () => {
        pauseAnimation();
    });

    // Speed control slider or input
    document.getElementById('speedControl').addEventListener('input', (event) => {
        const speed = parseFloat(event.target.value);
        setAnimationSpeed(speed);
    });
}
