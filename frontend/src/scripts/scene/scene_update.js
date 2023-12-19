import * as THREE from 'three';
import { addSpheres } from './spheres.js';
import { addFaces } from './faces.js';
import { addEdges } from './edges.js';
import { 
    innerPointColor, innerPointSize, 
    outerPointColor, outerPointSize,
    anomalyPointColor, anomalyPointSize,
    faceColor, faceOpacity,
    edgeColor, edgeOpacity
} from './../controls/controls_setup.js';
import { innerPointsGroup, outerPointsGroup, anomalyGroupPoints, facesGroup, edgesGroup } from './../main.js';
import { camera, renderer, scene } from './../main.js';
import { createXShape } from './x_shape.js';

// Global variables for scene
export let xShape;

// Update the scene with new data
export function updateScene(frameData) {
    clearGroup(innerPointsGroup);
    clearGroup(outerPointsGroup);
    clearGroup(anomalyGroupPoints);
    clearGroup(facesGroup);
    clearGroup(edgesGroup);

    // Apply distinct settings for inner and outer points
    addSpheres(frameData.inner_points, innerPointColor, innerPointSize, innerPointsGroup);
    addSpheres(frameData.outermost_points, outerPointColor, outerPointSize, outerPointsGroup);
    addSpheres(frameData.anomaly_points, anomalyPointColor, anomalyPointSize, anomalyGroupPoints);
    addFaces(frameData.faces, faceColor, faceOpacity, facesGroup);
    addEdges(frameData.faces, edgeColor, edgeOpacity, edgesGroup);

    // Remove the existing xShape if it exists
    if (xShape) {
        scene.remove(xShape);
        xShape = null; // Reset the reference
    }

    // Log the frame data for debugging
    console.log("frameData.all_points:", frameData.all_points);

    const selectedIndexElement = document.getElementById('point-selector');
    if (selectedIndexElement) {
        const selectedIndex = parseInt(selectedIndexElement.value, 10);
        console.log("selectedIndex:", selectedIndex);

        if (!isNaN(selectedIndex) && frameData.all_points && frameData.all_points.length > selectedIndex) {
            const selectedPointCoords = frameData.all_points[selectedIndex];
            console.log("selectedPointCoords:", selectedPointCoords);

            if (Array.isArray(selectedPointCoords) && selectedPointCoords.length >= 3) {
                // Create and add the xShape
                xShape = createXShape(new THREE.Vector3(...selectedPointCoords), 0.2, 0xB5F44A, 0.04);
                scene.add(xShape);
            } else {
                console.error("Invalid selectedPointCoords:", selectedPointCoords);
            }
        } else {
            console.error("Invalid selectedIndex or frameData.all_points is not accessible");
        }
    }
}

// Clear a group
function clearGroup(group) {
    while (group.children.length > 0) {
        group.remove(group.children[0]);
    }
}

//Handles the window resize event.
export function onWindowResize() {
    // Update the camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function setXShape(value) {
    xShape = value;
}