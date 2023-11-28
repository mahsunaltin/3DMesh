import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Creates and sets up the THREE.js scene, camera, and renderer.
 * 
 * @returns {Object} An object containing the scene, camera, and renderer.
 */
export function createScene() {
    // Create a new THREE.js scene
    const scene = new THREE.Scene();

    // Set up the camera with a perspective view
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );

    // Position the camera
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;

    // Create the WebGL renderer and set its size
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Return the created elements
    return { scene, camera, renderer };
}

/**
 * Adds orbit controls to enable interactive camera movement around the scene.
 * 
 * @param {THREE.Camera} camera - The camera to which the controls will be added.
 * @param {THREE.Renderer} renderer - The renderer on which the camera is rendering.
 */
export function addOrbitControls(camera, renderer) {
    // Initialize orbit controls for interactive camera movement
    new OrbitControls(camera, renderer.domElement);
}
