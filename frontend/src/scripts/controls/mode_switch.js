import { renderer } from './../main.js';

let isDarkMode = false;

export function switchBackgroundColor() {
    const modeText = document.getElementById('modeText');
    const checkbox = document.getElementById('modeSwitch');

    if (renderer) {
        if (checkbox.checked) {
            renderer.setClearColor(0x4A5759, 1); // Dark mode color
            modeText.textContent = 'Dark Mode';
            isDarkMode = true;
        } else {
            renderer.setClearColor(0xF6F6F3, 1); // Light mode color
            modeText.textContent = 'Light Mode';
            isDarkMode = false;
        }
    }
}
