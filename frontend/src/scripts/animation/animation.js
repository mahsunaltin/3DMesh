import { updateScene } from './../scene/scene_update.js';
import { framesData, scene, camera, renderer } from './../main.js';
import { raycaster, mouse } from './../controls/mouse_controls.js';
import { innerPointsGroup, outerPointsGroup, anomalyGroupPoints } from './../main.js';
import { currentMouseX, currentMouseY, onMouseClick, positionsAreClose, onPointSelect } from './../controls/mouse_controls.js';
import { updateProgressBar } from '../controls/time_bar.js';

// Global variables for scene
export let frameIndex = 0; // This variable is used for the animation
export let frameIndexForDetails = 0; // This variable is used for the details of the point

// Variable for data
let lastFrameTime = Date.now();

// Variables for animation control
let isAnimating = false;
let animationSpeed = 1;
let frameDuration = 1000;

// Animate the scene
export function animate() {
    // Call animate recursively
    requestAnimationFrame(animate);
    // Update the label of number of anomaly points
    if (frameIndexForDetails >= 0) {
        document.getElementById('numberOfAnomalies').innerHTML = "<strong>Number of anomaly points:</strong> " + framesData[frameIndexForDetails].anomaly_points.length + " / " + framesData[frameIndexForDetails].all_points.length;
    }
    // Add event listener to the dropdown
    document.getElementById('point-selector').addEventListener('change', onPointSelect);    

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check intersections for both inner, outer and anomaly points
    const intersectsInner = raycaster.intersectObjects(innerPointsGroup.children, true);
    const intersectsOuter = raycaster.intersectObjects(outerPointsGroup.children, true);
    const intersectsAnomaly = raycaster.intersectObjects(anomalyGroupPoints.children, true);
    
    // Update the label
    const label = document.getElementById('label');

    // Add event listener for mouse click
    document.addEventListener('click', onMouseClick, false);

    // ***** IF ELSE STATEMENT FOR LABEL -- START *****

    // If there is an intersection, display the label
    if (intersectsInner.length > 0 || intersectsOuter.length > 0 || intersectsAnomaly.length > 0) {
        // Use the first intersected object from either group
        const intersect = intersectsInner.length > 0 ? intersectsInner[0] : intersectsOuter.length > 0 ? intersectsOuter[0] : intersectsAnomaly[0];
                
        // Display the label at the intersection point
        label.style.display = 'block';
        label.style.left = `${currentMouseX}px`;
        label.style.top = `${currentMouseY}px`;
        
        const position = intersect.object.position;
        const roundedX = position.toArray()[0].toFixed(2);
        const roundedY = position.toArray()[1].toFixed(2);
        const roundedZ = position.toArray()[2].toFixed(2);

        // Access the specific frame's all_points array
        const allPoints = framesData[frameIndexForDetails].all_points;
        // Variable to store the found index
        let foundIndex = -1;
        // Iterate through all points in the specific frame
        for (let i = 0; i < allPoints.length; i++) {
            if (positionsAreClose(position.toArray(), allPoints[i])) {
                foundIndex = i;
                break;
            }
        }

        label.innerHTML = `
                            <strong>Point ${foundIndex}</strong><br>
                            <strong>x:</strong> ${roundedX}<br>
                            <strong>y:</strong> ${roundedY}<br>
                            <strong>z:</strong> ${roundedZ}
                        `;
        // Highlight the intersected object
        intersect.object.material.color.set(0xff0000);
    } else {
        // Hide the label if there is no intersection
        label.style.display = 'none';
        // Reset the color of all objects to default
        innerPointsGroup.children.forEach(child => child.material.color.set(document.getElementById('innerColor').value));
        outerPointsGroup.children.forEach(child => child.material.color.set(document.getElementById('outerColor').value));
        anomalyGroupPoints.children.forEach(child => child.material.color.set(document.getElementById('anomalyColor').value));
    }

    // ***** IF ELSE STATEMENT FOR LABEL -- END *****

    // ***** IF ELSE STATEMENT FOR ANIMATION -- START *****

    // Update the scene if animation is playing
    if (isAnimating) {
        const currentTime = Date.now();
        const timeElapsed = currentTime - lastFrameTime;
        if (timeElapsed > frameDuration / animationSpeed) {
            updateScene(framesData[frameIndex]);
            updateProgressBar(frameIndex, framesData.length)
            frameIndex = (frameIndex + 1) % framesData.length;
            
            // If the frame index is the last one, set the frame index for details to the last one
            if (frameIndexForDetails === framesData.length - 2) {
                frameIndexForDetails = framesData.length - 1;
            } else {
                frameIndexForDetails = frameIndex - 1;
            }
            
            lastFrameTime = currentTime;
        }
    }

    // ***** IF ELSE STATEMENT FOR ANIMATION -- END *****

    // Render the scene
    renderer.render(scene, camera);
}

// Functions for animation control (play)
export function playAnimation() {
    isAnimating = true;
}

// Functions for animation control (pause)
export function pauseAnimation() {
    isAnimating = false;
}

// Functions for animation control (speed)
export function setAnimationSpeed(speed) {
    animationSpeed = speed;
    frameDuration = 1000 / speed;
}

export function setFrameIndex(value) {
    frameIndex = value;
    frameIndexForDetails = value;
}