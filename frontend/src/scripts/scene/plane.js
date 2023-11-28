import * as THREE from 'three';

/**
 * Creates the axes and labels for the scene.
 * 
 * @param {THREE.Scene} scene - The scene to which the axes will be added.
 * @param {number} axesSize - The size of the axes.
 * 
 * @returns {Object} An object containing the scene, camera, and renderer.
 */
export function createPlanes(scene, planeSize) {
    const divisions = 10;

    // XY Plane (Green)
    const xyPlane = new THREE.GridHelper(planeSize, divisions, 0x090B0B, 0x090B0B);
    xyPlane.rotation.x = Math.PI / 2;
    scene.add(xyPlane);

    // YZ Plane (Red)
    const yzPlane = new THREE.GridHelper(planeSize, divisions, 0x090B0B, 0x090B0B);
    yzPlane.rotation.y = Math.PI / 2;
    scene.add(yzPlane);

    // ZX Plane (Blue)
    const zxPlane = new THREE.GridHelper(planeSize, divisions, 0x090B0B, 0x090B0B);
    zxPlane.rotation.z = Math.PI / 2;
    scene.add(zxPlane);
}
