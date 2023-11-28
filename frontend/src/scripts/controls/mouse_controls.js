import * as THREE from 'three';

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