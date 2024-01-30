import * as THREE from 'three';
import { framesData, camera, innerPointsGroup, outerPointsGroup, anomalyGroupPoints, scene } from '../main.js';
import { frameIndexForDetails } from '../animation/animation.js';
import { updateScene, setXShape, xShape } from '../scene/scene_update.js';
import { createXShape } from '../scene/x_shape.js';

// Global variables for mouse position
export let currentMouseX = 0;
export let currentMouseY = 0;

// Raycaster and mouse for intersection tests
export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();

export function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    currentMouseX = event.clientX;
    currentMouseY = event.clientY;
}

export function onMouseClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1) for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check intersections for both inner and outer points
    const intersectsInner = raycaster.intersectObjects(innerPointsGroup.children, true);
    const intersectsOuter = raycaster.intersectObjects(outerPointsGroup.children, true);
    const intersectsAnomaly = raycaster.intersectObjects(anomalyGroupPoints.children, true);

    // Check if there are any intersections
    if (intersectsInner.length > 0 || intersectsOuter.length > 0 || intersectsAnomaly.length > 0) {
        // Use the first intersected object from either group
        const intersect = intersectsInner.length > 0 ? intersectsInner[0] : intersectsOuter.length > 0 ? intersectsOuter[0] : intersectsAnomaly[0];
        // This is the position from the intersected object
        const intersectedPosition = intersect.object.position.toArray();
        // Access the specific frame's all_points array
        const allPoints = framesData[frameIndexForDetails].all_points;
        // Variable to store the found index
        let foundIndex = -1;
        // Iterate through all points in the specific frame
        for (let i = 0; i < allPoints.length; i++) {
            if (positionsAreClose(intersectedPosition, allPoints[i])) {
                foundIndex = i;
                break;
            }
        }
        // Output the result
        if (foundIndex !== -1) {
            console.log(`Found position at index ${foundIndex} in frame ${frameIndexForDetails}`);            
            // Remove the existing xShape if it exists
            if (xShape) {
                scene.remove(xShape);
                setXShape(null); // Reset the reference
            }

            const selectedPointCoords = framesData[frameIndexForDetails].all_points[foundIndex];
            if (Array.isArray(selectedPointCoords) && selectedPointCoords.length >= 3) {
                // Update the dropdown
                document.getElementById('point-selector').value = foundIndex;
                // Create and add the xShape
                setXShape(createXShape(new THREE.Vector3(...selectedPointCoords), 0.2, 0xB5F44A, 0.04));
                scene.add(xShape);
            }

            /** GET THE DATA **/
            // Array to store points from all frames at the foundIndex
            let pointsAtSameIndex = [];
            let anomalyPointsAtSameIndex = [];
            // Iterate through all frames in framesData
            for (let frame of framesData) {
                if (frame.all_points && frame.all_points.length > foundIndex) {
                    // Add the point at foundIndex from each frame to the array
                    pointsAtSameIndex.push(frame.all_points[foundIndex]);
                    // Variable to check if an anomaly point was found
                    let foundAnomalyPoint = false;
                    // Check if the frame has anomaly points
                    if (frame.anomaly_points && frame.anomaly_points.length > 0) {
                        // Iterate through all anomaly points in the frame
                        for (let anomalyPoint of frame.anomaly_points) {
                            // Check if the anomaly point is the same point as the one we found
                            if (positionsAreClose(anomalyPoint, frame.all_points[foundIndex], 0)) {
                                // Add the anomaly point to the array
                                anomalyPointsAtSameIndex.push(anomalyPoint);
                                foundAnomalyPoint = true;
                            }
                        }
                    }
                    // If no anomaly point was found, add null to the array
                    if (!foundAnomalyPoint) anomalyPointsAtSameIndex.push(null);
                } else {
                    // Handle the case where the frame does not have enough points
                    pointsAtSameIndex.push(null); // Or handle this case as needed
                }
            }

            /** OPEN NEW WINDOW & SEND THE DATA **/
            // Open a new window with specific features
            let features = 'width=600,height=1000,menubar=no,toolbar=no,location=no,status=no';
            let newWindow = window.open('detailed_visualization.html', '_blank', features);

            newWindow.addEventListener('load', function() {
                // Set the title of the new window
                newWindow.document.title = `Position of Point ${foundIndex} in X, Y, Z Coordinates with respect to Time`;

                if (newWindow.setPointsData) {
                    newWindow.setPointsData(pointsAtSameIndex, anomalyPointsAtSameIndex);
                    console.log('Sent data to the new window.');
                } else {
                    console.log('setPointsData function not found in the new window.');
                }
            }, false);

        } else {
            console.log('Position not found in the specified frame\'s all_points');
        }
    }
}

// Function to compare two positions with a threshold
export function positionsAreClose(pos1, pos2, threshold = 0.01) {
    return pos1.every((val, index) => Math.abs(val - pos2[index]) <= threshold);
}

// Function to handle the selection change in the dropdown
export function onPointSelect() {
    const selectedIndex = parseInt(document.getElementById('point-selector').value, 10);
    if (!isNaN(selectedIndex) && framesData && framesData.length > frameIndexForDetails) {
        const frameData = framesData[frameIndexForDetails];
        if (frameData.all_points && frameData.all_points.length > selectedIndex) {
            updateScene(frameData); // Call updateScene with the current frame data
        }
    }
}