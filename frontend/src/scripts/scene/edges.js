import * as THREE from 'three';

/**
 * Adds edges to a specified group in the scene.
 * 
 * @param {Array} faces - An array of faces, each face being an array of vertices.
 * @param {number|string} color - The color to be applied to the edges.
 * @param {number} opacity - The opacity level of the edges.
 * @param {THREE.Group} group - The group to which these edges will be added.
 */
export function addEdges(faces, color, opacity, group) {
    faces.forEach(face => {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(face.flat());
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const edgesGeometry = new THREE.EdgesGeometry(geometry); // Create edges geometry
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: color, // Edge color
            transparent: true,
            opacity: opacity
        });

        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        group.add(edges); // Add edges to the group
    });
}
