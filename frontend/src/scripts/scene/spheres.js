import * as THREE from 'three';

/**
 * Adds spheres to a specified group in the scene.
 * 
 * @param {Array} points - An array of point coordinates where each sphere will be placed.
 * @param {number|string} color - The color to be applied to the spheres.
 * @param {number} size - The size of each sphere.
 * @param {THREE.Group} group - The group to which these spheres will be added.
 */
export function addSpheres(points, color, size, group) {
    points.forEach(point => {
        // Create a sphere geometry with a base size of 1 for easy scaling
        const geometry = new THREE.SphereGeometry(1, 32, 32); // 32 width and height segments for smoothness

        // Create a basic mesh material with the specified color and transparency enabled
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true
        });

        // Create a mesh from the geometry and material
        const sphere = new THREE.Mesh(geometry, material);

        // Set the position and scale of the sphere based on the input data
        sphere.position.set(...point); // Spread syntax for setting position
        sphere.scale.set(size, size, size); // Scale the sphere to the specified size

        // Add the sphere to the provided group
        group.add(sphere);
    });
}
