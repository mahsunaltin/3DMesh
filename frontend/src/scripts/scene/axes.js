import * as THREE from 'three';

/**
 * Creates the axes and labels for the scene.
 * 
 * @param {THREE.Scene} scene - The scene to which the axes will be added.
 * @param {number} axesSize - The size of the axes.
 * 
 * @returns {Object} An object containing the scene, camera, and renderer.
 */
export function createAxes(scene, axesSize, color = 0x090B0B) {
    // Create axes materials
    const axesMaterialOptions = { color: color, transparent: true };

    const xAxisMaterial = new THREE.LineBasicMaterial(axesMaterialOptions);
    const yAxisMaterial = new THREE.LineBasicMaterial(axesMaterialOptions);
    const zAxisMaterial = new THREE.LineBasicMaterial(axesMaterialOptions);

    // X Axis
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-axesSize, 0, 0),
        new THREE.Vector3(axesSize, 0, 0)
    ]);
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    scene.add(xAxis);

    // Y Axis
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -axesSize, 0),
        new THREE.Vector3(0, axesSize, 0)
    ]);
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    scene.add(yAxis);

    // Z Axis
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -axesSize),
        new THREE.Vector3(0, 0, axesSize)
    ]);
    const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
    scene.add(zAxis);

    // Collect all label objects
    const labels = [];
    for (let i = -axesSize; i <= axesSize; i++) {
        if (i !== 0) {
            labels.push(createTextLabel(i.toString(), new THREE.Vector3(i, 0, 0), color));
            labels.push(createTextLabel(i.toString(), new THREE.Vector3(0, i, 0), color));
            labels.push(createTextLabel(i.toString(), new THREE.Vector3(0, 0, i), color));
        }
    }

    // Add labels to the scene
    labels.forEach(label => scene.add(label));


    return {
        xAxis: xAxis, 
        yAxis: yAxis, 
        zAxis: zAxis,
        labels: labels
    };

}

// Function to create a text label
function createTextLabel(text, position, color) {
    const canvas = document.createElement('canvas');
    const size = 64; // Size of the canvas (64x64)
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');

    // Set background to transparent
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Text settings
    context.fillStyle = color; // Text color
    context.textAlign = 'center';
    context.font = '24px Times New Roman';
    context.fillText(text, size / 2, size / 2 + 10);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false, // Disable depth test to avoid rendering issues with transparency
        depthWrite: false // Avoid depth writing
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.5, 0.5); // Adjust sprite size
    sprite.position.copy(position);

    return sprite;
}
