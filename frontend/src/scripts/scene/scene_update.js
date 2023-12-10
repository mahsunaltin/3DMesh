import { addSpheres } from './spheres.js';
import { addFaces } from './faces.js';
import { addEdges } from './edges.js';
import { 
    innerPointColor, innerPointSize, 
    outerPointColor, outerPointSize,
    faceColor, faceOpacity,
    edgeColor, edgeOpacity
} from './../controls/controls_setup.js';
import { innerPointsGroup, outerPointsGroup, facesGroup, edgesGroup } from './../main.js';
import { camera, renderer } from './../main.js';

// Update the scene with new data
export function updateScene(frameData) {
    clearGroup(innerPointsGroup);
    clearGroup(outerPointsGroup);
    clearGroup(facesGroup);
    clearGroup(edgesGroup);

    // Apply distinct settings for inner and outer points
    addSpheres(frameData.inner_points, innerPointColor, innerPointSize, innerPointsGroup);
    addSpheres(frameData.outermost_points, outerPointColor, outerPointSize, outerPointsGroup);
    addFaces(frameData.faces, faceColor, faceOpacity, facesGroup);
    addEdges(frameData.faces, edgeColor, edgeOpacity, edgesGroup);
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