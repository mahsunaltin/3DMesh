import { updateScene } from './../scene/scene_update.js';
import { framesData, scene, camera, renderer } from './../main.js';
import { raycaster, mouse } from './../controls/mouse_controls.js';
import { innerPointsGroup, outerPointsGroup } from './../main.js';
import { currentMouseX, currentMouseY } from './../controls/mouse_controls.js';
import { updateProgressBar } from '../controls/time_bar.js';

// Global variables for scene
let frameIndex = 0;

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

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check intersections for both inner and outer points
    const intersectsInner = raycaster.intersectObjects(innerPointsGroup.children, true);
    const intersectsOuter = raycaster.intersectObjects(outerPointsGroup.children, true);
    
    // Update the label
    const label = document.getElementById('label');

    // If there is an intersection, display the label
    if (intersectsInner.length > 0 || intersectsOuter.length > 0) {
        // Use the first intersected object from either group
        const intersect = intersectsInner.length > 0 ? intersectsInner[0] : intersectsOuter[0];
        
        // Display the label at the intersection point
        label.style.display = 'block';
        label.style.left = `${currentMouseX}px`;
        label.style.top = `${currentMouseY}px`;
        
        const position = intersect.object.position;
        const roundedX = position.toArray()[0].toFixed(2);
        const roundedY = position.toArray()[1].toFixed(2);
        const roundedZ = position.toArray()[2].toFixed(2);

        label.innerHTML = `
                            <strong>x:</strong> ${roundedX}<br>
                            <strong>y:</strong> ${roundedY}<br>
                            <strong>z:</strong> ${roundedZ}
                        `;
    } else {
        // Hide the label if there is no intersection
        label.style.display = 'none';
    }

    // Update the scene if animation is playing
    if (isAnimating) {
        const currentTime = Date.now();
        const timeElapsed = currentTime - lastFrameTime;
        if (timeElapsed > frameDuration / animationSpeed) {
            updateScene(framesData[frameIndex]);
            updateProgressBar(frameIndex, framesData.length)
            frameIndex = (frameIndex + 1) % framesData.length;
            lastFrameTime = currentTime;
        }
    }

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
}