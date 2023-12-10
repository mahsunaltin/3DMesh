import * as THREE from 'three';

/**
 * Creates the axes and labels for the scene.
 * 
 * @param {THREE.Scene} scene - The scene to which the axes will be added.
 * @param {number} axesSize - The size of the axes.
 * 
 * @returns {Object} An object containing the scene, camera, and renderer.
 */
export function createPlanes(scene, planeSize, divisions, color = 0x090B0B) {
    // XY Plane
    const xyPlane = new THREE.GridHelper(planeSize, divisions, color, color);
    xyPlane.rotation.x = Math.PI / 2;
    scene.add(xyPlane);

    // YZ Plane
    const yzPlane = new THREE.GridHelper(planeSize, divisions, color, color);
    yzPlane.rotation.y = Math.PI / 2;
    scene.add(yzPlane);

    // ZX Plane
    const zxPlane = new THREE.GridHelper(planeSize, divisions, color, color);
    zxPlane.rotation.z = Math.PI / 2;
    scene.add(zxPlane);

    return { xyPlane, yzPlane, zxPlane };
}
