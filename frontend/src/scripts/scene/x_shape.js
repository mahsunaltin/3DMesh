import * as THREE from 'three';

export function createXShape(position, size, color, thickness) {
    const material = new THREE.MeshBasicMaterial({ color: color });

    // Function to create a cylinder representing a part of the "X"
    function createCylinder(start, end) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const orientation = new THREE.Matrix4();
        orientation.lookAt(start, end, new THREE.Object3D().up);
        orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, direction.length(), 0, 0, 0, 1));
        const edgeGeometry = new THREE.CylinderGeometry(thickness, thickness, direction.length(), 8, 1);
        const edge = new THREE.Mesh(edgeGeometry, material);
        edge.applyMatrix4(orientation);
        edge.position.x = (start.x + end.x) / 2;
        edge.position.y = (start.y + end.y) / 2;
        edge.position.z = (start.z + end.z) / 2;
        return edge;
    }

    // Define the two parts of the "X"
    const line1Start = new THREE.Vector3(-size / 2, size / 2, 0);
    const line1End = new THREE.Vector3(size / 2, -size / 2, 0);
    const line2Start = new THREE.Vector3(-size / 2, -size / 2, 0);
    const line2End = new THREE.Vector3(size / 2, size / 2, 0);

    // Create cylinders for each part of the "X"
    const cylinder1 = createCylinder(line1Start, line1End);
    const cylinder2 = createCylinder(line2Start, line2End);

    // Group to hold the two cylinders
    const group = new THREE.Group();
    group.add(cylinder1);
    group.add(cylinder2);

    // Set the position
    group.position.set(position.x, position.y, position.z);

    return group;
}
