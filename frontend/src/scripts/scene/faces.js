import * as THREE from 'three';

/**
 * Adds faces to a specified group in the scene.
 * 
 * @param {Array} faces - An array of faces, each face being an array of vertices.
 * @param {number|string} color - The color to be applied to the faces.
 * @param {number} opacity - The opacity level of the faces.
 * @param {THREE.Group} group - The group to which these faces will be added.
 */
export function addFaces(faces, color, opacity, group) {
    faces.forEach(face => {
        // Create a BufferGeometry for the face
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(face.flat()); // Flatten the array of vertices
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // Set geometry vertices
        geometry.computeVertexNormals(); // Compute normals for lighting calculations

        // Create a material with the specified color and opacity
        const material = new THREE.MeshBasicMaterial({
            color: color, // Face color
            side: THREE.DoubleSide, // Render both sides of the face
            transparent: true, // Allow transparency
            opacity: opacity // Set the opacity level
        });

        // Create a mesh from the geometry and material, and add it to the group
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh); // Add the mesh to the specified group
    });
}
