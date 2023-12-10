import { scene, camera, renderer } from '../main.js';

/**
 * @fileoverview This file exports the 3D mesh visualization to an image.
 * 
 * @param {Object} scene - The scene to export.
 * @param {Object} camera - The camera to export.
 */
export function exportToImage(format) {
    renderer.render(scene, camera);
    var imgData = renderer.domElement.toDataURL(format);
    var link = document.createElement('a');
    link.href = imgData;
    link.download = 'my-threejs-scene.' + format.split('/')[1]; // e.g., jpeg
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    document.getElementById('export-options').classList.add('hidden'); // Hide options after exporting
}